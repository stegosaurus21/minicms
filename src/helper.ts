import sqlite3 from 'sqlite3';
import createError from 'http-errors';
import fs from 'fs';
import { access, readdir, readFile } from 'fs/promises';

export function DbPromise(db: sqlite3.Database, mode: "get" | "all" | "run", sql: string, args: any[]) {
  return new Promise((resolve, reject) => {
    const callback = (err, result) => {
      if (err) throw createError(500, `Database error with query:\n\n${sql}\n\n${err.message}`)
      if (!result && mode !== "run") throw new Error(`SQL Error: No results found for query:\n\n${sql}\n\nArguments:\n\n${args}`);
      resolve(result);
    }
    switch (mode) {
      case "get":
        db.get(sql, args, callback);
        break;
      case "all":
        db.all(sql, args, callback);
        break;
      case "run":
        db.run(sql, args, callback);
        break;
    }
  });
}

export function throwError(err) { if (err) throw err; }

export async function getChallengeConfig(challenge: string) {
  const challenge_dir = `./challenges/${challenge}`;
  let challenge_config_exists = false;
  try {
    await access(`${challenge_dir}/config.json`, fs.constants.F_OK);
    challenge_config_exists = true;
  } catch {}
  
  let challenge_config;
  if (challenge_config_exists) {
    try {
      challenge_config = JSON.parse(await readFile(`${challenge_dir}/config.json`, { encoding: 'utf8' }));
    } catch (err) {
      throw createError(500, 'Challenge error.');
    }
  }

  return challenge_config;
}

export function contestProblemsHaveScore(contest_config: any) {
  return (typeof contest_config.problems[0] !== 'string');
}

export async function getContestProblems(contest: string): Promise<string[]> {
  const contest_config = await getContestConfig(contest);
  if (contestProblemsHaveScore(contest_config)) return contest_config.problems.map(p => p.name);
  return contest_config.problems;
}

export async function getContestConfig(contest: string) {
  let contest_config_exists = false;
  try {
    await access(`./contests/${contest}.json`, fs.constants.F_OK);
    contest_config_exists = true;
  } catch {}
  
  let contest_config;
  if (contest_config_exists) {
    try {
      contest_config = JSON.parse(await readFile(`./contests/${contest}.json`, { encoding: 'utf8' }));
    } catch (err) {
      throw createError(500, 'Challenge error.');
    }
  }

  return contest_config;
}

export async function getChallengeTests(challenge: string) {
  try {
    const files = (await readdir(`./challenges/${challenge}/in`, { withFileTypes: true })).filter(f => f.isFile());
    files.sort((a, b) => a.name.localeCompare(b.name));
    if (files.length < 1) {
      throw new Error();
    }
    return files;
  } catch (err) {
    throw createError(500, `Challenge error: Failed to get tests for ${challenge}.`);
  }
}