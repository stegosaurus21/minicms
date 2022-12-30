import { clear, ExpectState, testContestJoin, testGetChallengeResults, testGetLeaderboard, testGetSubmissionScore, testGetTestResult, testLogin, testRegister, testSubmit, testSubmitAndWait } from './testHelper';

let userToken;

beforeAll(async () => {
  await clear();
  await testRegister('user1', 'pass1');
  userToken = await testLogin('user1', 'pass1');
  await testContestJoin(userToken, 'tests/simple');
});

describe('results', () => {
  describe('success', () => {
    test('simple_io/overflow.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/overflow.cpp', 54, 'tests/simple', 'tests/simple_io');
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Accepted");
      expect((await testGetTestResult(userToken, token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Wrong Answer");
    });
    test('simple_io/time_limit.py', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/time_limit.py', 71, 'tests/simple', 'tests/simple_io');
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
    });
    test('simple_io/compile_error.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/compile_error.cpp', 54, 'tests/simple', 'tests/simple_io');
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
    });
    test('simple_io_subtasks/pass.py', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io_subtasks');
      expect(await testGetSubmissionScore(userToken, token, ExpectState.SUCCESS)).toStrictEqual({ score: 80 });
    });
    test('simple_io_subtasks/compile_error.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/compile_error.cpp', 54, 'tests/simple', 'tests/simple_io_subtasks');
      expect(await testGetSubmissionScore(userToken, token, ExpectState.SUCCESS)).toStrictEqual({ score: 0 });
    });
    test('simple_io_subtasks/overflow.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/overflow.cpp', 54, 'tests/simple', 'tests/simple_io_subtasks');
      expect(await testGetSubmissionScore(userToken, token, ExpectState.SUCCESS)).toStrictEqual({ score: 30 });
    });

    jest.setTimeout(10000);
    test('leaderboard & challenge results', async () => {
      await clear();
      await testRegister('user1', 'pass1');
      await testRegister('user0', 'pass0');
      await testRegister('user2', 'pass2');
      const userToken2 = await testLogin('user2', 'pass2');
      userToken = await testLogin('user1', 'pass1');
      const userToken0 = await testLogin('user0', 'pass0');
      expect(await testGetLeaderboard(userToken, 'tests/simple', ExpectState.SUCCESS)).toStrictEqual({
        max_scores: [100, 80],
        leaderboard: []
      });
      await testContestJoin(userToken, 'tests/simple');
      await testSubmitAndWait(userToken, './tests/simple_io/overflow.cpp', 54, 'tests/simple', 'tests/simple_io_subtasks');
      expect(await testGetLeaderboard(userToken, 'tests/simple', ExpectState.SUCCESS)).toStrictEqual({
        max_scores: [100, 80],
        leaderboard: [
          {name: 'user1', scores: [0, 30]}
        ]
      });
      await testContestJoin(userToken2, 'tests/simple');
      await testSubmitAndWait(userToken2, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io');
      expect((await testGetLeaderboard(userToken2, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user2', scores: [{score: 100, count: 1}, {score: 0, count: 0}]},
        {name: 'user1', scores: [{score: 0, count: 0}, {score: 30, count: 1}]}
      ]);
      await testContestJoin(userToken0, 'tests/simple');
      await testSubmitAndWait(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io_subtasks');
      expect((await testGetLeaderboard(userToken, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user2', scores: [{score: 100, count: 1}, {score: 0, count: 0}]},
        {name: 'user1', scores: [{score: 0, count: 0}, {score: 80, count: 2}]},
        {name: 'user0', scores: [{score: 0, count: 0}, {score: 0, count: 0}]}
      ]);
      await testSubmitAndWait(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io');
      expect((await testGetLeaderboard(userToken2, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user1', scores: [{score: 100, count: 1}, {score: 80, count: 2}]},
        {name: 'user2', scores: [{score: 100, count: 1}, {score: 0, count: 0}]},
        {name: 'user0', scores: [{score: 0, count: 0}, {score: 0, count: 0}]}
      ]);
      await testSubmitAndWait(userToken2, './tests/simple_io/compile_error.cpp', 54, 'tests/simple', 'tests/simple_io');
      expect((await testGetLeaderboard(userToken, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user1', scores: [{score: 100, count: 1}, {score: 80, count: 2}]},
        {name: 'user2', scores: [{score: 100, count: 2}, {score: 0, count: 0}]},
        {name: 'user0', scores: [{score: 0, count: 0}, {score: 0, count: 0}]}
      ]);
      await testSubmitAndWait(userToken2, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io_subtasks');
      expect((await testGetLeaderboard(userToken2, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user1', scores: [{score: 100, count: 1}, {score: 80, count: 2}]},
        {name: 'user2', scores: [{score: 100, count: 2}, {score: 80, count: 1}]},
        {name: 'user0', scores: [{score: 0, count: 0}, {score: 0, count: 0}]}
      ]);
      await testSubmitAndWait(userToken0, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io_subtasks');
      await testSubmitAndWait(userToken0, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io');
      expect((await testGetLeaderboard(userToken0, 'tests/simple')).leaderboard).toStrictEqual([
        {name: 'user0', scores: [{score: 100, count: 1}, {score: 80, count: 2}]},
        {name: 'user1', scores: [{score: 100, count: 2}, {score: 80, count: 1}]},
        {name: 'user2', scores: [{score: 100, count: 1}, {score: 80, count: 1}]}
      ]);
      expect(await testGetChallengeResults(userToken2, 'tests/simple', 'tests/simple_io', ExpectState.SUCCESS)).toStrictEqual({
        submissions: [
          { time: expect.any(Number), token: expect.any(String), score: 0 , index: 2},
          { time: expect.any(Number), token: expect.any(String), score: 100, index: 1 }
        ]
      });
      expect(await testGetChallengeResults(userToken, 'tests/simple', 'tests/simple_io_subtasks', ExpectState.SUCCESS)).toStrictEqual({
        submissions: [
          { time: expect.any(Number), token: expect.any(String), score: 80, index: 2 },
          { time: expect.any(Number), token: expect.any(String), score: 30, index: 1 }
        ]
      });
    });
  });

  describe('errors', () => {
    test('invalid token', async () => {
      await Promise.all([
        testGetTestResult(userToken, 'not-a-valid-token', 0, ExpectState.FAILURE)
      ]);
    });
    test('invalid test number', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io');
      await Promise.all([
        testGetTestResult(userToken, token, -1, ExpectState.FAILURE),
        testGetTestResult(userToken, token, 4, ExpectState.FAILURE)
      ]);
    });
  });
});