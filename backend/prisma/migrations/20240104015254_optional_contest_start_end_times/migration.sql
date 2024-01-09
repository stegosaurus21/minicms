-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "start_time" DATETIME,
    "end_time" DATETIME,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Contest" ("description", "end_time", "id", "start_time", "title") SELECT "description", "end_time", "id", "start_time", "title" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
