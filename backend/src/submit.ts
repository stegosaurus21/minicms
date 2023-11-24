import { access, readFile } from "fs/promises";
import createError, { HttpError } from "http-errors";
import fs from "fs";
import { v4 } from "uuid";
import {
  BACKEND_PORT,
  BACKEND_URL,
  JUDGE_PORT,
  JUDGE_URL,
  judgeSecret,
  prisma,
} from "./server";
import config from "../config.json";
import fetch from "node-fetch";
import { awaitScoring, processResult } from "./results";
import { getChallengeInternal } from "./challenge";
import { SubmitReturn } from "./interface";
import { getContestInternal } from "./contest";

export async function submit(
  src: string,
  owner: number,
  contest: string,
  challenge: string,
  language_id: number
): Promise<SubmitReturn> {
  if (!challenge) {
    throw createError(400, "No challenge specified.");
  }

  if (language_id === undefined || language_id === null) {
    throw createError(400, "No language specified.");
  }
  if (config.disabled_languages.includes(language_id)) {
    throw createError(400, "This language is disabled.");
  }
  const challenge_dir = `./challenges/${challenge}`;
  try {
    await access(challenge_dir, fs.constants.F_OK);
  } catch (err) {
    throw createError(400, "No such challenge.");
  }

  const contest_config = await getContestInternal(contest);
  if (!contest_config.challenges.map((x) => x.id).includes(challenge)) {
    throw createError(400, "Challenge not in contest.");
  }

  const challenge_config = await getChallengeInternal(challenge);
  const challenge_config_exists = challenge_config !== undefined;

  let submission: string;
  try {
    submission = v4();
    await prisma.submission.create({
      data: {
        owner: {
          connect: { id: owner },
        },
        contest: contest,
        challenge: challenge,
        src: src,
        score: null,
        token: submission,
        time: new Date(),
      },
    });
  } catch (err) {
    throw createError(500, `Upload error: ${(err as Error).message}`);
  }

  let resultPromise: Promise<boolean>;
  try {
    const tests = challenge_config.tests;

    resultPromise = new Promise<boolean>((resolve, reject) => {
      awaitScoring.set(submission, { counter: tests.length, resolve: resolve });
    }).then(() => {
      processResult(submission);
      return true;
    });

    const IOs = await Promise.all(
      tests
        .map((file) =>
          readFile(`${challenge_dir}/in/${file.name}`, { encoding: "utf8" })
        )
        .concat(
          tests.map((file) =>
            readFile(`${challenge_dir}/out/${file.name}`, { encoding: "utf8" })
          )
        )
    );

    const inputs = IOs.slice(0, tests.length);
    const outputs = IOs.slice(tests.length, IOs.length);
    const responses = await Promise.all(
      inputs.map((input, i) =>
        fetch(`http://${JUDGE_URL}:${JUDGE_PORT}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: src,
            language_id: language_id,
            stdin: input,
            expected_output: outputs[i],
            cpu_time_limit: challenge_config_exists
              ? challenge_config.time_limit || config.time_limit
              : config.time_limit,
            memory_limit: challenge_config_exists
              ? challenge_config.memory_limit || config.memory_limit
              : config.memory_limit,
            callback_url: `http://${
              BACKEND_URL === "0.0.0.0" ? "host.docker.internal" : BACKEND_URL
            }:${BACKEND_PORT}/callback/${judgeSecret}/${submission}/${i}/${Date.now()}`,
          }),
        })
      )
    );

    const failedSubmission = responses.find((response) => !response.ok);
    let errMessage = "Submission error: ";
    if (failedSubmission) {
      const failureReasons = await failedSubmission.json();
      for (const reason in failureReasons) {
        errMessage = `${errMessage}${reason}: ${(
          failureReasons[reason] as string[]
        ).join(", ")}; `;
      }
      throw createError(400, errMessage);
    }
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(500, `Judging error: ${(err as Error).message}`);
  }

  return { submissionToken: submission, resultPromise: resultPromise };
}
