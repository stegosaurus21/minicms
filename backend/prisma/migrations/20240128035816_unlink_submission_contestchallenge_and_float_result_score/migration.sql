/*
  Warnings:

  - You are about to alter the column `score` on the `Submission` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "owner_id" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "score" REAL,
    "time" DATETIME NOT NULL,
    CONSTRAINT "Submission_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("challenge_id", "contest_id", "owner_id", "score", "src", "time", "token") SELECT "challenge_id", "contest_id", "owner_id", "score", "src", "time", "token" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
