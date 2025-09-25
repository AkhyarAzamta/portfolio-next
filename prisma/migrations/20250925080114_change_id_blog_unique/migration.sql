/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `blogs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blogs_id_key" ON "public"."blogs"("id");
