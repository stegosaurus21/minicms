import { access, readdir, readFile } from "fs/promises";
import fs from "fs";
import createError from "http-errors";
import { getPathLeaf, insertKeys, parseTime } from "./helper";
import { getChallengeResults, getChallengeInternal } from "./challenge";
import {
  ChallengeResult,
  Contest,
  ContestChallengeExternal,
  ContestMeta,
  ContestValidation,
} from "./interface";
import { prisma } from "./server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "./auth";

const publicContestProcedure = publicProcedure
  .input(z.object({ contest: z.string() }))
  .use(async ({ input, next }) => {
    await checkContestExists(input.contest);
    return next();
  });

const protectedContestProcedure = protectedProcedure
  .input(z.object({ contest: z.string() }))
  .use(async ({ input, next }) => {
    await checkContestExists(input.contest);
    return next();
  });

export const contestRouter = router({
  list: publicProcedure.query(async () => {
    const result: ContestMeta[] = [];
    for (const path of await explore("./contests", ".json")) {
      if (path.includes("hidden")) continue;
      const contest = await getContestInternal(
        path.slice("./contests/".length, -".json".length)
      );
      const contestMeta: ContestMeta = {
        id: contest.id,
        name: contest.name,
        text: contest.text,
        starts: contest.starts,
        ends: contest.ends,
      };
      result.push(contestMeta);
    }
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }),

  get: publicContestProcedure.query(async ({ input, ctx }) => {
    const { contest } = input;
    const uId = ctx.uId;

    const config = await getContestInternal(contest);
    let text: string;
    try {
      await access(`./contests/${contest}.md`, fs.constants.F_OK);
      text = await readFile(`./contests/${contest}.md`, { encoding: "utf8" });
    } catch (err) {
      console.log(err);
      text = "This contest does not have a description.";
    }

    let challenges: ContestChallengeExternal[] = Array.from(
      { length: config.challenges.length },
      () => ({
        id: "",
        name: "",
        max_score: 0,
        score: 0,
        submissions: 0,
        challenges: [],
      })
    );
    const canViewContest = uId && (await checkContestAuth(uId, contest)).joined;

    await Promise.all(
      config.challenges.map(async (challenge, i) => {
        let results: ChallengeResult = { score: 0, submissions: [] };
        if (canViewContest)
          results = await getChallengeResults(contest, challenge.id, uId);

        const name = (await getChallengeInternal(challenge.id)).name;
        challenges[i] = {
          name: canViewContest ? name : `Challenge ${i + 1}`,
          max_score: challenge.max_score,
          score: results.score,
          submissions: results.submissions.length,
          id: canViewContest ? challenge.id : "hidden",
        };
      })
    );

    return {
      id: contest,
      name: config.name || contest.split("/").slice(-1)[0],
      text: text,
      starts: config.starts || null,
      ends: config.ends || null,
      challenges: challenges,
    };
  }),

  join: protectedContestProcedure.mutation(async ({ input, ctx }) => {
    const { contest } = input;
    const { uId } = ctx;
    try {
      return await prisma.participant.create({
        data: {
          user: {
            connect: { id: uId },
          },
          contest: contest,
          time: new Date(),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw createError(400, "User already in contest.");
        } else throw e;
      } else throw e;
    }
  }),

  validate: publicContestProcedure.query(
    async ({ input, ctx }): Promise<ContestValidation> => {
      const contest = input.contest;
      if (!ctx.uId) return { joined: false, joinTime: null };
      const uId = ctx.uId;

      return await checkContestAuth(uId, contest);
    }
  ),
});

/**
 * Returns a sorted list of JSON filenames in a listed directory.
 * Explores recursively to a given depth.
 *
 * @param {number} path - the path to explore
 * @param {string} fileExt - the file extension that the file name must end with
 * @param {number} maxDepth - the maximum depth to explore to, or -1 for infinite depth
 * @param {number} depth - starting depth, defaults to 0
 * @returns {Promise<string[]>} - a sorted list of paths
 */
export async function explore(
  path: string,
  fileExt: string,
  maxDepth: number = -1,
  depth: number = 0
): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  let results: string[] = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(fileExt))
      results.push(`${path}/${entry.name}`);
    else if (entry.isDirectory() && (maxDepth === -1 || depth < maxDepth))
      results = results.concat(
        await explore(`${path}/${entry.name}`, fileExt, maxDepth, depth + 1)
      );
  }
  results.sort();
  return results;
}

/**
 * Reads the contest configuration from file.
 *
 * @param {string} contest - the contest ID to read
 * @returns {Contest} - the requested contest
 */
export async function getContestInternal(contest: string): Promise<Contest> {
  await checkContestExists(contest);

  let text: string = "This contest does not have a description.";
  try {
    text = await readFile(`./contests/${contest}.md`, { encoding: "utf8" });
  } catch (err) {}

  const def_config: Contest = {
    id: contest,
    name: getPathLeaf(contest),
    text: text,
    starts: null,
    ends: null,
    challenges: [],
  };

  let result = structuredClone(def_config);
  try {
    const config = JSON.parse(
      await readFile(`./contests/${contest}.json`, { encoding: "utf8" })
    );
    config.challenges = config.challenges.map((x: any) =>
      typeof x === "string" ? { id: x, max_score: 100 } : x
    );
    insertKeys(config, result);
  } catch (err) {
    throw createError(500, "Error parsing contest.");
  }

  if (result.starts)
    result.starts = parseTime(result.starts as unknown as string);
  if (result.ends) result.ends = parseTime(result.ends as unknown as string);

  return result;
}

export async function checkContestExists(contest: string) {
  contest = "./contests/" + contest + ".json";

  try {
    await access(contest, fs.constants.F_OK);
    return true;
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Contest not found.",
    });
  }
}

export async function checkContestAuth(
  uId: number,
  contest: string
): Promise<ContestValidation> {
  const userContests = await prisma.participant.findMany({
    select: { contest: true, time: true },
    where: { user_id: uId },
  });
  const result = userContests.find((x) => x.contest === contest);
  if (result !== undefined) {
    return {
      joined: true,
      joinTime: result.time,
    };
  }
  return {
    joined: false,
    joinTime: null,
  };
}

export async function contestIsOpen(contest: string) {
  const config = await getContestInternal(contest);
  if (config.starts && config.starts > Date.now()) return false;
  if (config.ends && config.ends < Date.now()) return false;
  return true;
}

export async function checkContestIsOpen(contest: string) {
  if (await contestIsOpen(contest)) return;
  throw createError(400, "Contest is not open.");
}
