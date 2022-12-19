import sqlite3 from 'sqlite3';
import createError from 'http-errors';

export function DbPromise(db: sqlite3.Database, mode: "get" | "all" | "run", sql: string, args: any[]) {
  return new Promise((resolve, reject) => {
    const callback = (err, result) => {
      if (err) throw createError(500, `Database error with query:\n\n${sql}\n\n${err.message}`)
      if (!result && mode !== "run") throw new Error("No results found.");
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