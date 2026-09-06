/*
  Warnings:

  - You are about to drop the column `status` on the `availability_rules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "availability_rules" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
