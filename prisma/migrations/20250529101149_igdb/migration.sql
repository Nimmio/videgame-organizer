/*
  Warnings:

  - You are about to drop the column `igdbId` on the `UserGame` table. All the data in the column will be lost.
  - Added the required column `gameId` to the `UserGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `UserGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGame" DROP COLUMN "igdbId",
ADD COLUMN     "gameId" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "preorderDate" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "statusId" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "IGDBAuth" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT,
    "expires" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IGDBAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "igdbId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "statusTitle" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
