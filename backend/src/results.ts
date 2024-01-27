import createError, { HttpError } from "http-errors";
import { prisma } from "./server";
import { LeaderboardEntry, Resolve, ResolveCounter } from "./interface";
import { getContestInternal } from "./contest";
import { getChallengeResults } from "./challenge";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { protectedProcedure } from "./auth";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const awaitTest: Map<string, Resolve> = new Map<string, Resolve>();
export const awaitResult: Map<string, Resolve> = new Map<string, Resolve>();
export const awaitScoring: Map<string, ResolveCounter> = new Map<
  string,
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
    .input(z.object({ task: z.number(), test: z.number() }))
    .query(async ({ input }) => {
      const { submission, task, test } = input;
      return await getTest(submission, task, test);
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
    .query(async ({ input }) => {
      const { contest } = input;
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
    ).challenge.challenge_id;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw createError(400, "Submission not found.");
      } else throw err;
    } else if (err instanceof HttpError) throw err;
    else throw err;
  }
}

async function getTestInternal(
  submission: string,
  task_number: number,
  test_number: number
) {
  return await prisma.result.findUniqueOrThrow({
    select: {
      token: true,
      test_number: true,
      task_number: true,
      time: true,
      memory: true,
      status: true,
      compile_output: true,
    },
    where: {
      submission_token_task_number_test_number: {
        submission_token: submission,
        test_number: test_number,
        task_number: task_number,
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
export async function getTest(
  submission: string,
  task_number: number,
  test_number: number
) {
  try {
    return await getTestInternal(submission, task_number, test_number);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        await new Promise((resolve) => {
          awaitTest.set(`${submission}/${task_number}/${test_number}`, resolve);
        });
        return getTestInternal(submission, task_number, test_number);
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
  const result = await getResultInternal(submission);
  if (result.score === null) {
    await new Promise((resolve) => {
      awaitResult.set(submission, resolve);
    });
    return await getResultInternal(submission);
  }

  return result;
}

export async function judgeCallback(
  body: any,
  submission: string,
  task_number: number,
  test_number: number
) {
  const challenge = await getSubmissionChallenge(submission);

  await prisma.result.create({
    data: {
      submission: {
        connect: { token: submission },
      },
      challenge_id: challenge,
      task_number: task_number,
      test_number: test_number,
      token: body.token,
      time: parseFloat(body.time) || 0,
      memory: body.memory || 0,
      status: body.status.description,
      compile_output:
        body.compile_output ||
        Buffer.from("Compilation successful.").toString("base64"),
    },
  });

  const waiter: Resolve | undefined = awaitTest.get(
    `${submission}/${task_number}/${test_number}`
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
  const submission_data = await prisma.submission.findUniqueOrThrow({
    select: {
      challenge: {
        select: {
          challenge: {
            select: {
              tasks: true,
            },
          },
          max_score: true,
        },
      },
      results: {
        select: {
          status: true,
        },
      },
    },
    where: { token: submission },
  });

  const { challenge, max_score } = submission_data.challenge;
  const { results } = submission_data;

  let total_weight = 0;
  let submission_credit = 0;
  challenge.tasks.forEach((task) => {
    total_weight += task.weight;
    switch (task.type) {
      case "BATCH":
        if (results.find((x) => x.status !== "Accepted") === undefined)
          submission_credit += task.weight;
        break;
      case "INDIVIDUAL":
        submission_credit +=
          (task.weight *
            results.filter((x) => x.status === "Accepted").length) /
          results.length;
    }
  });

  const result = (max_score * submission_credit) / total_weight;

  await prisma.submission.update({
    data: { score: result },
    where: { token: submission },
  });

  const waiter: Resolve | undefined = awaitResult.get(submission);
  if (waiter) (waiter as Resolve)(true);
}

export async function getLeaderboard(contest: string) {
  const contest_end = (await getContestInternal(contest)).end_time;
  const challenges = (await getContestInternal(contest)).challenges.map(
    (x) => x.challenge
  );
  const challenge_map = challenges.reduce(
    (prev, next, i) => prev.set(next.id, i),
    new Map<string, number>()
  );

  const participants = await prisma.participant.findMany({
    select: { user: { select: { username: true, id: true } }, time: true },
    where: { contest_id: contest },
  });
  const participant_map = participants.reduce(
    (prev, next) => prev.set(next.user.id, next.user.username),
    new Map<number, string>()
  );

  const official: Record<string, LeaderboardEntry> = {};
  const all: Record<string, LeaderboardEntry> = {};
  for (const { user, time } of participants) {
    if (contest_end === null || time < contest_end) {
      official[user.username] = {
        results: challenges.map(() => ({
          score: 0,
          count: 0,
        })),
      };
    }
    all[user.username] = {
      results: challenges.map(() => ({
        score: 0,
        count: 0,
      })),
    };
  }

  (
    await prisma.submission.groupBy({
      by: ["owner_id", "challenge_id"],
      where: {
        contest_id: contest,
      },
      _max: { score: true },
      _count: true,
    })
  ).forEach((item) => {
    if (!challenge_map.has(item.challenge_id)) return;
    all[participant_map.get(item.owner_id) as string].results[
      challenge_map.get(item.challenge_id) as number
    ] = { score: item._max.score || 0, count: item._count };
  });

  if (contest_end) {
    (
      await prisma.submission.groupBy({
        by: ["owner_id", "challenge_id"],
        where: {
          contest_id: contest,
          time: { lt: contest_end },
        },
        _max: { score: true },
        _count: true,
      })
    ).forEach((item) => {
      if (!challenge_map.has(item.challenge_id)) return;
      official[participant_map.get(item.owner_id) as string].results[
        challenge_map.get(item.challenge_id) as number
      ] = { score: item._max.score || 0, count: item._count };
    });
  }
  return {
    all: all,
    official: contest_end ? official : all,
  };
}

/* export async function getChallengeResults(
  uId: number,
  contest: string,
  challenge: string
): Promise<ChallengeResult> {
  
} */

export async function checkSubmissionAuth(uId: number, submission: string) {
  await checkSubmissionExists(submission);

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
