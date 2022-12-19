import { clear, testSubmit, ExpectState } from './testHelper';

beforeAll(clear);

describe('submit', () => {
  describe('success', () => {
    test('simple_io', async () => {
      await Promise.all([
        testSubmit('./tests/simple_io/pass.py', 71, 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit('./tests/simple_io/overflow.cpp', 54, 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit('./tests/simple_io/compile_error.cpp', 54, 'tests/simple_io', ExpectState.SUCCESS),
        testSubmit('./tests/simple_io/time_limit.py', 71, 'tests/simple_io', ExpectState.SUCCESS)
      ]);
    });
  });

  describe('errors', () => {
    test('empty source', async () => {
      await testSubmit('./tests/simple_io/empty.py', 72, 'tests/simple_io', ExpectState.FAILURE);
    });
    test('no source file', async () => {
      await testSubmit(undefined, 72, 'tests/simple_io', ExpectState.FAILURE);
    });
    test('empty language_id', async () => {
      await testSubmit('./tests/simple_io/pass.py', undefined, 'tests/simple_io', ExpectState.FAILURE);
    });
    test('empty challenge', async () => {
      await testSubmit('./tests/simple_io/pass.py', 72, undefined, ExpectState.FAILURE);
    });
  });
});