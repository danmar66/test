/*
  Warnings:

  - You are about to drop the column `endDate` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "endDate",
DROP COLUMN "endTime",
DROP COLUMN "startDate",
DROP COLUMN "startTime",
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "startAt" TIMESTAMP(3);
