/*
  Warnings:

  - Added the required column `status` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "rewardGiftsAmount" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL;
