import { protectedProcedure } from "./auth";
import { prisma } from "./server";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
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
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const { uId } = ctx;
    return isAdmin(uId);
  }),

  updateContest: adminProcedure
    .input(
      z.object({ target: ContestWhereUniqueInputSchema, data: ContestSchema })
    )
    .mutation(async ({ input }) => {
      const { target, data } = input;
      prisma.contest.update({
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
      prisma.challenge.update({
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
      prisma.task.update({
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
      prisma.test.update({
        where: target,
        data: data,
      });
    }),
});

async function isAdmin(uId: number) {
  return (
    await prisma.user.findUniqueOrThrow({
      select: {
        admin: true,
      },
      where: {
        id: uId,
      },
    })
  ).admin;
}
