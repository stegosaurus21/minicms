import createError from "http-errors";
import { ContestValidation } from "./interface";
import { prisma } from "./server";
import { isAdmin } from "./auth";

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
