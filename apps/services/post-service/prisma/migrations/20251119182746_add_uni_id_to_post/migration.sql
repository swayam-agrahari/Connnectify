/*
  Warnings:

  - Added the required column `universityId` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "universityId" TEXT NOT NULL;

UPDATE "post" SET "universityId" = 'univ-123' WHERE "universityId" IS NULL;

ALTER TABLE "post" ALTER COLUMN "universityId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "post_universityId_idx" ON "post"("universityId");
