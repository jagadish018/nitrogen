/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurants_name_key" ON "Restaurants"("name");
