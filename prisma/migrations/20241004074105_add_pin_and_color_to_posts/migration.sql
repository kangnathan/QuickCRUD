-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "color" TEXT,
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
