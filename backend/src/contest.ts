import createError from "http-errors";
import { ContestValidation } from "./interface";
import { prisma } from "./server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { isAdmin, protectedProcedure } from "./auth";
import { adminProcedure } from "./admin";

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

    const result = await prisma.contest.findUniqueOrThrow({
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
            submissions: {
              where: {
                owner_id: uId,
              },
            },
          },
        },
      },
    });

    const canViewContest =
      uId !== undefined && (await checkContestAuth(uId, contest)).joined;
    if (!canViewContest) {
      result.challenges.forEach(({ challenge }, i) => {
        challenge.title = `Challenge ${i + 1}`;
        challenge.id = "hidden";
      });
    }

    console.log(result);

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
          throw createError(400, "User already in contest.");
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

/**
 * Reads the contest configuration from the database.
 *
 * @param {string} contest - the contest ID to read
 * @returns the requested contest
 */
export async function getContestInternal(contest: string) {
  const result = await prisma.contest.findUniqueOrThrow({
    where: { id: contest },
    include: { challenges: { include: { challenge: true } } },
  });

  return result;
}

export async function checkContestExists(contest: string) {
  return (
    (await prisma.contest.findUnique({
      where: { id: contest },
    })) !== null
  );
}

export async function checkContestAuth(
  uId: number,
  contest: string
): Promise<ContestValidation> {
  if (await isAdmin(uId)) {
    return {
      joined: true,
      joinTime: new Date(0),
    };
  }

  const result = await prisma.participant.findUnique({
    select: { contest: true, time: true },
    where: {
      user_id_contest_id: {
        user_id: uId,
        contest_id: contest,
      },
    },
  });

  if (result !== null) {
    return {
      joined: true,
      joinTime: result.time,
    };
  }
  return {
    joined: false,
    joinTime: null,
  };
}

export async function contestIsOpen(contest: string) {
  const config = await getContestInternal(contest);
  if (config.start_time && config.start_time > new Date()) return false;
  if (config.end_time && config.end_time < new Date()) return false;
  return true;
}

export async function checkContestIsOpen(contest: string) {
  if (await contestIsOpen(contest)) return;
  throw createError(400, "Contest is not open.");
}
