/*
  Warnings:

  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "challenge_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "task_number" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    PRIMARY KEY ("challenge_id", "task_number"),
    CONSTRAINT "Task_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("challenge_id", "task_number", "weight") SELECT "challenge_id", "task_number", "weight" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
