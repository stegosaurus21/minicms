import { rm } from 'fs/promises';
import { awaitJudge } from './results';
import { db } from './server';

export function initDb() {
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
}

export async function clear() {
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
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  console.log(`${statusCode}: ${statusCode === 500 ? err : err.message}`);
  res.status(statusCode).json({
    error: err.message
  });
};