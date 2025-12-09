/*
  Warnings:

  - You are about to drop the column `design` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "design",
ADD COLUMN     "offers_design" JSONB,
ADD COLUMN     "picker_design" JSONB;
