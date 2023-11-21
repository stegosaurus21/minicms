/*
  Warnings:

  - You are about to drop the `Participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Participants";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Results";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Result" (
    "submission_id" INTEGER NOT NULL,
    "test_num" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "compile_output" TEXT NOT NULL,

    PRIMARY KEY ("submission_id", "test_num"),
    CONSTRAINT "Result_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "user_id" INTEGER NOT NULL,
    "contest" TEXT NOT NULL,
    "time" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "contest"),
    CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
