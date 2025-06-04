/*
  Warnings:

  - You are about to drop the column `platformId` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Platform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToUserGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_allPlatforms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_platformId_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToUserGame" DROP CONSTRAINT "_GenreToUserGame_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToUserGame" DROP CONSTRAINT "_GenreToUserGame_B_fkey";

-- DropForeignKey
ALTER TABLE "_allPlatforms" DROP CONSTRAINT "_allPlatforms_A_fkey";

-- DropForeignKey
ALTER TABLE "_allPlatforms" DROP CONSTRAINT "_allPlatforms_B_fkey";

-- AlterTable
ALTER TABLE "UserGame" DROP COLUMN "platformId",
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "platform" TEXT;

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Platform";

-- DropTable
DROP TABLE "_GenreToUserGame";

-- DropTable
DROP TABLE "_allPlatforms";
