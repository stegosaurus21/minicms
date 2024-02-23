import createError, { HttpError } from "http-errors";
import { prisma } from "./server";
import { LeaderboardEntry, Resolve, ResolveCounter } from "./interface";
import { getContestInternal } from "./contest";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { Observer } from "@trpc/server/observable";

type UnwrapPromise<A> = A extends Promise<infer T> ? T : never;
export type TestResultType = UnwrapPromise<ReturnType<typeof getTest>>;

export const awaitTest: Map<
  string,
  { emit: Observer<TestResultType, unknown>; resolve: Resolve }
> = new Map<
  string,
  { emit: Observer<TestResultType, unknown>; resolve: Resolve }
>();
export const awaitResult: Map<string, Resolve> = new Map<string, Resolve>();
export const awaitScoring: Map<string, ResolveCounter> = new Map<
  string,
  ResolveCounter
>();

/**
 * Gets the challenge associated with a given submission
 *
 * @param {string} submission - the submission ID to get the challenge for
 * @returns {Promise<string>} - the challenge ID the submission is for
 */
export async function getSubmissionChallenge(
  submission: string
): Promise<string> {
  try {
    await checkSubmissionExists(submission);

    return (
      await prisma.submission.findUniqueOrThrow({
        select: { challenge: true },
        where: { token: submission },
      })
    ).challenge.id;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw createError(400, "Submission not found.");
      } else throw err;
    } else if (err instanceof HttpError) throw err;
    else throw err;
  }
}

export async function getTest(
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
/*
export async function getTest(
  submission: string,
  task_number: number,
  test_number: number
) {
  try {
    return await getTestInternal(submission, task_number, test_number);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e);
      if (e.code === "P2025") {
        await new Promise((resolve) => {
          awaitTest.set(`${submission}/${task_number}/${test_number}`, resolve);
        });
        return getTestInternal(submission, task_number, test_number);
      } else throw e;
    } else throw e;
  }
}
*/
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

export async function getResultInternal(submission: string) {
  try {
    const submissionObj = await prisma.submission.findUniqueOrThrow({
      select: { score: true, challenge_id: true, contest_id: true },
      where: { token: submission },
    });
    const { max_score } = await prisma.contestChallenge.findUniqueOrThrow({
      select: { max_score: true },
      where: {
        challenge_id_contest_id: {
          challenge_id: submissionObj.challenge_id,
          contest_id: submissionObj.contest_id,
        },
      },
    });
    if (submissionObj.score === null) return { score: null };
    return { score: submissionObj.score * max_score };
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

  const waiter:
    | { emit: Observer<TestResultType, unknown>; resolve: Resolve }
    | undefined = awaitTest.get(`${submission}/${task_number}/${test_number}`);
  if (waiter) {
    waiter.emit.next(await getTest(submission, task_number, test_number));
    awaitTest.delete(`${submission}/${task_number}/${test_number}`);
    waiter.resolve(true);
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
          tasks: true,
        },
      },
      results: {
        select: {
          status: true,
          task_number: true,
        },
      },
    },
    where: { token: submission },
  });

  const challenge = submission_data.challenge;
  const { results } = submission_data;

  let total_weight = 0;
  let submission_credit = 0;
  challenge.tasks.forEach((task) => {
    total_weight += task.weight;
    const taskResults = results.filter(
      (x) => x.task_number === task.task_number
    );
    switch (task.type) {
      case "BATCH":
        if (taskResults.find((x) => x.status !== "Accepted") === undefined)
          submission_credit += task.weight;
        break;
      case "INDIVIDUAL":
        submission_credit +=
          (task.weight *
            taskResults.filter((x) => x.status === "Accepted").length) /
          taskResults.length;
    }
  });

  const result = submission_credit / total_weight;

  await prisma.submission.update({
    data: { score: result },
    where: { token: submission },
  });

  const waiter: Resolve | undefined = awaitResult.get(submission);
  if (waiter) (waiter as Resolve)(true);
}

export async function getLeaderboard(contest: string) {
  const contest_config = await getContestInternal(contest);
  const contest_end = contest_config.end_time;
  const challenges = contest_config.challenges.map((x) => x.challenge);
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
        owner: {
          admin: false,
        },
      },
      _max: { score: true },
      _count: true,
    })
  ).forEach((item) => {
    const max_score =
      contest_config.challenges.find(
        (x) => x.challenge_id === item.challenge_id
      )?.max_score || 100;
    if (!challenge_map.has(item.challenge_id)) return;
    all[participant_map.get(item.owner_id) as string].results[
      challenge_map.get(item.challenge_id) as number
    ] = {
      score: (item._max.score || 0) * max_score,
      count: item._count,
    };
  });

  if (contest_end) {
    (
      await prisma.submission.groupBy({
        by: ["owner_id", "challenge_id"],
        where: {
          contest_id: contest,
          owner: {
            admin: false,
          },
          time: { lt: contest_end },
        },
        _max: { score: true },
        _count: true,
      })
    ).forEach((item) => {
      const max_score =
        contest_config.challenges.find(
          (x) => x.challenge_id === item.challenge_id
        )?.max_score || 100;
      if (!challenge_map.has(item.challenge_id)) return;
      official[participant_map.get(item.owner_id) as string].results[
        challenge_map.get(item.challenge_id) as number
      ] = {
        score: (item._max.score || 0) * max_score,
        count: item._count,
      };
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
