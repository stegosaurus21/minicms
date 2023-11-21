/*
  Warnings:

  - You are about to alter the column `time` on the `Result` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "submission_token" TEXT NOT NULL,
    "test_num" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" REAL NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "compile_output" TEXT NOT NULL,

    PRIMARY KEY ("submission_token", "test_num"),
    CONSTRAINT "Result_submission_token_fkey" FOREIGN KEY ("submission_token") REFERENCES "Submission" ("token") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("compile_output", "memory", "status", "submission_token", "test_num", "time", "token") SELECT "compile_output", "memory", "status", "submission_token", "test_num", "time", "token" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
