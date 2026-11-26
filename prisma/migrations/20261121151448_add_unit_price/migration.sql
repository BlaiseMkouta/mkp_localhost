/*
  Warnings:

  - Added the required column `unit_price` to the `CartProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartProduct" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unit_price" INTEGER NOT NULL;
