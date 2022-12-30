import fileUpload, { UploadedFile } from 'express-fileupload';
import { access, readdir, readFile } from 'fs/promises';
import createError, { HttpError } from 'http-errors';
import fs from 'fs';
import { DbPromise } from './helper';
import { v4 } from 'uuid';
import { db, judgeSecret } from './server';
import config from '../config.json';
import { SubmitReturn, Token } from './types';
import fetch, { Response } from 'node-fetch';
import { awaitScoring } from './results';
import { contestIsOpen, getContestChallenges } from './contest';
import { getChallengeConfig, getChallengeTests } from './challenge';

export const DbSubmissionQueue = [];

export async function submit(files: fileUpload.FileArray | null | undefined, owner: number, contest: string, challenge: string, language_id: number): Promise<SubmitReturn> {
  if (!files || !files.src) {
    throw createError(400, 'No file submitted.');
  }
  
  if (!challenge) {
    throw createError(400, 'No challenge specified.');
  }
  
  if (language_id === undefined || language_id === null) {
    throw createError(400, 'No language specified.');
  }
  const challenge_dir = `./challenges/${challenge}`;
  try {
    await access(challenge_dir, fs.constants.F_OK);
  } catch (err) {
    throw createError(400, 'No such challenge.');
  }

  if (!(await contestIsOpen(contest))) {
    throw createError(403, 'Contest is closed.');
  }
  
  if (!(await getContestChallenges(contest)).includes(challenge)) {
    throw createError(400, 'Challenge not in contest.');
  }

  const challenge_config = await getChallengeConfig(challenge);
  const challenge_config_exists = (challenge_config !== undefined);

  let src;
  let submission: string;
  let submission_id: number;
  await new Promise((resolve, reject) => {
    DbSubmissionQueue.push(async () => {
      try {
        submission_id = ((await DbPromise(db, 'get', 'SELECT max(id) as max FROM Submissions', [])) as { max: number }).max as number + 1;
        submission = v4();
        
        await Promise.all([
          (files.src as UploadedFile).mv(`./upload/${submission}`),
          DbPromise(db, 'run', 'INSERT INTO Submissions VALUES (?, ?, ?, ?, ?, ?, ?)', [submission_id, owner, contest, challenge, null, submission, Date.now()])
        ]);
    
        src = await readFile(`./upload/${submission}`, { encoding: 'utf8' });

        DbSubmissionQueue.splice(0, 1);
        if (DbSubmissionQueue.length > 0) {
          DbSubmissionQueue[0]();
        }
        resolve(submission_id);
      } catch (err) {
        throw createError(500, `Upload error: ${err.message}`);
      }
    });
    if (DbSubmissionQueue.length === 1) {
      DbSubmissionQueue[0]();
    }
  });

  let resultPromise;
  try {
    const files = await getChallengeTests(challenge);

    resultPromise = new Promise((resolve, reject) => { awaitScoring.set(submission, { counter: files.length, resolve: resolve })});

    const IOs = await Promise.all(files.map(
      file => readFile(`${challenge_dir}/in/${file.name}`, { encoding: 'utf8' })
    ).concat(files.map(
      file => readFile(`${challenge_dir}/out/${file.name}`, { encoding: 'utf8' })
    )));
    
    const inputs = IOs.slice(0, files.length);
    const outputs = IOs.slice(files.length, IOs.length);
    const responses = await Promise.all(inputs.map(
      (input, i) => fetch(`http://${config.JUDGE_URL}:${config.JUDGE_PORT}/submissions`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          source_code: src,
          language_id: language_id,
          stdin: input,
          expected_output: outputs[i],
          cpu_time_limit: (challenge_config_exists ? (challenge_config.time_limit || config.time_limit) : config.time_limit),
          memory_limit: (challenge_config_exists ? (challenge_config.memory_limit || config.memory_limit) : config.memory_limit),
          callback_url: `http://${config.BACKEND_URL === '0.0.0.0' ? 'host.docker.internal' : config.BACKEND_URL}:${config.BACKEND_PORT}/callback/${judgeSecret}/${submission_id}/${i}/${Date.now()}`
        })
      })
    ));

    const failedSubmission = responses.find(response => !response.ok);
    let errMessage = "Submission error: ";
    if (failedSubmission) {
      const failureReasons = await failedSubmission.json();
      for (const reason in failureReasons) {
        errMessage = `${errMessage}${reason}: ${(failureReasons[reason] as string[]).join(", ")}; `;
      }
      throw createError(400, errMessage);
    }
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(500, `Judging error: ${err.message}`);
  }

  return { submissionToken: submission, resultPromise: resultPromise };
}