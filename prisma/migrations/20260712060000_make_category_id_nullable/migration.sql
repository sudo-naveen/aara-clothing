-- Make categoryId nullable to match Prisma schema and actual usage
ALTER TABLE "Product" ALTER COLUMN "categoryId" DROP NOT NULL;
