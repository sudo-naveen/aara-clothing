import "dotenv/config";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

/**
 * SEED SCRIPT - DEVELOPMENT ONLY
 *
 * This script seeds the database with initial data for development.
 * It should NOT be used in production.
 *
 * Usage: npx prisma db seed
 */

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminUsername = "admin";
  const adminPassword = "admin123";

  const existingUser = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (existingUser) {
    console.log(`User "${adminUsername}" already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      username: adminUsername,
      passwordHash,
    },
  });

  console.log(`Created admin user: ${adminUsername}`);
  console.log("WARNING: This is a development-only admin account.");
  console.log("Change the password before deploying to production.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
