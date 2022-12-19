import fs from 'fs';
import FormData from 'form-data';
import config from '../config.json';
import fetch from 'node-fetch'

export enum ExpectState {
  FAILURE,
  NO_CHECK,
  SUCCESS
};

export async function testSubmit(path: string, language_id: number, challenge: string, expectSuccess: ExpectState = ExpectState.NO_CHECK) {
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
  const body = await res.json();
  if (expectSuccess === ExpectState.NO_CHECK) return body;

  expect(res.ok).toStrictEqual(expectSuccess === ExpectState.SUCCESS);
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ token: expect.any(String) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetSubmissionTestCount(token: string, expectSuccess: ExpectState = ExpectState.NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/${token}`, {
    method: 'GET'
  });
  const body = await res.json();
  if (expectSuccess === ExpectState.NO_CHECK) return body;
  
  expect(res.ok).toStrictEqual(expectSuccess === ExpectState.SUCCESS);
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ tests: expect.any(Number) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetTestResult(token: string, test: number, expectSuccess: ExpectState = ExpectState.NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/${token}/${test}`, {
    method: 'GET'
  });
  const body = await res.json();
  if (expectSuccess === ExpectState.NO_CHECK) return body;
  
  expect(res.ok).toStrictEqual(expectSuccess === ExpectState.SUCCESS);
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({
    time: expect.any(Number),
    memory: expect.any(Number),
    status: expect.any(String),
    compile_output: expect.any(String)
  });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function clear() {
  await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/clear`, { method: 'DELETE' });
}