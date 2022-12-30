import sqlite3 from 'sqlite3';
import createError from 'http-errors';
import fs from 'fs';
import { access, readdir, readFile } from 'fs/promises';
import { getTime, parse, toDate } from 'date-fns';

export function DbPromise(db: sqlite3.Database, mode: "get" | "all" | "run", sql: string, args: any[]) {
  return new Promise((resolve, reject) => {
    const callback = (err, result) => {
      if (err) throw createError(500, `Database error with query:\n\n${sql}\n\n${err.message}`)
      if (!result && mode !== "run") throw new Error(`SQL Error: No results found for query:\n\n${sql}\n\nArguments:\n\n${args}`);
      resolve(result);
    }
    switch (mode) {
      case "get":
        db.get(sql, args, callback);
        break;
      case "all":
        db.all(sql, args, callback);
        break;
      case "run":
        db.run(sql, args, callback);
        break;
    }
  });
}

export function throwError(err) { if (err) throw err; }

export function parseTime(time: string) {
  return getTime(parse(time, 'HH:mm dd/MM/y', new Date()));
}