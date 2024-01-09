/*
  Warnings:

  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contest` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `challenge` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `contest` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `contest_id` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `challenge_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contest_id` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "user_id" INTEGER NOT NULL,
    "contest_id" TEXT NOT NULL,
    "time" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "contest_id"),
    CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("time", "user_id") SELECT "time", "user_id" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE TABLE "new_Submission" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "owner_id" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "score" INTEGER,
    "time" DATETIME NOT NULL,
    CONSTRAINT "Submission_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("owner_id", "score", "src", "time", "token") SELECT "owner_id", "score", "src", "time", "token" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
