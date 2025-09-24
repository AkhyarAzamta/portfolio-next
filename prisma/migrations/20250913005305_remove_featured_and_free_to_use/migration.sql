/*
  Warnings:

  - You are about to drop the column `featured` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `freeToUse` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `githubLink` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "featured",
DROP COLUMN "freeToUse",
DROP COLUMN "githubLink",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "sourceCode" TEXT;
