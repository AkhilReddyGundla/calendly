/*
  Warnings:

  - You are about to drop the column `eventTypeId` on the `availability_exception` table. All the data in the column will be lost.
  - Added the required column `type` to the `availability_exception` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availability_exception" DROP CONSTRAINT "availability_exception_eventTypeId_fkey";

-- AlterTable
ALTER TABLE "availability_exception" DROP COLUMN "eventTypeId",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ExceptionType";
