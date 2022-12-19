import express, { json, Request, Response } from 'express';
import config from '../config.json';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import sqlite3 from 'sqlite3';
import { submit } from './submit';
import { getSubmissionTestCount, getTest, judgeCallback } from './results';
import { clear, errorHandler, initDb } from './other';
import morgan from 'morgan';
import { auth, login, register } from './auth';
import { v4 } from 'uuid';

sqlite3.verbose();
export const db = new sqlite3.Database('./db.sqlite3');

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));
app.use(fileUpload({ createParentPath: true }));

app.get('/', (req, res) => {
  return res.json("Hackern't");
});

app.post('/auth/register', async (req, res, next) => {
  try {
    await register(req.body.username, req.body.password);
    return res.json({});
  } catch (err) {
    next(err);
  }
});

app.post('/auth/login', async (req, res, next) => {
  try {
    return res.json({ token: await login(req.body.username, req.body.password) });
  } catch (err) {
    next(err);
  }
});

app.delete('/clear', async (req, res) => {
  await clear();
  res.json();
});

export const judgeSecret = v4();
app.put(`/callback/${judgeSecret}`, async (req, res) => {
  await judgeCallback(req.body);
  res.json();
});

app.use(errorHandler);

app.use(auth);

app.post('/submit', async (req, res, next) => {
  try {
    const str = await submit(req.files, req.body.challenge, parseInt(req.body.language_id))
    res.json({ token: str });
  } catch (err) {
    next(err);
  }
});

app.get('/results/:submission', async (req, res, next) => {
  try {
    const submission = req.params.submission;
    res.json({ tests: await getSubmissionTestCount(submission) });
  } catch (err) {
    next(err);
  }
});

app.get('/results/:submission/:test', async (req, res, next) => {
  try {
    const submission = req.params.submission;
    const test = parseInt(req.params.test);
    
    return res.json(await getTest(submission, test));
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const server = app.listen(parseInt(config.BACKEND_PORT), config.BACKEND_URL,
  async () => {
    await initDb();
    console.log(`server started on port ${parseInt(config.BACKEND_PORT)} at ${config.BACKEND_URL}`);
  }
);

process.on('SIGINT', () => {
  server.close(() => console.log('server stopped'));
});