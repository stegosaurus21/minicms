import { DbPromise } from './helper';
import createError, { HttpError } from 'http-errors';
import { db } from './server';
import { Resolve, ResolveCounter, Result, Subtask } from './types';
import { contestChallengesHaveScore, getContestConfig, getContestChallenges } from './contest';
import { getChallengeConfig, getChallengeTests } from './challenge';
import { readFile } from 'fs/promises';

export const awaitTest: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitResult: Map<String, Resolve> = new Map<String, Resolve>();
export const awaitScoring: Map<String, ResolveCounter> = new Map<String, ResolveCounter>();

async function getSubmissionChallenge(submission: string): Promise<string> {
  try {
    await checkSubmissionExists(submission);

    const row = await DbPromise(db, 'get', `
      SELECT s.challenge
      FROM Submissions s
      WHERE s.token = ?
    `, [submission]);

    return row['challenge'];
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(500, 'Results error');
  }
}

async function getSubmissionTestCount(submission: string): Promise<number> {
  return (await getChallengeTests(await getSubmissionChallenge(submission))).length;
}

export async function getTest(submission: string, test_num: number) {
  const numTests = (await getSubmissionTestCount(submission));

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

export async function checkSubmissionExists(submission: string) {
  let exists = await DbPromise(db, 'get', `
    SELECT count(s.token) AS count
    FROM Submissions s
    WHERE s.token = ?
  `, [submission]);

  if (exists['count'] === 0) throw createError(400, 'No such submission.');
  return true;
}

export async function getResult(submission: string) {
  await checkSubmissionExists(submission);

  let row = await DbPromise(db, 'get', `
    SELECT s.score, s.contest, s.challenge, s.owner
    FROM Submissions s
    WHERE s.token = ?
  `, [submission]);

  if (row['score'] === null) {
    await new Promise((resolve, reject) => {
      awaitResult.set(submission, resolve);
    });
    return getResult(submission);
  }
  
  const previousSubmissions = await getChallengeResults(row['owner'], row['contest'], row['challenge'], false);
  return { score: row['score'] };
}

export async function judgeCallback(body: any, submission_id: number, test_num: number) {
  await DbPromise(db, 'run', `
    INSERT INTO Results 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [submission_id, test_num, body.token, body.time || 0, body.memory || 0, body.status.description, body.compile_output || Buffer.from('Compilation successful.').toString('base64')]);

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
  if (challenge_config.scoring === undefined) {
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
  if (!contestChallengesHaveScore(contest_config)) {
    result = 100;
  } else {
    result = contest_config.challenges.find(x => x.name === challenge).score;
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
  const best_scores = (await DbPromise(db, 'all', `
    SELECT u.username, s.challenge, coalesce(max(s.score), 0) AS score, count(s.token) AS count
    FROM Participants p
    JOIN Users u on p.user = u.id
    LEFT OUTER JOIN Submissions s on s.owner = u.id
    WHERE p.contest = ?
    GROUP BY s.owner, s.challenge
  `, [contest]) as { username: string, challenge: string, score: number, count: number }[]);

  const challenges = await getContestChallenges(contest);
  const problem_index_map = challenges.reduce((prev, next, i) => prev.set(next, i), new Map<string, Number>());

  const total_scores = best_scores.reduce((prev, next) => {
    if (!prev[next.username]) prev[next.username] = challenges.map(x => ({score: 0, number: 0}));
    if (next.count > 0) prev[next.username][problem_index_map.get(next.challenge)] = { score: next.score, count: next.count };
    return prev;
  }, {});

  const result: {name: string, scores: {score: number, count: number}[]}[] = [];
  for (const user in total_scores) {
    result.push({name: user, scores: total_scores[user]});
  }
  result.sort((a, b) => (b.scores.reduce((p, n) => p + n.score, 0) - (a.scores.reduce((p, n) => p + n.score, 0)) || a.name.localeCompare(b.name)));

  const contest_config = await getContestConfig(contest);
  let max_scores;
  if (contestChallengesHaveScore(contest_config)) max_scores = contest_config.challenges.map(x => x.score);
  else max_scores = challenges.map(x => 100);

  return {max_scores: max_scores, leaderboard: result};
}

export async function getChallengeResults(uId: number, contest: string, challenge: string, score: boolean) {
  const results = (await DbPromise(db, 'all', `
    SELECT s.time, s.token, s.score
    FROM Submissions s
    WHERE (s.owner = ? AND s.contest = ? AND s.challenge = ?)
    ORDER BY s.time DESC
  `, [uId, contest, challenge])) as { time: number, token: string, score: number }[];

  if (!score) return { submissions: results.map((x, i) => ({
    time: x.time,
    token: x.token,
    score: x.score,
    index: results.length - i
  })) };
  return { score: results.reduce((prev, next) => next.score > prev ? next.score : prev, 0) };
}

export async function checkSubmissionAuth(uId: number, submission: string) {
  try {
    await checkSubmissionExists(submission);
  } catch (err) {
    throw err;
  }
  const owner = await DbPromise(db, 'get', `
    SELECT s.owner
    FROM Submissions s
    WHERE s.token = ?
  `, [submission]);
  if (owner['owner'] === uId) return;
  throw createError(403, 'Cannot access this submission.');
}

export async function getSource(submission: string) {
  const src = await readFile(`./upload/${submission}`, { encoding: 'utf8' });
  return { src: src };
}