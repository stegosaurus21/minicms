import crypto from 'crypto';
import createError, { HttpError } from 'http-errors';
import { db } from './server';
import { DbPromise } from './helper';
import { Session } from './types';
import { v4 } from 'uuid';
import { Request } from 'express';

const PASS_SALT = "__HACKERN'T__";

export const DbUserQueue = [];
export const tokens: Map<String, Session> = new Map<String, Session>();

function hash(plain: string): string {
  return crypto.createHash('sha256').update(plain + PASS_SALT).digest('hex');
}

export async function register(username: string, password: string) {
  try {
    await new Promise((resolve, reject) => {
      DbUserQueue.push(async () => {
        try {
          const row = await DbPromise(db, 'get', `
            SELECT count(id) AS count
            FROM Users
            WHERE username = ?
          `, [username]);

          if (row['count'] !== 0) return reject(createError(400, 'Username in use.'));

          const new_id = ((await DbPromise(db, 'get', 'SELECT max(id) as max FROM Users', [])) as { max: number }).max as number + 1;

          await DbPromise(db, 'run', 'INSERT INTO Users VALUES (?, ?, ?)', [new_id, username, hash(password)]);

          DbUserQueue.splice(0, 1);
          if (DbUserQueue.length > 0) {
            DbUserQueue[0]();
          }
          resolve(true);
        } catch (err) {
          if (err instanceof HttpError) reject(err);
          reject(createError(500, `Registration error: ${err.message}`));
        }
      });
      if (DbUserQueue.length === 1) {
        DbUserQueue[0]();
      }
    });
  } catch (err) {
    throw err;
  }
}

export async function login(username: string, password: string) {
  try {
    const row = await DbPromise(db, 'get', `
      SELECT count(id) AS count
      FROM Users
      WHERE username = ?
    `, [username]);

    if (row['count'] === 0) throw createError(400, 'No such user.');

    const row_passid = await DbPromise(db, 'get', `
      SELECT password, id
      FROM Users
      WHERE username = ?
    `, [username]);

    const passHash = row_passid['password'];
    const uId = row_passid['id'];

    if (passHash === hash(password)) {
      let newToken = v4();
      let newSession: Session = {
        uId: uId,
        timeout: Date.now() + 1000 * 60 * 60 * 12
      };
      tokens.set(newToken, newSession);
      return newToken;
    } else {
      throw createError(403, 'Incorrect password.');
    }
  } catch(err) {
    if (err instanceof HttpError) throw err;
    else throw createError(500, `Login error: ${err.message}`);
  }
}

export function logout(token: string) {
  tokens.delete(token);
}

export async function getUser(req: Request) {
  const token = req.header('token');
  const session = tokens.get(token);
  
  if (token === undefined || session === undefined || session.timeout < Date.now()) {
    throw createError(403, 'Invalid or expired token.');
  }

  return session.uId;
}

export async function getUsername(req: Request) {
  const uId = await getUser(req);
  const row = await DbPromise(db, 'get', `
    SELECT u.username
    FROM Users u
    WHERE u.id = ?
  `, [uId]);
  return row['username'];
}

export const auth = (req: Request, res, next) => {
  const token = req.header('token');
  const session = tokens.get(token);
  
  if (token === undefined || session === undefined || session.timeout < Date.now()) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  next();
};