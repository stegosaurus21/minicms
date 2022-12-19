import { clear, ExpectState, testGetSubmissionTestCount, testGetTestResult, testLogin, testRegister, testSubmit } from './testHelper';

let userToken;

beforeAll(async () => {
  await clear();
  await testRegister('user1', 'pass1');
  userToken = await testLogin('user1', 'pass1');
});

describe('results', () => {
  describe('success', () => {
    test('simple_io/overflow.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/overflow.cpp', 54, 'tests/simple_io');
      expect(await testGetSubmissionTestCount(userToken, token, ExpectState.SUCCESS)).toStrictEqual({ tests: 3 });
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Accepted");
      expect((await testGetTestResult(userToken, token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Wrong Answer");
      expect((await testGetTestResult(userToken, token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Accepted");
    });
    test('simple_io/time_limit.py', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/time_limit.py', 71, 'tests/simple_io');
      expect(await testGetSubmissionTestCount(userToken, token)).toStrictEqual(3);
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
      expect((await testGetTestResult(userToken, token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
      expect((await testGetTestResult(userToken, token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
    });
    test('simple_io/compile_error.cpp', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/compile_error.cpp', 54, 'tests/simple_io');
      expect(await testGetSubmissionTestCount(userToken, token)).toStrictEqual(3);
      expect((await testGetTestResult(userToken, token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
      expect((await testGetTestResult(userToken, token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
      expect((await testGetTestResult(userToken, token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
    });
  });

  describe('errors', () => {
    test('invalid token', async () => {
      await Promise.all([
        testGetSubmissionTestCount(userToken, 'not-a-valid-token', ExpectState.FAILURE),
        testGetTestResult(userToken, 'not-a-valid-token', 0, ExpectState.FAILURE)
      ]);
    });
    test('invalid test number', async () => {
      const token = await testSubmit(userToken, './tests/simple_io/pass.py', 71, 'tests/simple_io');
      await Promise.all([
        testGetTestResult(userToken, token, -1, ExpectState.FAILURE),
        testGetTestResult(userToken, token, 4, ExpectState.FAILURE)
      ]);
    });
  });
});