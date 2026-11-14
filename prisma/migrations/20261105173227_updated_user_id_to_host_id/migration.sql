/*
  Warnings:

  - You are about to drop the column `userId` on the `availability_exception` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `availability_rules` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `hostId` to the `availability_exception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `availability_rules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availability_exception" DROP CONSTRAINT "availability_exception_userId_fkey";

-- DropForeignKey
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_userId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropIndex
DROP INDEX "availability_exception_userId_date_idx";

-- DropIndex
DROP INDEX "availability_rules_userId_weekday_idx";

-- AlterTable
ALTER TABLE "availability_exception" DROP COLUMN "userId",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "availability_rules" DROP COLUMN "userId",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE INDEX "availability_exception_hostId_date_idx" ON "availability_exception"("hostId", "date");

-- CreateIndex
CREATE INDEX "availability_rules_hostId_weekday_idx" ON "availability_rules"("hostId", "weekday");

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exception" ADD CONSTRAINT "availability_exception_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
