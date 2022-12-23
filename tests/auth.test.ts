import { clear, ExpectState, testGetSubmissionTestCount, testGetTestResult, testLogin, testRegister, testSubmit } from "./testHelper";

beforeEach(async () => { await clear() });

describe('auth', () => {
  describe('success', () => {
    test('register + login', async () => {
      await testRegister('user1', 'pass1', ExpectState.SUCCESS);
      await testLogin('user1', 'pass1', ExpectState.SUCCESS);
    });
    test('multiple register', async () => {
      await Promise.all([
        testRegister('user1', 'pass1', ExpectState.SUCCESS),
        testRegister('user2', 'pass2', ExpectState.SUCCESS),
        testRegister('user3', 'pass3', ExpectState.SUCCESS)
      ]);
    });
  });
  
  describe('errors', () => {
    test('incorrect username/password', async () => {
      await testRegister('user1', 'pass1');
      await testLogin('user2', 'pass1', ExpectState.FAILURE);
      await testLogin('user1', 'pass2', ExpectState.FAILURE);
    });
    test('taken username', async () => {
      await testRegister('user1', 'pass1');
      await testRegister('user1', 'pass2', ExpectState.FAILURE);
    });
    test('invalid user token for auth routes', async () => {
      await testRegister('user1', 'pass1');
      const userToken = await testLogin('user1', 'pass1');
      const submissionToken = await testSubmit(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io');

      await testSubmit(undefined, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io', ExpectState.FAILURE);
      await testGetSubmissionTestCount(undefined, submissionToken, ExpectState.FAILURE);
      await testGetTestResult(undefined, submissionToken, 0, ExpectState.FAILURE);

      await testSubmit('not-a-valid-token', './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io', ExpectState.FAILURE);
      await testGetSubmissionTestCount('not-a-valid-token', submissionToken, ExpectState.FAILURE);
      await testGetTestResult('not-a-valid-token', submissionToken, 0, ExpectState.FAILURE);
    });
  })
});