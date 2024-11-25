/*
  Warnings:

  - Made the column `mc_number` on table `carriers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `carriers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "carriers" ALTER COLUMN "mc_number" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;
