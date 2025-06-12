/*
  Warnings:

  - A unique constraint covering the columns `[settingsId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('SYSTEM', 'DARK', 'LIGHT');

-- CreateEnum
CREATE TYPE "View" AS ENUM ('GRID', 'LIST');

-- CreateEnum
CREATE TYPE "GamesPerPage" AS ENUM ('GPP5', 'GPP20', 'GPP50', 'GPP100');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "settingsId" INTEGER;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "theme" "Theme" NOT NULL,
    "defaultView" "View" NOT NULL,
    "gamesPerPage" "GamesPerPage" NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settingsId_key" ON "user"("settingsId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
