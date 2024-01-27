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

  if (!isAdmin(uId))
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
          challenges: z.array(ContestChallengeCreateWithoutContestInputSchema),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.contest.update({
        where: target,
        data: {
          challenges: {
            deleteMany: {},
          },
        },
      });
      await prisma.contest.update({
        where: target,
        data: {
          challenges: {
            create: data.challenges,
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
