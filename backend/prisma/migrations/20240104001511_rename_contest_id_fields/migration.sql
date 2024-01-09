/*
  Warnings:

  - The primary key for the `Challenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Challenge` table. All the data in the column will be lost.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `challenge_name` on the `Test` table. All the data in the column will be lost.
  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `challenge_name` on the `Task` table. All the data in the column will be lost.
  - The primary key for the `ContestChallenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `challenge_name` on the `ContestChallenge` table. All the data in the column will be lost.
  - You are about to drop the column `contest_name` on the `ContestChallenge` table. All the data in the column will be lost.
  - The primary key for the `Contest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Contest` table. All the data in the column will be lost.
  - Added the required column `id` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `challenge_id` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `challenge_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `challenge_id` to the `ContestChallenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contest_id` to the `ContestChallenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SIMPLE_IO',
    "description" TEXT,
    "input_format" TEXT,
    "output_format" TEXT,
    "scoring" TEXT
);
INSERT INTO "new_Challenge" ("description", "input_format", "output_format", "scoring", "type") SELECT "description", "input_format", "output_format", "scoring", "type" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_Test" (
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number", "input"),
    CONSTRAINT "Test_challenge_id_task_number_fkey" FOREIGN KEY ("challenge_id", "task_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("input", "output", "task_number") SELECT "input", "output", "task_number" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE TABLE "new_Task" (
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "is_example" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("challenge_id", "task_number"),
    CONSTRAINT "Task_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("is_example", "task_number", "weight") SELECT "is_example", "task_number", "weight" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_ContestChallenge" (
    "challenge_id" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL,

    PRIMARY KEY ("challenge_id", "contest_id"),
    CONSTRAINT "ContestChallenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContestChallenge_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ContestChallenge" ("max_score") SELECT "max_score" FROM "ContestChallenge";
DROP TABLE "ContestChallenge";
ALTER TABLE "new_ContestChallenge" RENAME TO "ContestChallenge";
CREATE TABLE "new_Contest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Contest" ("description", "end_time", "start_time") SELECT "description", "end_time", "start_time" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
