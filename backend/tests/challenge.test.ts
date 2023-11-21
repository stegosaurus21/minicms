import { clear, testContestJoin, testGetChallengeScoring, testLogin, testRegister } from "./testHelper";

let userToken;

beforeAll(async () => {
  await clear();
  await testRegister('user1', 'pass1');
  userToken = await testLogin('user1', 'pass1');
  await testContestJoin(userToken, 'tests/simple');
});

describe('challenge', () => {
  describe('success', () => {
    test('simple_io', async () => {
      expect(await testGetChallengeScoring(userToken, 'tests/simple_io')).toStrictEqual({ tests: 3 });
    });
    test('simple_io', async () => {
      expect(await testGetChallengeScoring(userToken, 'tests/simple_io_subtasks')).toStrictEqual({
        tests: 4,
        scoring: [
          {
            weight: 1,
            mode: "BATCH",
            tasks: [0, 1]
          },
          {
            weight: 3,
            mode: "INDIVIDUAL",
            tasks: [3, 2]
          }
        ] 
      });
    });
  });
})