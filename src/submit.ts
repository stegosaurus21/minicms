import fileUpload, { UploadedFile } from 'express-fileupload';
import { access, readdir, readFile } from 'fs/promises';
import createError from 'http-errors';
import fs from 'fs';
import { DbPromise, throwError } from './helper';
import { v4 } from 'uuid';
import { db } from './server';
import config from '../config.json';
import { Token } from './types';
import fetch, { Response } from 'node-fetch';

const DbQueue = [];

export async function submit(files: fileUpload.FileArray | null | undefined, challenge: string, language_id: number): Promise<string> {
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
  
  let challenge_config_exists = false;
  try {
    await access(`${challenge_dir}/config.json`, fs.constants.F_OK);
    challenge_config_exists = true;
  } catch {}
  
  let challenge_config;
  if (challenge_config_exists) {
    try {
      challenge_config = JSON.stringify(await readFile(`${challenge_dir}/config.json`, { encoding: 'utf8' }));
    } catch (err) {
      throw createError(500, 'Challenge error.');
    }
  }

  let src;
  let submission: string;
  let submission_id: number;
  const getIdPromise = await new Promise((resolve, reject) => {
    DbQueue.push(async () => {
      try {
        submission_id = ((await DbPromise(db, 'get', 'SELECT max(id) as max FROM Submissions', [])) as { max: number }).max as number + 1;
        submission = v4();
        
        await Promise.all([
          (files.src as UploadedFile).mv(`./upload/${submission}`),
          DbPromise(db, 'run', 'INSERT INTO Submissions VALUES (?, ?)', [submission_id, submission])
        ]);
    
        src = await readFile(`./upload/${submission}`, { encoding: 'utf8' });

        DbQueue.splice(0, 1);
        if (DbQueue.length > 0) {
          DbQueue[0]();
        }
        resolve(submission_id);
      } catch (err) {
        throw createError(500, `Upload error: ${err.message}`);
      }
    });
    if (DbQueue.length === 1) {
      DbQueue[0]();
    }
  });

  let responses: Response[];
  try {
    const files = await readdir(`${challenge_dir}/in`, { withFileTypes: true });
    if (files.length < 1) {
      throw new Error();
    }

    const IOs = await Promise.all(files.filter(file => file.isFile()).map(
      file => readFile(`${challenge_dir}/in/${file.name}`, { encoding: 'utf8' })
    ).concat(files.filter(file => file.isFile()).map(
      file => readFile(`${challenge_dir}/out/${file.name}`, { encoding: 'utf8' })
    )));
    
    const inputs = IOs.slice(0, files.length);
    const outputs = IOs.slice(files.length, IOs.length);
    
    responses = await Promise.all(inputs.map(
      (input, i) => fetch(`http://${config.JUDGE_URL}:${config.JUDGE_PORT}/submissions`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          source_code: src,
          language_id: language_id,
          stdin: input,
          expected_output: outputs[i],
          cpu_time_limit: challenge_config_exists ? challenge_config.TIME_LIMIT : config.DEF_TIME_LIMIT,
          memory_limit: challenge_config_exists ? challenge_config.MEMORY_LIMIT : config.DEF_MEMORY_LIMIT,
          callback_url: `http://${config.BACKEND_URL === '0.0.0.0' ? 'host.docker.internal' : config.BACKEND_URL}:${config.BACKEND_PORT}/callback`
        })
      })
    ));
    const failedSubmission = responses.find(response => !response.ok);
    let errMessage = "";
    if (failedSubmission) {
      const failureReasons = await failedSubmission.json();
      for (const reason in failureReasons) {
        errMessage = `${errMessage}${reason}: ${(failureReasons[reason] as string[]).join(", ")}\n`;
      }
      throw new Error(errMessage);
    }
    const tokens = (await Promise.all(responses.map(response => response.json()))).map(x => (x as Token).token);
    
    db.serialize(() => {
      const insert = db.prepare('INSERT INTO Results VALUES (?, ?, ?, ?, ?, ?, ?)', throwError);
      tokens.map((token, i) => { insert.run([submission_id, i, token, 0, 0, 'In Queue', ''], throwError) });
      insert.finalize();
    });
  } catch (err) {
    throw createError(500, `Judging error: ${err.message}`);
  }

  return submission;
}