/*
  Warnings:

  - You are about to drop the column `taskChallenge_id` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `taskTask_number` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `testChallenge_id` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `testTask_number` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `testTest_number` on the `Result` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "submission_token" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "test_number" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" REAL NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "compile_output" TEXT NOT NULL,

    PRIMARY KEY ("submission_token", "task_number", "test_number"),
    CONSTRAINT "Result_submission_token_fkey" FOREIGN KEY ("submission_token") REFERENCES "Submission" ("token") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("challenge_id", "compile_output", "memory", "status", "submission_token", "task_number", "test_number", "time", "token") SELECT "challenge_id", "compile_output", "memory", "status", "submission_token", "task_number", "test_number", "time", "token" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
