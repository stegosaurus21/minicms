import { checkContestAuth, checkContestExists } from "../contest";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { protectedProcedure } from "./authRouter";
import { adminProcedure } from "./adminRouter";
import { prisma } from "../server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { ContestValidation } from "../interface";

const publicContestProcedure = publicProcedure
  .input(z.object({ contest: z.string() }))
  .use(async ({ input, next }) => {
    await checkContestExists(input.contest);
    return next();
  });

const protectedContestProcedure = protectedProcedure
  .input(z.object({ contest: z.string() }))
  .use(async ({ input, next }) => {
    await checkContestExists(input.contest);
    return next();
  });

export const contestRouter = router({
  getAdmin: adminProcedure
    .input(z.object({ contest: z.string() }))
    .query(async ({ input }) => {
      const { contest } = input;

      return await prisma.contest.findUniqueOrThrow({
        where: {
          id: contest,
        },
        include: {
          challenges: {
            select: {
              challenge_id: true,
              max_score: true,
            },
          },
        },
      });
    }),

  list: publicProcedure.query(async () => {
    const result = await prisma.contest.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return result;
  }),

  get: publicContestProcedure.query(async ({ input, ctx }) => {
    const { contest } = input;
    const { uId } = ctx;

    const contestObj = await prisma.contest.findUniqueOrThrow({
      where: { id: contest },
      include: {
        challenges: {
          select: {
            max_score: true,
            challenge: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const submissions = await prisma.submission.findMany({
      where: { contest_id: contest, owner_id: uId },
    });

    submissions.forEach(
      (submission) =>
        (submission.score =
          (submission.score || 0) *
          (contestObj.challenges.find(
            (x) => x.challenge.id === submission.challenge_id
          )?.max_score || 100))
    );

    const canViewContest =
      uId !== undefined && (await checkContestAuth(uId, contest)).joined;
    if (!canViewContest) {
      contestObj.challenges.forEach(({ challenge }, i) => {
        challenge.title = `Challenge ${i + 1}`;
        challenge.id = "hidden";
      });
    }

    const result = {
      ...contestObj,
      challenges: contestObj.challenges.map((challenge) => ({
        ...challenge,
        submissions: submissions.filter(
          (x) => x.challenge_id === challenge.challenge.id
        ),
      })),
    };

    return result;
  }),

  join: protectedContestProcedure.mutation(async ({ input, ctx }) => {
    const { contest } = input;
    const { uId } = ctx;
    try {
      return await prisma.participant.create({
        data: {
          user: {
            connect: { id: uId },
          },
          contest: {
            connect: { id: contest },
          },
          time: new Date(),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already in contest.",
          });
        } else throw e;
      } else throw e;
    }
  }),

  validate: publicContestProcedure.query(
    async ({ input, ctx }): Promise<ContestValidation> => {
      const contest = input.contest;
      if (ctx.uId === undefined) return { joined: false, joinTime: null };
      const uId = ctx.uId;

      return await checkContestAuth(uId, contest);
    }
  ),
});
