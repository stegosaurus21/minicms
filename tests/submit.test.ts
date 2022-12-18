import config from '../config.json';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch'

const testSubmit = async (path: string, language_id: number, challenge: string, expectSuccess: boolean = true) => {
  const data = new FormData();
  if (path !== undefined) {
    const fileStream = fs.createReadStream(path);
    const fileSize = fs.statSync(path).size;
    data.append('src', fileStream, { knownLength: fileSize });
  }
  if (language_id !== undefined) data.append('language_id', language_id);
  if (challenge !== undefined) data.append('challenge', challenge);
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/submit`, {
    method: 'POST',
    body: data
  });
  expect(res.ok).toStrictEqual(expectSuccess);
  const body = await res.json();
  if (expectSuccess) expect(body).toStrictEqual({ token: expect.any(String) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
}

beforeAll(async () => {
  await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/clear`, { method: 'DELETE' });
});

describe('submit', () => {
  describe('success', () => {
    test('simple_io', async () => {
      testSubmit('./tests/simple_io/pass.py', 71, 'tests/simple_io');
      testSubmit('./tests/simple_io/overflow.cpp', 54, 'tests/simple_io');
      await testSubmit('./tests/simple_io/time_limit.py', 71, 'tests/simple_io');
    });
  });

  describe('errors', () => {
    test('empty source', async () => {
      await testSubmit('./tests/simple_io/empty.py', 72, 'tests/simple_io', false);
    });
    test('no source file', async () => {
      await testSubmit(undefined, 72, 'tests/simple_io', false);
    });
    test('empty language_id', async () => {
      await testSubmit('./tests/simple_io/pass.py', undefined, 'tests/simple_io', false);
    });
    test('empty challenge', async () => {
      await testSubmit('./tests/simple_io/pass.py', 72, undefined, false);
    });
  });
});