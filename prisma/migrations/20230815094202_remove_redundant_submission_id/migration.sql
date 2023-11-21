/*
  Warnings:

  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Submission` table. All the data in the column will be lost.
  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `submission_id` on the `Result` table. All the data in the column will be lost.
  - Added the required column `submission_token` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "owner_id" INTEGER NOT NULL,
    "contest" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "time" DATETIME NOT NULL,
    CONSTRAINT "Submission_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("challenge", "contest", "owner_id", "score", "time", "token") SELECT "challenge", "contest", "owner_id", "score", "time", "token" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE TABLE "new_Result" (
    "submission_token" TEXT NOT NULL,
    "test_num" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "compile_output" TEXT NOT NULL,

    PRIMARY KEY ("submission_token", "test_num"),
    CONSTRAINT "Result_submission_token_fkey" FOREIGN KEY ("submission_token") REFERENCES "Submission" ("token") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("compile_output", "memory", "status", "test_num", "time", "token") SELECT "compile_output", "memory", "status", "test_num", "time", "token" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
