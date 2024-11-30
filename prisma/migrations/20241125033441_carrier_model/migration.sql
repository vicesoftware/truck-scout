/*
  Warnings:

  - A unique constraint covering the columns `[mc_number]` on the table `carriers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dot_number]` on the table `carriers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "carriers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "rating" SET DEFAULT 0.0,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateIndex
CREATE UNIQUE INDEX "carriers_mc_number_key" ON "carriers"("mc_number");

-- CreateIndex
CREATE UNIQUE INDEX "carriers_dot_number_key" ON "carriers"("dot_number");
