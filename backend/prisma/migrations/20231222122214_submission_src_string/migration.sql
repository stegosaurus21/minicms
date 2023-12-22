/*
  Warnings:

  - Added the required column `src` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "owner_id" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "contest" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "score" INTEGER,
    "time" DATETIME NOT NULL,
    CONSTRAINT "Submission_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("challenge", "contest", "owner_id", "score", "time", "token") SELECT "challenge", "contest", "owner_id", "score", "time", "token" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
