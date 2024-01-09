/*
  Warnings:

  - Added the required column `memory_limit` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_limit` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `input_format` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `output_format` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scoring` on table `Challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "input_format" TEXT NOT NULL,
    "output_format" TEXT NOT NULL,
    "scoring" TEXT NOT NULL,
    "time_limit" INTEGER NOT NULL,
    "memory_limit" INTEGER NOT NULL
);
INSERT INTO "new_Challenge" ("description", "id", "input_format", "output_format", "scoring", "title", "type") SELECT "description", "id", "input_format", "output_format", "scoring", "title", "type" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
