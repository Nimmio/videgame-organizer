/*
  Warnings:

  - Added the required column `title` to the `UserGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGame" ADD COLUMN     "title" TEXT NOT NULL;
