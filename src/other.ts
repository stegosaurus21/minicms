import { rm } from 'fs/promises';
import { DbUserQueue, tokens } from './auth';
import { awaitResult, awaitScoring, awaitTest } from './results';
import { db } from './server';
import { DbSubmissionQueue } from './submit';

export async function initDb() {
  await new Promise((resolve, reject) => { 
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS Users (
          id numeric PRIMARY KEY,
          username text UNIQUE,
          password text
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS Submissions (
          id numeric PRIMARY KEY,
          owner numeric REFERENCES Users(id),
          contest text,
          challenge text,
          score numeric,
          token text,
          time numeric
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
      db.run(`
        CREATE TABLE IF NOT EXISTS Participants (
          user numeric REFERENCES Users(id),
          contest text,
          PRIMARY KEY (user, contest)
        )
      `, (err) => (err) ? reject(err) : resolve(true));
    });
  });
}

export async function clear() { 
  DbSubmissionQueue.splice(0);
  DbUserQueue.splice(0);
  tokens.clear();
  awaitTest.clear();
  awaitScoring.clear();
  awaitResult.clear();
  await new Promise((resolve, reject) => { 
    db.serialize(() => {
      db.run(`
        DELETE FROM Results
      `);
      db.run(`
        DELETE FROM Submissions
      `);
      db.run(`
        DELETE FROM Users
      `, (err) => (err) ? reject(err) : resolve(true));
    }); 
  });
  await rm('./upload', { recursive: true, force: true });
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  console.log(`${statusCode}: ${statusCode === 500 ? err : err.message}`);
  return res.status(statusCode).json({
    error: err.message
  });
};