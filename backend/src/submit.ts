import createError, { HttpError } from "http-errors";
import { v4 } from "uuid";
import {
  CALLBACK_URL,
  JUDGE_PORT,
  JUDGE_URL,
  judgeSecret,
  prisma,
} from "./server";
import fetch from "node-fetch";
import { awaitScoring, processResult } from "./results";
import { getChallengeInternal } from "./challenge";
import { SubmitReturn } from "./interface";

export async function submit(
  src: string,
  owner: number,
  contest: string,
  challenge: string,
  language_id: number
): Promise<SubmitReturn> {
  const { tasks, time_limit, memory_limit } = await getChallengeInternal(
    challenge
  );

  let submission: string;
  try {
    submission = v4();
    await prisma.submission.create({
      data: {
        owner: {
          connect: { id: owner },
        },
        challenge: {
          connect: {
            id: challenge,
          },
        },
        contest: {
          connect: {
            id: contest,
          },
        },
        src: src,
        score: null,
        token: submission,
        time: new Date(),
      },
    });
  } catch (err) {
    throw createError(500, `Upload error: ${(err as Error).message}`);
  }

  const totalTests = tasks.reduce((p, n) => p + n.tests.length, 0);
  let resultPromise: Promise<boolean>;
  try {
    resultPromise = new Promise<boolean>((resolve) => {
      awaitScoring.set(submission, { counter: totalTests, resolve: resolve });
    }).then(() => {
      processResult(submission);
      return true;
    });

    const responses = await Promise.all(
      tasks.map((task) =>
        Promise.all(
          task.tests.map((test) =>
            fetch(`http://${JUDGE_URL}:${JUDGE_PORT}/submissions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                source_code: src,
                language_id: language_id,
                stdin: test.input,
                expected_output: test.output,
                cpu_time_limit: time_limit,
                memory_limit: memory_limit,
                callback_url: `${CALLBACK_URL}/callback/${judgeSecret}/${submission}/${
                  task.task_number
                }/${test.test_number}/${Date.now()}`,
              }),
            })
          )
        )
      )
    );

    const failedSubmission = responses
      .flatMap((x) => x)
      .find((response) => !response.ok);
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
