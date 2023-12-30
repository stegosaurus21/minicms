/*
  Warnings:

  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `task_index` on the `Test` table. All the data in the column will be lost.
  - Added the required column `description` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_number` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'SIMPLE_IO',
    "description" TEXT,
    "input_format" TEXT,
    "output_format" TEXT,
    "scoring" TEXT
);
INSERT INTO "new_Challenge" ("name", "type") SELECT "name", "type" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_Contest" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Contest" ("end_time", "name", "start_time") SELECT "end_time", "name", "start_time" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
CREATE TABLE "new_Task" (
    "challenge_name" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "is_example" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("challenge_name", "task_number"),
    CONSTRAINT "Task_challenge_name_fkey" FOREIGN KEY ("challenge_name") REFERENCES "Challenge" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("challenge_name", "task_number", "weight") SELECT "challenge_name", "task_number", "weight" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_Test" (
    "challenge_name" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_name", "task_number", "input"),
    CONSTRAINT "Test_challenge_name_task_number_fkey" FOREIGN KEY ("challenge_name", "task_number") REFERENCES "Task" ("challenge_name", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_challenge_name_fkey" FOREIGN KEY ("challenge_name") REFERENCES "Challenge" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("challenge_name", "input", "output") SELECT "challenge_name", "input", "output" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
