import { DbPromise } from './helper';
import createError, { HttpError } from 'http-errors';
import { db } from './server';
import { Resolve, Result } from './types';

export const awaitJudge: Map<String, Resolve> = new Map<String, Resolve>();

export async function getSubmissionTestCount(submission: string) {
  try {
    const row = await DbPromise(db, 'get', `
      SELECT count(j.token) AS count 
      FROM Results j 
      JOIN Submissions s ON s.id = j.submission 
      WHERE s.token = ?
    `, [submission]);
    const count = (row as { count: number }).count;
    if (count === 0) {
      throw createError(404, 'Submission not found.');
    }
    return count;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(500, 'Results error');
  }
}

export async function getTest(submission: string, test: number) {
  const numTests = (await getSubmissionTestCount(submission)) as number;

  if (test < 0 || test >= numTests) {
    throw createError(404, 'Test not found.');
  }

  let row = await DbPromise(db, 'get', `
    SELECT r.token, r.time, r.memory, r.status, r.compile_output
    FROM Results r
    JOIN Submissions s ON s.id = r.submission
    WHERE s.token = ? AND r.test_num = ?
  `, [submission, test]) as Result;

  if (row.status === 'In Queue') {
    await new Promise((resolve, reject) => {
      awaitJudge.set(row.token, resolve);
    });
    return getTest(submission, test);
  }
  
  return {
    time: row.time,
    memory: row.memory,
    status: row.status,
    compile_output: row.compile_output
  };
}

export async function judgeCallback(body: any) {
  await DbPromise(db, 'run', `
    UPDATE Results 
    SET (time, memory, status, compile_output) = (?, ?, ?, ?)
    WHERE token = ?
  `, [body.time || 0, body.memory || 0, body.status.description, body.compile_output || "Compilation successful.", body.token]);

  const waiter: Resolve | undefined = awaitJudge.get(body.token);
  if (waiter) {
    (waiter as Resolve)(true);
  }
}