-- Add missing column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- Add missing column to Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Create new enum type
CREATE TYPE "OrderStatus_new" AS ENUM ('NOT_STARTED', 'PROCESSING', 'DONE');

-- Update column to use new type
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING 'NOT_STARTED'::text::"OrderStatus_new";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- Drop old enum type
DROP TYPE "OrderStatus";

-- Rename new type
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
