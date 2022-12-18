import express, { json, Request, Response } from 'express';
import config from '../config.json';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { HttpError } from 'http-errors';
import createError from 'http-errors';
import sqlite3 from 'sqlite3';
import { DbPromise, throwError } from './helper';
import { Resolve, Result, Token } from './types';
import { submit } from './submit';
import { fstat } from 'fs';
import { rm } from 'fs/promises';

sqlite3.verbose();
export const db = new sqlite3.Database('./db.sqlite3');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Submissions (
      id numeric PRIMARY KEY,
      token text
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Results (
      submission numeric REFERENCES Submissions(id),
      test_num numeric,
      token text,
      time numeric,
      memory numeric,
      status text,
      compile_output text,
      PRIMARY KEY (submission, test_num)
    )
  `);
});

const app = express();
const awaitJudge: Map<String, Resolve> = new Map<String, Resolve>();

app.use(json());
app.use(cors());
app.use(fileUpload({ createParentPath: true }));

app.get('/', (req, res) => {
  return res.json("Hackern't");
});

app.delete('/clear', async (req, res) => {
  db.serialize(() => {
    db.run(`
      DELETE FROM Results
    `);
    db.run(`
      DELETE FROM Submissions
    `);
  });
  await rm('../upload', { recursive: true, force: true });
  awaitJudge.clear();
  res.json();
});

app.post('/submit', async (req, res, next) => {
  await submit(req.files, req.body.challenge, parseInt(req.body.language_id))
  .then(str => res.json({ token: str }))
  .catch(err => next(err));
});

app.get('/results/:submission', async (req, res) => {
  const submission = req.params.submission;
  res.json((await getSubmissionTests(submission)) as number);
});

function getSubmissionTests(submission): Promise<number> {
  try {
    return (DbPromise(db, 'get', `
      SELECT count(j.token) AS count 
      FROM Results j 
      JOIN Submissions s ON s.id = j.submission 
      WHERE s.token = ?
    `, [submission])) as Promise<number>;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw createError(404, "Submission not found.");
  }
}

app.get('/results/:submission/:test', async (req, res) => {
  const submission = req.params.submission;
  const test = parseInt(req.params.test);

  const numTests = (await getSubmissionTests(submission)) as number;

  if (test < 0 || test >= numTests) {
    throw createError(404, 'Test not found.');
  }

  const row = await DbPromise(db, 'get', `
    SELECT *
    FROM Results r
    JOIN Submissions s ON s.id = r.submission
    WHERE s.token = ? AND r.test_num = ?
  `, [submission, test]) as Result;

  if (row.status === 'In Queue') {
    await new Promise((resolve, reject) => {
      awaitJudge.set(row.token, resolve);
    });
  }
  
  return res.json({
    time: row.time,
    memory: row.memory,
    status: row.status,
    compile_output: row.compile_output
  });
});

app.put('/callback', async (req, res) => {
  const body = req.body;
  console.log(body);

  await DbPromise(db, 'run', `
    UPDATE Results 
    SET (time, memory, status, compile_output) = (?, ?, ?, ?)
    WHERE token = ?
  `, [body.time, body.memory, body.status.description, body.compile_output || "Compilation successful.", body.token]);

  const waiter: Resolve | undefined = awaitJudge.get(body.token);
  if (waiter) {
    (waiter as Resolve)(true);
  }

  res.json();
});

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  console.log(`${statusCode}: ${statusCode === 500 ? err : err.message}`);
  console.error(err);
  res.status(statusCode).json({
    error: err.message
  });
});

const server = app.listen(parseInt(config.BACKEND_PORT), config.BACKEND_URL,
  () => {
    console.log(`server started on port ${parseInt(config.BACKEND_PORT)} at ${config.BACKEND_URL}`);
  }
);

process.on('SIGINT', () => {
  server.close(() => console.log('server stopped'));
});