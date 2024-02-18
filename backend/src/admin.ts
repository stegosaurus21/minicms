import { prisma } from "./server";
import { TRPCError } from "@trpc/server";
import { router } from "./trpc";
import { z } from "zod";
import {
  ChallengeSchema,
  ChallengeWhereUniqueInputSchema,
  ContestChallengeCreateWithoutContestInputSchema,
  ContestSchema,
  ContestWhereUniqueInputSchema,
  TaskSchema,
  TaskWhereUniqueInputSchema,
  TestSchema,
  TestWhereUniqueInputSchema,
} from "../prisma/generated/zod";
import { isAdmin, protectedProcedure } from "./auth";

export const adminProcedure = protectedProcedure.use(async ({ next, ctx }) => {
  const { uId } = ctx;

  if (!(await isAdmin(uId)))
    throw new TRPCError({
      message: "You do not have access to administrator controls.",
      code: "UNAUTHORIZED",
    });

  return next();
});

export const adminRouter = router({
  createContest: adminProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      const { id, title } = input;
      await prisma.contest.create({
        data: {
          id: id,
          title: title,
          description: "",
        },
      });
    }),

  createChallenge: adminProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      const { id, title } = input;
      await prisma.challenge.create({
        data: {
          id: id,
          title: title,
          type: "SIMPLE_IO",
          description: "",
          input_format: "",
          output_format: "",
          constraints: "",
          time_limit: 1,
          memory_limit: 128 * 1024,
        },
      });
    }),

  updateContest: adminProcedure
    .input(
      z.object({
        target: ContestWhereUniqueInputSchema,
        data: z.object({
          contest: ContestSchema,
          challenges: z.array(
            z.object({
              challenge_id: z.string(),
              max_score: z.number(),
            })
          ),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      const { challenges: originalChallenges } =
        await prisma.contest.findUniqueOrThrow({
          where: target,
          select: {
            challenges: true,
          },
        });

      await Promise.all(
        originalChallenges.map(async (challenge) => {
          const newData = data.challenges.find(
            (x) => x.challenge_id === challenge.challenge_id
          );
          if (newData) {
            await prisma.contestChallenge.update({
              where: {
                challenge_id_contest_id: {
                  challenge_id: challenge.challenge_id,
                  contest_id: challenge.contest_id,
                },
              },
              data: newData,
            });
          } else {
            await prisma.contestChallenge.delete({
              where: {
                challenge_id_contest_id: {
                  challenge_id: challenge.challenge_id,
                  contest_id: challenge.contest_id,
                },
              },
            });
          }
        })
      );

      data.challenges = data.challenges.filter(
        (challenge) =>
          !originalChallenges.find(
            (x) => x.challenge_id === challenge.challenge_id
          )
      );

      await prisma.contest.update({
        where: target,
        data: {
          challenges: {
            create: data.challenges.map((x) => ({
              challenge: { connect: { id: x.challenge_id } },
              max_score: x.max_score,
            })),
          },
          ...data.contest,
        },
      });
    }),

  updateChallenge: adminProcedure
    .input(
      z.object({
        target: ChallengeWhereUniqueInputSchema,
        data: z.object({
          challenge: ChallengeSchema,
          tasks: z.array(z.any()),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.task.deleteMany({
        where: { challenge_id: target.id },
      });
      try {
        await prisma.challenge.update({
          where: target,
          data: {
            tasks: {
              create: data.tasks,
            },
            ...data.challenge,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  updateTask: adminProcedure
    .input(
      z.object({
        target: TaskWhereUniqueInputSchema,
        data: TaskSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.task.update({
        where: target,
        data: data,
      });
    }),

  updateTest: adminProcedure
    .input(
      z.object({
        target: TestWhereUniqueInputSchema,
        data: TestSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.test.update({
        where: target,
        data: data,
      });
    }),
});
