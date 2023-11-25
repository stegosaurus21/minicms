import createError, { HttpError } from "http-errors";
import { prisma } from "./server";
import {
  ContestChallenge,
  LeaderboardEntry,
  Resolve,
  ResolveCounter,
} from "./interface";
import { getContestInternal } from "./contest";
import { getChallengeInternal, getChallengeResults } from "./challenge";
import { readFile } from "fs/promises";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { protectedProcedure } from "./auth";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const awaitTest: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitResult: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitScoring: Map<String, ResolveCounter> = new Map<
  String,
  ResolveCounter
>();

const publicResultsProcedure = protectedProcedure
  .input(z.object({ submission: z.string() }))
  .use(async ({ input, next }) => {
    const { submission } = input;
    await checkSubmissionExists(submission);
    return next();
  });
const protectedResultsProcedure = publicResultsProcedure.use(
  async ({ input, ctx, next }) => {
    const { submission } = input;
    const { uId } = ctx;
    await checkSubmissionAuth(uId, submission);
    return next();
  }
);

export const resultsRouter = router({
  getScore: protectedResultsProcedure.query(async ({ input }) => {
    const { submission } = input;
    return (await getResult(submission)).score;
  }),

  getTest: protectedResultsProcedure
    .input(z.object({ test: z.number() }))
    .query(async ({ input, ctx }) => {
      const { submission, test } = input;
      return await getTest(submission, test);
    }),

  getSubmission: protectedResultsProcedure
    .input(z.object({ challenge: z.string(), contest: z.string() }))
    .query(async ({ input, ctx }) => {
      const { contest, challenge, submission } = input;
      const { uId } = ctx;
      const thisSubmission = (
        await getChallengeResults(contest, challenge, uId)
      ).submissions.find((x) => x.token === submission);
      if (thisSubmission === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found in challenge.",
        });
      }
      return {
        source: (await getSource(submission)).src,
        index: thisSubmission.index,
        time: thisSubmission.time,
      };
    }),

  getLeaderboard: publicProcedure
    .input(z.object({ contest: z.string() }))
    .query(async ({ input, ctx }) => {
      const { contest } = input;
      const { uId } = ctx;
      return await getLeaderboard(contest);
    }),

  validate: publicResultsProcedure.query(async ({ input, ctx }) => {
    const { submission } = input;
    const { uId } = ctx;
    try {
      await checkSubmissionAuth(uId, submission);
      return { isViewable: true };
    } catch {
      return { isViewable: false };
    }
  }),
});

/**
 * Gets the challenge associated with a given submission
 *
 * @param {string} submission - the submission ID to get the challenge for
 * @returns {Promise<string>} - the challenge ID the submission is for
 */
async function getSubmissionChallenge(submission: string): Promise<string> {
  try {
    await checkSubmissionExists(submission);

    return (
      await prisma.submission.findUniqueOrThrow({
        select: { challenge: true },
        where: { token: submission },
      })
    ).challenge;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw createError(400, "Submission not found.");
      } else throw err;
    } else if (err instanceof HttpError) throw err;
    else throw err;
  }
}

async function getTestInternal(submission: string, test_num: number) {
  return await prisma.result.findUniqueOrThrow({
    select: {
      token: true,
      time: true,
      memory: true,
      status: true,
      compile_output: true,
    },
    where: {
      submission_token_test_num: {
        submission_token: submission,
        test_num: test_num,
      },
    },
  });
}

/**
 * Gets the results of a given submission and test.
 *
 * @param {string} submission - the submission ID to get tests for
 * @param {number} test_num - the index of the test to get
 * @returns
 */
export async function getTest(submission: string, test_num: number) {
  const numTests = (
    await getChallengeInternal(await getSubmissionChallenge(submission))
  ).tests.length;

  if (test_num < 0 || test_num >= numTests) {
    throw createError(404, "Test not found.");
  }

  try {
    return await getTestInternal(submission, test_num);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        await new Promise((resolve, reject) => {
          awaitTest.set(`${submission}/${test_num}`, resolve);
        });
        return getTestInternal(submission, test_num);
      } else throw e;
    } else throw e;
  }
}

export async function checkSubmissionExists(submission: string) {
  try {
    await prisma.submission.findUniqueOrThrow({ where: { token: submission } });
    return true;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found.",
        });
      }
    }
    throw e;
  }
}

async function getResultInternal(submission: string) {
  try {
    return await prisma.submission.findUniqueOrThrow({
      select: { score: true },
      where: { token: submission },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { score: null };
      }
    }
    throw e;
  }
}

export async function getResult(submission: string): Promise<{
  score: number | null;
}> {
  let result = await getResultInternal(submission);
  if (result.score === null) {
    await new Promise((resolve, reject) => {
      awaitResult.set(submission, resolve);
    });
    return await getResultInternal(submission);
  }

  return result;
}

export async function judgeCallback(
  body: any,
  submission: string,
  test_num: number
) {
  await prisma.result.create({
    data: {
      submission: {
        connect: { token: submission },
      },
      test_num: test_num,
      token: body.token,
      time: parseFloat(body.time) || 0,
      memory: body.memory || 0,
      status: body.status.description,
      compile_output:
        body.compile_output ||
        Buffer.from("Compilation sucessful.").toString("base64"),
    },
  });

  const waiter: Resolve | undefined = awaitTest.get(
    `${submission}/${test_num}`
  );
  if (waiter) {
    (waiter as Resolve)(true);
  }

  const scoreWaiter = awaitScoring.get(submission);
  if (!scoreWaiter)
    throw Error("Judge callback error: couldn't find associated submission.");

  scoreWaiter.counter -= 1;
  if (scoreWaiter.counter <= 0) {
    scoreWaiter.resolve(true);
  }
}

export async function processResult(submission: string) {
  const { challenge, contest } = await prisma.submission.findUniqueOrThrow({
    select: { challenge: true, contest: true },
    where: { token: submission },
  });

  const challenge_config = await getChallengeInternal(challenge);
  const files = challenge_config.tests;

  let total_score;
  let submission_score = 0;
  if (challenge_config.scoring === undefined) {
    total_score = files.length;
    let results = await Promise.all(
      files.map((_, i) => getTest(submission, i))
    );
    submission_score = results.filter(
      (result) => result.status === "Accepted"
    ).length;
  } else {
    const scoring = challenge_config.scoring;
    total_score = scoring.reduce((sum, subtask) => sum + subtask.weight, 0);
    for (const subtask of scoring) {
      let results = await Promise.all(
        subtask.tasks.map((t) =>
          getTest(submission, files.map((f) => f.name).indexOf(t))
        )
      );
      switch (subtask.mode) {
        case "BATCH":
          if (
            results.find((result) => result.status !== "Accepted") === undefined
          )
            submission_score += subtask.weight;
          break;
        case "INDIVIDUAL":
          submission_score +=
            subtask.weight *
            (results.filter((result) => result.status === "Accepted").length /
              results.length);
          break;
      }
    }
  }

  const contest_config = await getContestInternal(contest);

  let result = 0;
  result = (
    contest_config.challenges.find(
      (x) => x.id === challenge
    ) as ContestChallenge
  ).max_score;

  result *= submission_score;
  result /= total_score;

  await prisma.submission.update({
    data: { score: result },
    where: { token: submission },
  });

  const waiter: Resolve | undefined = awaitResult.get(submission);
  if (waiter) {
    (waiter as Resolve)(true);
  }
}

export async function getLeaderboard(contest: string) {
  const contest_config = await getContestInternal(contest);
  const contest_end = contest_config.ends
    ? new Date(contest_config.ends)
    : null;
  const challenges = (await getContestInternal(contest)).challenges;
  const challenge_map = challenges.reduce(
    (prev, next, i) => prev.set(next.id, i),
    new Map<string, number>()
  );

  const participants = await prisma.participant.findMany({
    select: { user: { select: { username: true, id: true } }, time: true },
    where: { contest: contest },
  });
  const participant_map = participants.reduce(
    (prev, next) => prev.set(next.user.id, next.user.username),
    new Map<number, string>()
  );

  const official: Record<string, LeaderboardEntry> = {};
  const all: Record<string, LeaderboardEntry> = {};
  for (const { user, time } of participants) {
    if (contest_end == null || time < contest_end) {
      official[user.username] = {
        results: challenges.map((_) => ({
          score: 0,
          count: 0,
        })),
      };
    }
    all[user.username] = {
      results: challenges.map((_) => ({
        score: 0,
        count: 0,
      })),
    };
  }

  (
    await prisma.submission.groupBy({
      by: ["owner_id", "challenge"],
      where: {
        contest: contest,
      },
      _max: { score: true },
      _count: true,
    })
  ).forEach((item) => {
    if (!challenge_map.has(item.challenge)) return;
    all[participant_map.get(item.owner_id) as string].results[
      challenge_map.get(item.challenge) as number
    ] = { score: item._max.score || 0, count: item._count };
  });

  if (contest_end) {
    (
      await prisma.submission.groupBy({
        by: ["owner_id", "challenge"],
        where: {
          contest: contest,
          time: { lt: contest_end },
        },
        _max: { score: true },
        _count: true,
      })
    ).forEach((item) => {
      if (!challenge_map.has(item.challenge)) return;
      official[participant_map.get(item.owner_id) as string].results[
        challenge_map.get(item.challenge) as number
      ] = { score: item._max.score || 0, count: item._count };
    });
  }

  return {
    all: all,
    official: official,
  };
}

/* export async function getChallengeResults(
  uId: number,
  contest: string,
  challenge: string
): Promise<ChallengeResult> {
  
} */

export async function checkSubmissionAuth(uId: number, submission: string) {
  try {
    await checkSubmissionExists(submission);
  } catch (err) {
    throw err;
  }

  const owner = await prisma.submission.findUniqueOrThrow({
    select: { owner_id: true },
    where: { token: submission },
  });
  if (owner.owner_id === uId) return;
  throw createError(403, "Cannot access this submission.");
}

export async function getSource(submission: string) {
  try {
    return await prisma.submission.findUniqueOrThrow({
      select: { src: true },
      where: { token: submission },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw createError(400, "Submission not found.");
      } else throw err;
    } else if (err instanceof HttpError) throw err;
    else throw err;
  }
}
