/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropTable
DROP TABLE "Game";

-- CreateTable
CREATE TABLE "IGDBGame" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "first_release_date" TIMESTAMP(3) NOT NULL,
    "coverUrl" TEXT NOT NULL,

    CONSTRAINT "IGDBGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "igdbId" INTEGER NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "igdbId" INTEGER NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IGDBGameToPlatform" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IGDBGameToPlatform_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GenreToIGDBGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GenreToIGDBGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "IGDBGame_igdbId_key" ON "IGDBGame"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_igdbId_key" ON "Genre"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_igdbId_key" ON "Platform"("igdbId");

-- CreateIndex
CREATE INDEX "_IGDBGameToPlatform_B_index" ON "_IGDBGameToPlatform"("B");

-- CreateIndex
CREATE INDEX "_GenreToIGDBGame_B_index" ON "_GenreToIGDBGame"("B");

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "IGDBGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IGDBGameToPlatform" ADD CONSTRAINT "_IGDBGameToPlatform_A_fkey" FOREIGN KEY ("A") REFERENCES "IGDBGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IGDBGameToPlatform" ADD CONSTRAINT "_IGDBGameToPlatform_B_fkey" FOREIGN KEY ("B") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToIGDBGame" ADD CONSTRAINT "_GenreToIGDBGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToIGDBGame" ADD CONSTRAINT "_GenreToIGDBGame_B_fkey" FOREIGN KEY ("B") REFERENCES "IGDBGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
