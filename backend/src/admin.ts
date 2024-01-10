import { prisma } from "./server";
import { TRPCError } from "@trpc/server";
import { router } from "./trpc";
import { z } from "zod";
import {
  ChallengeSchema,
  ChallengeWhereUniqueInputSchema,
  ContestSchema,
  ContestWhereUniqueInputSchema,
  TaskSchema,
  TaskWhereUniqueInputSchema,
  TestSchema,
  TestWhereUniqueInputSchema,
} from "../prisma/generated/zod";
import { isAdmin, protectedProcedure } from "./auth";

const adminProcedure = protectedProcedure.use(async ({ next, ctx }) => {
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

  updateContest: adminProcedure
    .input(
      z.object({ target: ContestWhereUniqueInputSchema, data: ContestSchema })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.contest.update({
        where: target,
        data: data,
      });
    }),

  updateChallenge: adminProcedure
    .input(
      z.object({
        target: ChallengeWhereUniqueInputSchema,
        data: ChallengeSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      await prisma.challenge.update({
        where: target,
        data: data,
      });
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
