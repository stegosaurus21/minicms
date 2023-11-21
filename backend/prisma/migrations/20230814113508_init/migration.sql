-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner_id" INTEGER NOT NULL,
    "contest" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    CONSTRAINT "Submission_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Results" (
    "submission_id" INTEGER NOT NULL,
    "test_num" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "compile_output" TEXT NOT NULL,

    PRIMARY KEY ("submission_id", "test_num"),
    CONSTRAINT "Results_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participants" (
    "user_id" INTEGER NOT NULL,
    "contest" TEXT NOT NULL,
    "time" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "contest"),
    CONSTRAINT "Participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
