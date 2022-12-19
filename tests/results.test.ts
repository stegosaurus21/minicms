import { clear, ExpectState, testGetSubmissionTestCount, testGetTestResult, testSubmit } from './testHelper';

beforeAll(clear);

describe('results', () => {
  describe('success', () => {
    test('simple_io/overflow.cpp', async () => {
      const token = (await testSubmit('./tests/simple_io/overflow.cpp', 54, 'tests/simple_io')).token;
      expect(await testGetSubmissionTestCount(token, ExpectState.SUCCESS)).toStrictEqual({ tests: 3 });
      expect((await testGetTestResult(token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Accepted");
      expect((await testGetTestResult(token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Wrong Answer");
      expect((await testGetTestResult(token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Accepted");
    });
    test('simple_io/time_limit.py', async () => {
      const token = (await testSubmit('./tests/simple_io/time_limit.py', 71, 'tests/simple_io')).token;
      expect(await testGetSubmissionTestCount(token)).toStrictEqual({ tests: 3 });
      expect((await testGetTestResult(token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
      expect((await testGetTestResult(token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
      expect((await testGetTestResult(token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Time Limit Exceeded");
    });
    test('simple_io/compile_error.cpp', async () => {
      const token = (await testSubmit('./tests/simple_io/compile_error.cpp', 54, 'tests/simple_io')).token;
      expect(await testGetSubmissionTestCount(token)).toStrictEqual({ tests: 3 });
      expect((await testGetTestResult(token, 0, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
      expect((await testGetTestResult(token, 1, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
      expect((await testGetTestResult(token, 2, ExpectState.SUCCESS)).status).toStrictEqual("Compilation Error");
    });
  });

  describe('errors', () => {
    test('invalid token', async () => {
      await Promise.all([
        testGetSubmissionTestCount('not-a-valid-token', ExpectState.FAILURE),
        testGetTestResult('not-a-valid-token', 0, ExpectState.FAILURE)
      ]);
    });
    test('invalid test number', async () => {
      const token = (await testSubmit('./tests/simple_io/pass.py', 71, 'tests/simple_io')).token;
      await Promise.all([
        testGetTestResult(token, -1, ExpectState.FAILURE),
        testGetTestResult(token, 4, ExpectState.FAILURE)
      ]);
    });
  });
});