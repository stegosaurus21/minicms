import {
  checkContestAuth,
  checkContestExists,
  getContestInternal,
} from "./contest";
import createError, { HttpError } from "http-errors";
import { access, readdir, readFile } from "fs/promises";
import fs from "fs";
import def_config from "../config.json";
import {
  Challenge,
  ChallengeDescription,
  ChallengeExternal,
  ChallengeScoring,
  ContestChallenge,
} from "./interface";
import { getPathLeaf, insertKeys } from "./helper";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";
import { TRPCError } from "@trpc/server";
import { submit } from "./submit";
import { prisma } from "./server";

const publicChallengeProcedure = protectedProcedure
  .input(z.object({ contest: z.string(), challenge: z.string() }))
  .use(async ({ input, next }) => {
    const { contest, challenge } = input;
    await checkChallengeExists(contest, challenge);
    return next();
  });

const protectedChallengeProcedure = publicChallengeProcedure.use(
  async ({ input, ctx, next }) => {
    const { contest, challenge } = input;
    const { uId } = ctx;
    await checkChallengeAuth(uId, contest, challenge);
    return next();
  }
);

export const challengeRouter = router({
  get: protectedChallengeProcedure.query(async ({ input }) => {
    const { contest, challenge } = input;

    const challenge_config = await getChallengeInternal(challenge);
    const contest_config = await getContestInternal(contest);

    const test_index_map = challenge_config.tests.reduce(
      (prev, next, i) => prev.set(next.name, i),
      new Map<string, number>()
    );

    const result = {
      name: challenge_config.name,
      description: await getChallengeDescription(challenge),
      max_score: (
        contest_config.challenges.find(
          (x) => x.id === challenge
        ) as ContestChallenge
      ).max_score,
      tasks: challenge_config.tests.length,
      scoring: challenge_config.scoring.map((x) => ({
        weight: x.weight,
        mode: x.mode,
        tasks: x.tasks.map((t) => test_index_map.get(t) || 0),
      })),
    };

    return result;
  }),

  validate: publicChallengeProcedure.query(async ({ input, ctx }) => {
    const { contest, challenge } = input;
    const { uId } = ctx;
    try {
      await checkChallengeAuth(uId, contest, challenge);
      return { isViewable: true };
    } catch {}
    return { isViewable: false };
  }),

  submit: protectedChallengeProcedure
    .input(z.object({ language_id: z.number(), src: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { contest, challenge, language_id, src } = input;
      const { uId } = ctx;
      const result = await submit(src, uId, contest, challenge, language_id);
      return result.submissionToken;
    }),

  getResults: protectedChallengeProcedure.query(async ({ input, ctx }) => {
    const { contest, challenge } = input;
    const { uId } = ctx;
    return await getChallengeResults(contest, challenge, uId);
  }),
});

/**
 * Returns information for a given challenge. Should not be used externally.
 *
 * @param {string} challenge - the challenge ID
 * @returns {Promise<Challenge>} - the challenge
 */
export async function getChallengeInternal(
  challenge: string
): Promise<Challenge> {
  const challenge_dir = `./challenges/${challenge}`;

  // Get challenge test cases
  let files: fs.Dirent[] = [];
  try {
    files = (
      await readdir(`./challenges/${challenge}/in`, { withFileTypes: true })
    ).filter((f) => f.isFile());
    files.sort((a, b) => a.name.localeCompare(b.name));
    if (files.length < 1) {
      throw new Error();
    }
  } catch (err) {
    throw createError(
      500,
      `Challenge error: Failed to get tests for ${challenge}.`
    );
  }

  // Challenge config defaults
  const default_scoring: ChallengeScoring = {
    weight: 1,
    mode: "INDIVIDUAL",
    tasks: files.map((x) => x.name),
  };

  const default_result: Challenge = {
    id: challenge,
    tests: files,
    name: getPathLeaf(challenge),
    type: "SIMPLE_IO",
    time_limit: def_config.time_limit,
    memory_limit: def_config.memory_limit,
    scoring: [default_scoring],
  };

  // Populate challenge details from JSON configuration
  const result: Challenge = structuredClone(default_result);
  try {
    await access(`${challenge_dir}/config.json`, fs.constants.F_OK);
    try {
      const config = JSON.parse(
        await readFile(`${challenge_dir}/config.json`, { encoding: "utf8" })
      );
      if (config.scoring) {
        config.scoring = await Promise.all(
          config.scoring.map(async (x: any) => {
            return insertKeys(x, structuredClone(default_scoring));
          })
        );
      }
      insertKeys(config, result);
    } catch (err) {
      throw createError(500, "Challenge error.");
    }
  } catch {}

  return result;
}

/**
 * Returns the external facing details for a challenge.
 *
 * @param {string} contest - the contest ID
 * @param {string} challenge - the challenge ID
 * @returns {Promise<ChallengeExternal>} - the external facing challenge details
 */
export async function getChallengeExternal(
  contest: string,
  challenge: string
): Promise<ChallengeExternal> {
  const challenge_config = await getChallengeInternal(challenge);
  const contest_config = await getContestInternal(contest);

  const test_index_map = challenge_config.tests.reduce(
    (prev, next, i) => prev.set(next.name, i),
    new Map<string, number>()
  );

  const result = {
    name: challenge_config.name,
    description: await getChallengeDescription(challenge),
    max_score: (
      contest_config.challenges.find(
        (x) => x.id === challenge
      ) as ContestChallenge
    ).max_score,
    tasks: challenge_config.tests.length,
    scoring: challenge_config.scoring.map((x) => ({
      weight: x.weight,
      mode: x.mode,
      tasks: x.tasks.map((t) => test_index_map.get(t) || 0),
    })),
  };

  return result;
}

export async function getChallengeResults(
  contest: string,
  challenge: string,
  uId: number
) {
  const contest_config = await getContestInternal(contest);
  const results = await prisma.submission.findMany({
    select: { time: true, token: true, score: true },
    where: { owner_id: uId, contest: contest, challenge: challenge },
  });

  return {
    submissions: results.map((x, i) => ({
      time: x.time.getTime(),
      token: x.token,
      score: x.score,
      index: results.length - i,
      official: contest_config.ends
        ? x.time.getTime() <= contest_config.ends
        : true,
    })),
    score: results
      .filter((x) => x.score)
      .reduce(
        (prev, next) =>
          (next.score as number) > prev ? (next.score as number) : prev,
        0
      ),
  };
}

async function checkChallengeExists(contest: string, challenge: string) {
  await checkContestExists(contest);
  if (
    (await getContestInternal(contest)).challenges
      .map((x) => x.id)
      .includes(challenge)
  )
    return;

  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Challenge not found.",
  });
}

/**
 * Checks whether a challenge should be accessible.
 *
 * @param {number} uId - the user accessing the challenge
 * @param {string} contest - the contest ID the challenge is being accessed from
 * @param {string} challenge - the challenge ID
 *
 * @throws {HttpError} - if challenge access is unauthorised
 */
export async function checkChallengeAuth(
  uId: number,
  contest: string,
  challenge: string
) {
  await checkContestAuth(uId, contest);
  if (
    (await getContestInternal(contest)).challenges
      .map((x) => x.id)
      .includes(challenge)
  )
    return;

  // Clients should not be able to find challenge IDs by brute forcing,
  // so this throws the same error as a non-existent challenge.
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Challenge not found.",
  });
}

/**
 * Generates a challenge description.
 *
 * @param {string} challenge - the challenge ID to generate the description for
 * @returns {Promise<ChallengeDescription>} - an object containing the challenge header and body text
 */
export async function getChallengeDescription(
  challenge: string
): Promise<ChallengeDescription> {
  const config = await getChallengeInternal(challenge);

  const header = `# ${
    config !== undefined && config.name !== undefined
      ? config.name
      : challenge.split("/").slice(-1)
  }
**Time limit: ${
    config !== undefined && config.time_limit !== undefined
      ? config.time_limit
      : def_config.time_limit
  } seconds**\\
**Memory limit: ${
    Math.round(
      ((config !== undefined && config.memory_limit !== undefined
        ? config.memory_limit
        : def_config.memory_limit) /
        1024) *
        100
    ) / 100
  } MB**`;

  let text: string;
  try {
    await access(`./challenges/${challenge}/text.md`, fs.constants.F_OK);
    text = await readFile(`./challenges/${challenge}/text.md`, {
      encoding: "utf8",
    });
  } catch (err) {
    text = `This problem does not have a description.\n\n## Scoring\n!auto-scoring`;
  }

  if (text.includes("!auto-example")) {
    for (const match of text.match(/!auto-example{.+}/g) || []) {
      const cases = match
        .slice("!auto-example{".length, -"}".length)
        .split("|");
      let casesText = "";
      for (const file of cases) {
        try {
          let input = await readFile(`./challenges/${challenge}/in/${file}`, {
            encoding: "utf8",
          });
          let output = await readFile(`./challenges/${challenge}/out/${file}`, {
            encoding: "utf8",
          });
          input = input.replace(/\n/g, "<br>");
          output = output.replace(/\n/g, "<br>");
          casesText = `${casesText}|${input}|${output}|\n`;
        } catch (err) {
          console.log(err);
        }
      }

      text = text.replace(
        match,

        `
  |Input|Output|
  |-|-|
  ${casesText}`
      );
    }
  }

  if (text.includes("!auto-scoring")) {
    let scoringText = `There are ${config.tests.length} equally weighted cases in this challenge. Your score will be proportional to the number of accepted cases.`;
    if (config && config.scoring && config.scoring.length > 1) {
      const total_score = config.scoring.reduce(
        (sum, subtask) => sum + subtask.weight,
        0
      );
      scoringText = `There are ${
        config.scoring.length
      } subtasks in this challenge, described below:\n${config.scoring
        .map(
          (x, i) =>
            `\n* Subtask ${i + 1} contains ${x.tasks.length} case${
              x.tasks.length > 1 ? "s" : ""
            } marked ${
              x.mode === "INDIVIDUAL" ? "individually" : "as a group"
            } and is worth about ${Math.round(
              (x.weight / total_score) * 100
            )}% of the score available for the challenge.${
              x.constraints
                ? typeof x.constraints === "string"
                  ? `\n    * ${x.constraints}`
                  : `\n    * ${x.constraints.join("\n    * ")}`
                : ""
            }`
        )
        .join("")}`;
    }
    text = text.replace(
      "!auto-scoring",

      `Each test case will be judged as accepted if the output is correct and failed otherwise.

${scoringText}`
    );
  }

  return {
    header: header,
    body: text,
  };
}
