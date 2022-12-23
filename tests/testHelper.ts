import fs from 'fs';
import FormData from 'form-data';
import config from '../config.json';
import fetch from 'node-fetch'

export enum ExpectState {
  FAILURE,
  SUCCESS_NO_CHECK,
  SUCCESS
};

export async function testRegister(username: string, password: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username, password: password })
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return ({});
  
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({});
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testLogin(username: string, password: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username, password: password })
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body['token'];
  
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ token: expect.any(String) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testSubmit(userToken: string, path: string, language_id: number, contest: string, challenge: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const data = new FormData();
  if (path !== undefined) {
    const fileStream = fs.createReadStream(path);
    const fileSize = fs.statSync(path).size;
    data.append('src', fileStream, { knownLength: fileSize });
  }
  if (language_id !== undefined) data.append('language_id', language_id);
  if (challenge !== undefined) data.append('challenge', challenge);
  if (contest !== undefined) data.append('contest', contest
  );
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/submit`, {
    method: 'POST',
    headers: { 'token': userToken },
    body: data
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body['token'];

  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ token: expect.any(String) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetSubmissionTestCount(userToken: string, token: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/${token}/tests`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body['tests'];

  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ tests: expect.any(Number) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetSubmissionScore(userToken: string, token: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/${token}/score`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body['score'];

  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ score: expect.any(Number) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetTestResult(userToken: string, token: string, test: number, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/${token}/${test}`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body;

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