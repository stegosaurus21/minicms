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

export async function testContestJoin(token: string, contest: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/contest/join`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'token': token },
    body: JSON.stringify({ contest: contest })
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body;
  
  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({});
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testSubmitAndWait(userToken: string, path: string, language_id: number, contest: string, challenge: string):
  Promise<{ token: string, score: number }> {
  const token = await testSubmit(userToken, path, language_id, contest, challenge);
  const score = await testGetSubmissionScore(userToken, token);
  return { token: token, score: score };
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

export async function testGetChallengeScoring(userToken: string, challenge: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/challenge/scoring?${new URLSearchParams({ challenge: challenge })}`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body;

  if (expectSuccess === ExpectState.FAILURE) expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetSubmissionScore(userToken: string, submission: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results?${new URLSearchParams({ submission: submission })}`, {
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

export async function testGetLeaderboard(userToken: string, contest: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/leaderboard?${new URLSearchParams({ contest: contest })}`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body;

  if (expectSuccess === ExpectState.SUCCESS) expect(body).toStrictEqual({ max_scores: expect.any(Object), leaderboard: expect.any(Object) });
  else expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetChallengeResults(userToken: string, contest: string, challenge: string, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/challenge?${new URLSearchParams({ contest: contest, challenge: challenge })}`, {
    method: 'GET',
    headers: { 'token': userToken }
  });
  const body = await res.json();
  expect(res.ok).toStrictEqual(expectSuccess !== ExpectState.FAILURE);
  if (expectSuccess === ExpectState.SUCCESS_NO_CHECK) return body;

  if (expectSuccess === ExpectState.FAILURE) expect(body).toStrictEqual({ error: expect.any(String) });
  return body;
}

export async function testGetTestResult(userToken: string, submission: string, test: number, expectSuccess: ExpectState = ExpectState.SUCCESS_NO_CHECK) {
  const res = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/results/tests/${test}?${new URLSearchParams({ submission: submission })}`, {
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