import { clear, testSubmit, ExpectState, testRegister, testLogin } from './testHelper';

let userToken;

beforeAll(async () => {
  await clear();
  await testRegister('user1', 'pass1');
  userToken = await testLogin('user1', 'pass1');
});

describe('submit', () => {
  describe('success', () => {
    test('simple_io', async () => {
      await Promise.all([
        testSubmit(userToken, './tests/simple_io/pass.py', 71, 'tests/simple', 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit(userToken, './tests/simple_io/overflow.cpp', 54, 'tests/simple', 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit(userToken, './tests/simple_io/compile_error.cpp', 54, 'tests/simple', 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit(userToken, './tests/simple_io/time_limit.py', 71, 'tests/simple', 'tests/simple_io', ExpectState.SUCCESS)
      ]);
    });
  });

  describe('errors', () => {
    test('empty source', async () => {
      await testSubmit(userToken, './tests/simple_io/empty.py', 72, 'tests/simple', 'tests/simple_io', ExpectState.FAILURE);
    });
    test('no source file', async () => {
      await testSubmit(userToken, undefined, 72, 'tests/simple', 'tests/simple_io', ExpectState.FAILURE);
    });
    test('empty language_id', async () => {
      await testSubmit(userToken, './tests/simple_io/pass.py', undefined, 'tests/simple', 'tests/simple_io', ExpectState.FAILURE);
    });
    test('empty challenge', async () => {
      await testSubmit(userToken, './tests/simple_io/pass.py', 72, 'tests/simple', undefined, ExpectState.FAILURE);
    });
  });
});