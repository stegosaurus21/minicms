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
    "taskChallenge_id" TEXT,
    "taskTask_number" INTEGER,
    "testChallenge_id" TEXT,
    "testTask_number" INTEGER,
    "testTest_number" INTEGER,

    PRIMARY KEY ("submission_token", "task_number", "test_number"),
    CONSTRAINT "Result_submission_token_fkey" FOREIGN KEY ("submission_token") REFERENCES "Submission" ("token") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_taskChallenge_id_taskTask_number_fkey" FOREIGN KEY ("taskChallenge_id", "taskTask_number") REFERENCES "Task" ("challenge_id", "task_number") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Result_testChallenge_id_testTask_number_testTest_number_fkey" FOREIGN KEY ("testChallenge_id", "testTask_number", "testTest_number") REFERENCES "Test" ("challenge_id", "task_number", "test_number") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("challenge_id", "compile_output", "memory", "status", "submission_token", "task_number", "test_number", "time", "token") SELECT "challenge_id", "compile_output", "memory", "status", "submission_token", "task_number", "test_number", "time", "token" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
