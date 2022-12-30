import { access, readdir, readFile } from "fs/promises";
import { getTime, parse } from 'date-fns';
import fs from 'fs';
import createError, { HttpError } from 'http-errors';
import { DbPromise, parseTime } from "./helper";
import { db } from "./server";
import { getChallengeConfig } from "./challenge";
import { getChallengeResults } from "./results";

export async function explore(path: string, maxDepth: number = -1, depth: number = 0): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) results.push(`${path}/${entry.name}`);
    else if (entry.isDirectory() && (maxDepth === -1 || depth < maxDepth)) results = results.concat(await explore(`${path}/${entry.name}`, maxDepth, depth + 1));
  }
  results.sort();
  return results;
}

export async function getContest(contest: string) {
  await checkContestExists(contest);

  const config = await getContestConfig(contest);
  let text: string;
  try {
    await access(`./contests/${contest}.md`, fs.constants.F_OK); 
    text = await readFile(`./contests/${contest}.md`, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
    text = 'This contest does not have a description.';
  }
  return { 
    name: config.name || contest.split('/').slice(-1),
    text: text,
    opens: config.starts || null,
    closes: config.ends || null
  };
}

export async function getContests() {
  const result = [];
  for (const path of await explore('./contests')) {
    if (path.split('/').find(sub => sub.includes('hidden')) !== undefined) continue;
    const config = await getContestConfig(path.slice('./contests/'.length, -('.json'.length)));
    result.push({
      name: config.name || path.split('/').slice(-1)[0].slice(0, -('.json'.length)),
      id: path.slice('./contests/'.length, -('.json'.length)),
      starts: config.starts ? parseTime(config.starts): -Infinity,
      ends: config.ends ? parseTime(config.ends) : Infinity
    });
  };
  result.sort((a, b) => b.ends - a.ends || b.starts - a.starts || a.name.localeCompare(b.name));
  return result;
}

export function contestChallengesHaveScore(contest_config: any) {
  return (typeof contest_config.challenges[0] !== 'string');
}

export async function getContestChallenges(contest: string): Promise<string[]> {
  const contest_config = await getContestConfig(contest);
  if (contestChallengesHaveScore(contest_config)) return contest_config.challenges.map(p => p.name);
  return contest_config.challenges;
}

export async function getContestChallengesServer(uId: number, contest: string) {
  const contest_config = await getContestConfig(contest);
  let result = [];
  const hasScore = contestChallengesHaveScore(contest_config);
  for (const challenge of contest_config.challenges) {
    const name = (await getChallengeConfig(hasScore ? challenge.name : challenge)).name;
    result.push({
      name: name,
      score: hasScore ? challenge.score : 100,
      submissions: (await getChallengeResults(uId, contest, hasScore ? challenge.name : challenge, false)).submissions.length,
      id: hasScore ? challenge.name : challenge
    });
  }
  return result;
}

export async function getContestConfig(contest: string) {
  await checkContestExists(contest);

  contest = './contests/' + contest + '.json';
  let contest_config;
  try {
    contest_config = JSON.parse(await readFile(contest, { encoding: 'utf8' }));
  } catch (err) {
    throw createError(500, 'Challenge error.');
  }

  return contest_config;
}

export async function contestIsOpen(contest: string) {
  const config = await getContestConfig(contest);
  if (config.starts && parseTime(config.starts) > Date.now()) return false;
  if (config.ends && parseTime(config.ends) < Date.now()) return false;
  return true;
}

export const DbJoinQueue = [];

export async function joinContest(uId: number, contest: string) {
  await new Promise((resolve, reject) => {
    DbJoinQueue.push(async () => {
      try {
        if ((await userContests(uId)).includes(contest)) {
          DbJoinQueue.splice(0, 1);
          if (DbJoinQueue.length > 0) {
            DbJoinQueue[0]();
          }

          return reject(createError(400, 'User already in contest.'));
        }
        await DbPromise(db, 'run', `
          INSERT INTO Participants
          VALUES (?, ?)
        `, [uId, contest]);

        DbJoinQueue.splice(0, 1);
        if (DbJoinQueue.length > 0) {
          DbJoinQueue[0]();
        }
        resolve(true);
      } catch (err) {
        if (err instanceof HttpError) throw err;
        throw createError(500, `Join error: ${err.message}`);
      }
    });
    if (DbJoinQueue.length === 1) {
      DbJoinQueue[0]();
    }
  });
}

export async function checkContestExists(contest: string) {
  contest = './contests/' + contest + '.json';

  try {
    await access(contest, fs.constants.F_OK);
    return true;
  } catch {
    throw createError('404', 'Contest not found.');
  }
}

export async function checkContestAuth(uId: number, contest: string) {
  if ((await userContests(uId)).includes(contest)) {
    return;
  }
  throw createError(403, 'Cannot access this contest.');
}

export async function userActiveContests(uId: number) {
  const rows = (await DbPromise(db, 'all', `
    SELECT DISTINCT p.contest
    FROM Participants p
    WHERE p.user = ?
  `, [uId]) as { contest: string }[]);
  
  const result = [];
  for (const { contest } of rows) {
    if (await contestIsOpen(contest)) result.push(contest);
  }

  return result;
}

export async function userContests(uId: number) {
  const result =  (await DbPromise(db, 'all', `
    SELECT DISTINCT p.contest
    FROM Participants p
    WHERE p.user = ?
  `, [uId]) as { contest: string }[]).map(x => x.contest);
  return result;
}

export async function getChallengeScoreInContest(contest: string, challenge: string) {
  const contest_config = await getContestConfig(contest);
  return (contestChallengesHaveScore(contest_config) ? contest_config.challenges.find(x => x.name === challenge).score : 100);
}