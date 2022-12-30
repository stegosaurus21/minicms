import { checkContestAuth, contestChallengesHaveScore, getChallengeScoreInContest, getContestChallenges, getContestConfig, userActiveContests } from "./contest";
import createError from 'http-errors';
import { access, readdir, readFile } from "fs/promises";
import fs from 'fs';
import def_config from '../config.json';

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

  if (!challenge_config) challenge_config = {};
  if (!challenge_config.name) challenge_config.name = challenge.split('/').slice(-1);

  return challenge_config;
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

export async function getChallengeScoring(contest: string, challenge: string) {
  const challenge_tests = await getChallengeTests(challenge);
  const test_index_map = challenge_tests.reduce((prev, next, i) => prev.set(next.name, i), new Map<string, Number>());

  const result = {
    tests: challenge_tests.length
  };

  const challenge_config = await getChallengeConfig(challenge);
  if (challenge_config.scoring) result['scoring'] = challenge_config.scoring.map(x => ({
    weight: x.weight,
    mode: x.mode,
    tasks: x.tasks.map(t => test_index_map.get(t))
  }));

  return {
    name: challenge_config.name,
    total_score: await getChallengeScoreInContest(contest, challenge),
    scoring: result
  };
}

export async function checkChallengeAuth(uId: number, contest: string, challenge: string) {
  await checkContestAuth(uId, contest);
  if ((await getContestChallenges(contest)).includes(challenge)) return;
  throw createError(403, 'Cannot access this challenge.');
}

export async function getChallenge(contest: string, challenge: string) {
  const config = await getChallengeConfig(challenge);

  const header = `# ${(config !== undefined && config.name !== undefined) ? config.name : challenge.split('/').slice(-1)}
**Time limit: ${(config !== undefined && config.time_limit !== undefined) ? config.time_limit : def_config.time_limit} seconds**\\
**Memory limit: ${Math.round(((config !== undefined && config.memory_limit !== undefined) ? config.memory_limit : def_config.memory_limit) / 1024 * 100) / 100} MB**`;

  let text: string;
  try {
    await access(`./challenges/${challenge}/text.md`, fs.constants.F_OK); 
    text = await readFile(`./challenges/${challenge}/text.md`, { encoding: 'utf8' });
  } catch (err) {
    text = `This problem does not have a description.\n\n## Scoring\n!auto-scoring`;
  }

  if (text.includes('!auto-example')) {
    for (const match of text.match(/!auto-example{.+}/g)) {
      const cases = match.slice('!auto-example{'.length, -('}'.length)).split('|');
      let casesText = '';
      for (const file of cases) {
        try {
          let input = await readFile(`./challenges/${challenge}/in/${file}`, { encoding: 'utf8' });
          let output = await readFile(`./challenges/${challenge}/out/${file}`, { encoding: 'utf8' });
          input = input.replace(/\n/g, '<br>');
          output = output.replace(/\n/g, '<br>');
          casesText = `${casesText}|${input}|${output}|\n`;
        } catch (err) { console.log(err); }
      }

      text = text.replace(match, 
        
  `
  |Input|Output|
  |-|-|
  ${casesText}`

      );
    }
  }

  if (text.includes('!auto-scoring')) {
    let scoringText = `There are ${(await getChallengeTests(challenge)).length} equally weighted cases in this challenge. Your score will be proportional to the number of accepted cases.`;
    if (config && config.scoring && config.scoring.length > 1) {
      const total_score = config.scoring.reduce((sum, subtask) => sum + subtask.weight, 0);
      scoringText = `There are ${config.scoring.length} subtasks in this challenge, described below:\n${config.scoring.map((x, i) => 
        `\n* Subtask ${i + 1} contains ${x.tasks.length} case${x.tasks.length > 1 ? 's' : ''} marked ${x.mode === 'INDIVIDUAL' ? 'individually' : 'as a group'} and is worth about ${Math.round(x.weight / total_score * 100)}% of the score available for the challenge.${(x.constraints ? ((typeof x.constraints === 'string') ? `\n    * ${x.constraints}` : `\n    * ${x.constraints.join('\n    * ')}`) : '')}`).join('')}`;
    }
    text = text.replace('!auto-scoring', 
    
`Each test case will be judged as accepted if the output is correct and failed otherwise.

${scoringText}`

    );
  }
  
  return {
    header: header,
    text: text,
    max_score: await getChallengeScoreInContest(contest, challenge)
  };
}