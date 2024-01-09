/*
  Warnings:

  - Added the required column `comment` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number", "input"),
    CONSTRAINT "Test_challenge_id_task_number_fkey" FOREIGN KEY ("challenge_id", "task_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("challenge_id", "input", "output", "task_number") SELECT "challenge_id", "input", "output", "task_number" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
