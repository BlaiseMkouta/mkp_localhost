/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shop_owner_key" ON "Shop"("owner");
