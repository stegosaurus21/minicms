import {
  checkChallengeAuth,
  checkChallengeExists,
  getChallengeResults,
} from "../challenge";
import { prisma } from "../server";
import { submit } from "../submit";
import { router } from "../trpc";
import { adminProcedure } from "./adminRouter";
import { protectedProcedure } from "./authRouter";
import z from "zod";

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
              constraints: true,
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
            constraints: true,
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
    } catch {
      return { isViewable: false };
    }
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
