/*
  Warnings:

  - You are about to drop the column `constraint` on the `Task` table. All the data in the column will be lost.
  - Added the required column `constraints` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constraints` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "input_format" TEXT NOT NULL,
    "output_format" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "time_limit" INTEGER NOT NULL,
    "memory_limit" INTEGER NOT NULL
);
INSERT INTO "new_Challenge" ("description", "id", "input_format", "memory_limit", "output_format", "time_limit", "title", "type") SELECT "description", "id", "input_format", "memory_limit", "output_format", "time_limit", "title", "type" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_Task" (
    "challenge_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "constraints" TEXT NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number"),
    CONSTRAINT "Task_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("challenge_id", "task_number", "type", "weight") SELECT "challenge_id", "task_number", "type", "weight" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
