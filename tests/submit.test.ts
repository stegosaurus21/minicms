import config from '../config.json';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch'

const testSubmit = async (path: string, language_id: number, challenge: string) => {
  const data = new FormData();
  const fileStream = fs.createReadStream(path);
  const fileSize = fs.statSync(path).size;
  data.append('src', fileStream, { knownLength: fileSize });
  if (language_id !== undefined) data.append('language_id', language_id);
  if (challenge !== undefined) data.append('challenge', challenge);
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/submit`, {
    method: 'POST',
    body: data
  });
  expect(res.ok).toStrictEqual(true);
  const body = await res.json();
  expect(body).toStrictEqual({ token: expect.any(String) });
}

describe('submit', () => {
  describe('success', () => {
    test('simple_io', async () => {
      testSubmit('./tests/simple_io/pass.py', 71, 'tests/simple_io');
      testSubmit('./tests/simple_io/overflow.cpp', 54, 'tests/simple_io');
      testSubmit('./tests/simple_io/time_limit.py', 71, 'tests/simple_io');
    });
  });
});