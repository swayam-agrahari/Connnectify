/*
  Warnings:

  - You are about to drop the column `upvote` on the `vote` table. All the data in the column will be lost.
  - Added the required column `type` to the `vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "vote" DROP COLUMN "upvote",
ADD COLUMN     "type" "VoteType" NOT NULL;
