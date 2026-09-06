/*
  Warnings:

  - You are about to drop the column `type` on the `availability_exception` table. All the data in the column will be lost.
  - Added the required column `eventTypeId` to the `availability_exception` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExceptionType" AS ENUM ('BLOCK_FULL_DAY', 'BLOCK_PARTIAL', 'ADD_AVAILABLE_WINDOW');

-- AlterTable
ALTER TABLE "availability_exception" DROP COLUMN "type",
ADD COLUMN     "eventTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "availability_exception" ADD CONSTRAINT "availability_exception_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
