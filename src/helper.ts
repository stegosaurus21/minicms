import { format } from 'date-fns';
import { config } from './config';

export async function makeBackendRequest(method: 'GET' | 'POST' | 'DELETE', route: string, token: string | null, args: any = undefined) {
  let result;
  if (args && args.contest) args.contest = args.contest.replaceAll(':', '/');
  if (args && args.challenge) args.challenge = args.challenge.replaceAll(':', '/');
  if (method === 'GET' || method === 'DELETE') {
    result = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}${route}${(args) ? `?${new URLSearchParams(args)}` : ''}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "token": token || ''
      }
    });
  } else {
    result = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}${route}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "token": token || ''
      },
      body: JSON.stringify(args)
    });
  }

  const obj = await result.json();
  if (!result.ok) {
    const message = `An error has occured: ${result.status}: ${obj.error}`;
    throw new Error(message);
  } else {
    return obj;
  }
}

export async function submit(contest: string, challenge: string, language_id: string, file: File, token: string | null) {
  let result;
  if (contest) contest = contest.replaceAll(':', '/');
  if (challenge) challenge = challenge.replaceAll(':', '/');
  const data = new FormData();
  data.append('src', file);
  data.append('language_id', language_id);
  data.append('contest', contest);
  data.append('challenge', challenge);
  result = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/submit`, {
    method: 'POST',
    headers: {
      "token": token || ''
    },
    body: data
  });

  const obj = await result.json();
  if (!result.ok) {
    const message = `An error has occured: ${result.status}: ${obj.error}`;
    throw new Error(message);
  } else {
    return obj;
  }
}

export function onLoggedIn(token: string | null, callback: Function, otherwise?: Function) {
  makeBackendRequest('GET', '/auth/validate', token)
  .then((value) => {
    callback(value.username as string);
  })
  .catch(() => { if (otherwise) otherwise(); });
}

export function contestOpen(starts: number | null, ends: number | null) {
  if (starts && Date.now() < starts) return false;
  if (ends && ends < Date.now()) return false;
  return true;
}

export function parseMemory(kb: number | null): string {
  if (kb === null || kb === 0) return '';
  if (kb > 1024) return `${Math.round(kb / 1024)} MB`;
  else return `${kb} KB`;
}

export function round2dp(num: number | null) {
  if (num === null) return 0;
  return Math.round(num * 100) / 100;
}

export function prettyDate(date: number) {
  return format(date, 'h:mmaa | EEEE do LLLL y');
}

export function styleScore(score: number | null, maxScore: number | null, pre?: string) {
  if (score === null || maxScore === null) return `${pre || ''}body text-body`;
  if (score === 0) return `${pre || ''}danger text-light`;
  if (score === maxScore) return `${pre || ''}success text-light`;
  return `${pre || ''}warning text-body`;
}

export function styleStatus(status: string | undefined, pre?: string) {
  if (status === 'Checking' || status === undefined) return `${pre || ''}body text-body`;
  if (status === 'Accepted') return `${pre || ''}success text-light`;
  return `${pre || ''}danger text-light`;
}