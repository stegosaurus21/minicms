/*
  Warnings:

  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `test_num` on the `Result` table. All the data in the column will be lost.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `challenge_id` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_number` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_number` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_number` to the `Test` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Result_submission_token_fkey" FOREIGN KEY ("submission_token") REFERENCES "Submission" ("token") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_challenge_id_task_number_fkey" FOREIGN KEY ("challenge_id", "task_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_challenge_id_task_number_test_number_fkey" FOREIGN KEY ("challenge_id", "task_number", "test_number") REFERENCES "Test" ("challenge_id", "task_number", "test_number") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("compile_output", "memory", "status", "submission_token", "time", "token") SELECT "compile_output", "memory", "status", "submission_token", "time", "token" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE TABLE "new_Test" (
    "test_number" INTEGER NOT NULL,
    "is_example" BOOLEAN NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number", "test_number"),
    CONSTRAINT "Test_challenge_id_task_number_fkey" FOREIGN KEY ("challenge_id", "task_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("challenge_id", "comment", "explanation", "input", "is_example", "output", "task_number") SELECT "challenge_id", "comment", "explanation", "input", "is_example", "output", "task_number" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
