/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "uId" INTEGER NOT NULL,
    "expiry" DATETIME NOT NULL,
    CONSTRAINT "Token_uId_fkey" FOREIGN KEY ("uId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("expiry", "uId") SELECT "expiry", "uId" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
