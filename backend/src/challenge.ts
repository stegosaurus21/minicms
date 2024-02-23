import {
  checkContestAuth,
  checkContestExists,
  getContestInternal,
} from "./contest";
import { TRPCError } from "@trpc/server";
import { prisma } from "./server";

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
      score:
        (x.score || 0) *
        (contest_config.challenges.find((x) => x.challenge_id === challenge)
          ?.max_score || 0),
      index: i,
      official: contest_config.end_time
        ? x.time <= contest_config.end_time
        : true,
    })),
    score:
      results
        .filter((x) => x.score)
        .reduce(
          (prev, next) =>
            (next.score as number) > prev ? (next.score as number) : prev,
          0
        ) *
      (contest_config.challenges.find((x) => x.challenge_id === challenge)
        ?.max_score || 100),
  };
}

export async function checkChallengeExists(contest: string, challenge: string) {
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
