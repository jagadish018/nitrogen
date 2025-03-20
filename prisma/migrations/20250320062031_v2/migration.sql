/*
  Warnings:

  - You are about to alter the column `totaltotalPrice` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "totaltotalPrice" SET DATA TYPE DOUBLE PRECISION;
