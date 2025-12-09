/*
  Warnings:

  - You are about to drop the column `desktopSettings` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `mobileSettings` on the `Design` table. All the data in the column will be lost.
  - Added the required column `design` to the `Design` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "desktopSettings",
DROP COLUMN "mobileSettings",
ADD COLUMN     "design" JSONB NOT NULL;
