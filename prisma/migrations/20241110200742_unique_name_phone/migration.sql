/*
  Warnings:

  - A unique constraint covering the columns `[name,phone]` on the table `carriers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "carriers_name_phone_key" ON "carriers"("name", "phone");
