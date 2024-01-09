/*
  Warnings:

  - You are about to drop the column `is_example` on the `Task` table. All the data in the column will be lost.
  - Added the required column `is_example` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number"),
    CONSTRAINT "Task_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("challenge_id", "task_number", "weight") SELECT "challenge_id", "task_number", "weight" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_Test" (
    "is_example" BOOLEAN NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number", "input"),
    CONSTRAINT "Test_challenge_id_task_number_fkey" FOREIGN KEY ("challenge_id", "task_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("challenge_id", "comment", "input", "output", "task_number") SELECT "challenge_id", "comment", "input", "output", "task_number" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
