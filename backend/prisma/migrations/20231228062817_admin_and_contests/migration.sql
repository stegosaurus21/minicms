-- CreateTable
CREATE TABLE "Contest" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContestChallenge" (
    "challenge_name" TEXT NOT NULL,
    "contest_name" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL,

    PRIMARY KEY ("challenge_name", "contest_name"),
    CONSTRAINT "ContestChallenge_challenge_name_fkey" FOREIGN KEY ("challenge_name") REFERENCES "Challenge" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContestChallenge_contest_name_fkey" FOREIGN KEY ("contest_name") REFERENCES "Contest" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "challenge_name" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    PRIMARY KEY ("challenge_name", "task_number"),
    CONSTRAINT "Task_challenge_name_fkey" FOREIGN KEY ("challenge_name") REFERENCES "Challenge" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Test" (
    "challenge_name" TEXT NOT NULL,
    "task_index" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    PRIMARY KEY ("challenge_name", "task_index", "input"),
    CONSTRAINT "Test_challenge_name_task_index_fkey" FOREIGN KEY ("challenge_name", "task_index") REFERENCES "Task" ("challenge_name", "task_number") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "password", "username") SELECT "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
