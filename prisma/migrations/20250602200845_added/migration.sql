-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-';

-- AlterTable
ALTER TABLE "IGDBGame" ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-';

-- AlterTable
ALTER TABLE "Platform" ADD COLUMN     "checksum" TEXT NOT NULL DEFAULT '-';
