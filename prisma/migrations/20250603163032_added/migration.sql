/*
  Warnings:

  - You are about to drop the column `gameId` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the column `preorderDate` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the `IGDBGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToIGDBGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IGDBGameToPlatform` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `group` to the `Status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `igdbID` to the `UserGame` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusGroup" AS ENUM ('PLAYING', 'BACKLOG', 'FINISHED', 'PLANNED', 'DROPPED');

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToIGDBGame" DROP CONSTRAINT "_GenreToIGDBGame_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToIGDBGame" DROP CONSTRAINT "_GenreToIGDBGame_B_fkey";

-- DropForeignKey
ALTER TABLE "_IGDBGameToPlatform" DROP CONSTRAINT "_IGDBGameToPlatform_A_fkey";

-- DropForeignKey
ALTER TABLE "_IGDBGameToPlatform" DROP CONSTRAINT "_IGDBGameToPlatform_B_fkey";

-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "group" "StatusGroup" NOT NULL;

-- AlterTable
ALTER TABLE "UserGame" DROP COLUMN "gameId",
DROP COLUMN "preorderDate",
DROP COLUMN "purchaseDate",
ADD COLUMN     "finishDate" TIMESTAMP(3),
ADD COLUMN     "igdbID" INTEGER NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "IGDBGame";

-- DropTable
DROP TABLE "_GenreToIGDBGame";

-- DropTable
DROP TABLE "_IGDBGameToPlatform";

-- CreateTable
CREATE TABLE "_GenreToUserGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GenreToUserGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_allPlatforms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_allPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GenreToUserGame_B_index" ON "_GenreToUserGame"("B");

-- CreateIndex
CREATE INDEX "_allPlatforms_B_index" ON "_allPlatforms"("B");

-- AddForeignKey
ALTER TABLE "_GenreToUserGame" ADD CONSTRAINT "_GenreToUserGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToUserGame" ADD CONSTRAINT "_GenreToUserGame_B_fkey" FOREIGN KEY ("B") REFERENCES "UserGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allPlatforms" ADD CONSTRAINT "_allPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allPlatforms" ADD CONSTRAINT "_allPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "UserGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
