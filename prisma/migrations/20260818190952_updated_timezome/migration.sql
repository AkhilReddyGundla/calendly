/*
  Warnings:

  - You are about to drop the column `TimeZone` on the `availability_exception` table. All the data in the column will be lost.
  - Added the required column `message` to the `availability_exception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `availability_exception` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availability_exception" DROP COLUMN "TimeZone",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;
