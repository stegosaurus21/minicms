import { getChallengeConfig, getChallengeTests } from "./helper";

export async function getChallengeScoring(challenge: string) {
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

  return result;
}