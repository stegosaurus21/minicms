import { contestProblemsHaveScore, DbPromise, getChallengeConfig, getChallengeTests, getContestConfig } from './helper';
import createError, { HttpError } from 'http-errors';
import { db } from './server';
import { Resolve, ResolveCounter, Result, Subtask } from './types';

export const awaitTest: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitResult: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitScoring: Map<String, ResolveCounter> = new Map<String, ResolveCounter>();

export async function getSubmissionTestCount(submission: string) {
  try {
    const exists = await DbPromise(db, 'get', `
      SELECT count(s.token) AS count
      FROM Submissions s
      WHERE s.token = ?
    `, [submission]);
    if (exists['count'] === 0) throw createError(404, 'Submission not found.');

    const row = await DbPromise(db, 'get', `
      SELECT s.challenge
      FROM Submissions s
      WHERE s.token = ?
    `, [submission]);

    return (await getChallengeTests(row['challenge'])).length;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(500, 'Results error');
  }
}

export async function getTest(submission: string, test_num: number) {
  const numTests = (await getSubmissionTestCount(submission)) as number;

  if (test_num < 0 || test_num >= numTests) {
    throw createError(404, 'Test not found.');
  }

  const exists = await DbPromise(db, 'get', `
    SELECT count(r.token) AS count
    FROM Results r
    JOIN Submissions s ON s.id = r.submission
    WHERE s.token = ? AND r.test_num = ?
  `, [submission, test_num]);

  if (exists['count'] === 0) {
    await new Promise((resolve, reject) => {
      awaitTest.set(`${submission}/${test_num}`, resolve);
    });
    return getTest(submission, test_num);
  }

  const row = await DbPromise(db, 'get', `
    SELECT r.token, r.time, r.memory, r.status, r.compile_output
    FROM Results r
    JOIN Submissions s ON s.id = r.submission
    WHERE s.token = ? AND r.test_num = ?
  `, [submission, test_num]) as Result;
  
  return {
    time: row.time,
    memory: row.memory,
    status: row.status,
    compile_output: row.compile_output
  };
}

export async function getResult(submission: string) {
  let exists = await DbPromise(db, 'get', `
    SELECT count(s.token) AS count
    FROM Submissions s
    WHERE s.token = ?
  `, [submission]);
  if (exists['count'] === 0) throw createError(400, 'No such submission.');

  let row = await DbPromise(db, 'get', `
    SELECT s.score
    FROM Submissions s
    WHERE s.token = ?
  `, [submission]);

  if (row['score'] === null) {
    await new Promise((resolve, reject) => {
      awaitResult.set(submission, resolve);
    });
    return getResult(submission);
  }
  
  return row['score'];
}

export async function judgeCallback(body: any, submission_id: number, test_num: number) {
  await DbPromise(db, 'run', `
    INSERT INTO Results 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [submission_id, test_num, body.token, body.time || 0, body.memory || 0, body.status.description, body.compile_output || "Compilation successful."]);

  const submission = (await DbPromise(db, 'get', `
    SELECT s.token AS token
    FROM Submissions s
    WHERE s.id = ?
  `, [submission_id]))['token'];
  
  const waiter: Resolve | undefined = awaitTest.get(`${submission}/${test_num}`);
  if (waiter) {
    (waiter as Resolve)(true);
  }

  const scoreWaiter = awaitScoring.get(submission);
  scoreWaiter.counter -= 1;
  if (scoreWaiter.counter <= 0) {
    scoreWaiter.resolve(true);
  }
}

export async function processResult(submission: string) {
  const rows = await DbPromise(db, 'all', `
    SELECT r.test_num, r.status
    FROM Results r
    JOIN Submissions s ON r.submission = s.id
    WHERE s.token = ?
  `, [submission]);

  const { challenge, contest } = (await DbPromise(db, 'get', `
    SELECT s.challenge, s.contest
    FROM Submissions s
    WHERE s.token = ?
  `, [submission])) as { challenge: string, contest: string };

  const challenge_config = await getChallengeConfig(challenge);
  const files = await getChallengeTests(challenge);
  
  let total_score;
  let submission_score = 0;
  if (challenge_config === undefined || challenge_config.scoring === undefined) {
    total_score = files.length;
    let results = await Promise.all(files.map((_, i) => getTest(submission, i)));
    submission_score = results.filter(result => result.status === 'Accepted').length;
  } else {
    const scoring = (challenge_config.scoring as Subtask[])
    total_score = scoring.reduce((sum, subtask) => sum + subtask.weight, 0);
    for (const subtask of scoring) {
      let results = await Promise.all(subtask.tasks.map(t => getTest(submission, files.map(f => f.name).indexOf(t))));
      switch (subtask.mode) {
        case 'BATCH':
          if (results.find(result => result.status !== 'Accepted') === undefined) submission_score += subtask.weight;
          break;
        case 'INDIVIDUAL':
          submission_score += subtask.weight * (results.filter(result => result.status === 'Accepted').length / results.length);
          break;
      }
    }
  }

  const contest_config = await getContestConfig(contest);

  let result = 0;
  if (!contestProblemsHaveScore(contest_config)) {
    result = 100;
  } else {
    result = contest_config.problems.find(x => x.name === challenge).score;
  }
  result *= submission_score;
  result /= total_score;

  await DbPromise(db, 'run', `
    UPDATE Submissions 
    SET (score) = (?)
    WHERE token = ?
  `, [result, submission]);

  const waiter: Resolve | undefined = awaitResult.get(submission);
  if (waiter) {
    (waiter as Resolve)(true);
  }
}

export async function getLeaderboard(contest: string) {

  const participants = (await DbPromise(db, 'all', `
    SELECT DISTINCT s.owner
    FROM Submissions s
    WHERE s.contest = ?
  `, [contest]) as { owner: number }[]).map(x => x.owner);

  
}