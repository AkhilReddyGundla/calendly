/*
  Warnings:

  - A unique constraint covering the columns `[hostId,slug]` on the table `event_types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "event_types_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "event_types_hostId_slug_key" ON "event_types"("hostId", "slug");
