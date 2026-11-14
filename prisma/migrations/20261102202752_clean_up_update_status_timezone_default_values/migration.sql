-- AlterTable
ALTER TABLE "availability_exception" ALTER COLUMN "timezone" SET DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "availability_rules" ALTER COLUMN "timezone" SET DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
