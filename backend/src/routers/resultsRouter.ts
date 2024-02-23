import { TRPCError } from "@trpc/server";
import { getChallengeInternal, getChallengeResults } from "../challenge";
import {
  TestResultType,
  awaitTest,
  checkSubmissionAuth,
  checkSubmissionExists,
  getLeaderboard,
  getResult,
  getSource,
  getSubmissionChallenge,
  getTest,
} from "../results";
import { publicProcedure, router } from "../trpc";
import { protectedProcedure } from "./authRouter";
import z from "zod";
import { observable } from "@trpc/server/observable";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

  /*
  getTest: protectedResultsProcedure
    .input(z.object({ task: z.number(), test: z.number() }))
    .query(async ({ input }) => {
      const { submission, task, test } = input;
      return await getTest(submission, task, test);
    }),
  */

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

  getTests: protectedResultsProcedure.subscription(({ input }) => {
    return observable<TestResultType>((emit) => {
      const { submission } = input;
      const getTests = async () => {
        const challenge = await getChallengeInternal(
          await getSubmissionChallenge(submission)
        );
        await Promise.all(
          challenge.tasks.map(async ({ tests, task_number }) => {
            await Promise.all(
              tests.map(async ({ test_number }) => {
                try {
                  emit.next(
                    await getTest(submission, task_number, test_number)
                  );
                } catch (e) {
                  if (e instanceof PrismaClientKnownRequestError) {
                    if (e.code === "P2025") {
                      await new Promise((resolve) => {
                        awaitTest.set(
                          `${submission}/${task_number}/${test_number}`,
                          { emit: emit, resolve: resolve }
                        );
                      });
                    } else throw e;
                  } else throw e;
                }
              })
            );
          })
        );
        emit.complete();
      };

      getTests();

      return () => {
        Array.from(awaitTest.keys()).forEach((k) => {
          if (k.split("/")[0] === submission) awaitTest.delete(k);
        });
      };
    });
  }),
});
