/*
  Warnings:

  - Added the required column `checksum` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checksum` to the `IGDBGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checksum` to the `Platform` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" 
ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-',
ALTER COLUMN "checksum" DROP DEFAULT;

-- AlterTable
ALTER TABLE "IGDBGame" 
ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-',
ALTER COLUMN "checksum" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Platform" 
ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-',
  ALTER COLUMN "checksum" DROP DEFAULT;
