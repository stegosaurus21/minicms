import {
  checkContestAuth,
  checkContestExists,
  getContestInternal,
} from "./contest";
import { router } from "./trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";
import { TRPCError } from "@trpc/server";
import { submit } from "./submit";
import { prisma } from "./server";
import { adminProcedure } from "./admin";

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
  list: adminProcedure.query(async () => {
    return await prisma.challenge.findMany();
  }),

  getAdmin: adminProcedure
    .input(z.object({ challenge: z.string() }))
    .query(async ({ input }) => {
      const { challenge } = input;

      return await prisma.challenge.findUniqueOrThrow({
        where: {
          id: challenge,
        },
        include: {
          tasks: {
            select: {
              tests: {
                select: {
                  test_number: true,
                  is_example: true,
                  comment: true,
                  explanation: true,
                  input: true,
                  output: true,
                },
              },
              type: true,
              task_number: true,
              weight: true,
            },
          },
        },
      });
    }),

  get: protectedChallengeProcedure.query(async ({ input }) => {
    const { contest, challenge } = input;

    return await prisma.contestChallenge.findUniqueOrThrow({
      where: {
        challenge_id_contest_id: {
          challenge_id: challenge,
          contest_id: contest,
        },
      },
      select: {
        max_score: true,
        challenge: {
          select: {
            title: true,
            description: true,
            input_format: true,
            output_format: true,
            time_limit: true,
            memory_limit: true,
            tasks: {
              include: {
                tests: {
                  select: {
                    test_number: true,
                  },
                },
              },
            },
            tests: {
              where: { is_example: true },
              select: {
                task_number: true,
                test_number: true,
                explanation: true,
                input: true,
                output: true,
              },
            },
          },
        },
      },
    });
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
export async function getChallengeInternal(challenge: string) {
  const result = await prisma.challenge.findUniqueOrThrow({
    where: { id: challenge },
    include: {
      tasks: {
        select: {
          task_number: true,
          weight: true,
          type: true,
          tests: {
            select: {
              test_number: true,
              is_example: true,
              input: true,
              output: true,
            },
          },
        },
      },
    },
  });

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
    where: { owner_id: uId, contest_id: contest, challenge_id: challenge },
  });

  return {
    submissions: results.map((x, i) => ({
      time: x.time,
      token: x.token,
      score: x.score,
      index: i,
      official: contest_config.end_time
        ? x.time <= contest_config.end_time
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
      .map(({ challenge }) => challenge.id)
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
      .map(({ challenge }) => challenge.id)
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
