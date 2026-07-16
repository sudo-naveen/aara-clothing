import { prisma } from "@/lib/prisma";

const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getLowStockThreshold(): Promise<number> {
  const value = await getSetting("lowStockThreshold");
  if (!value) return DEFAULT_LOW_STOCK_THRESHOLD;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? DEFAULT_LOW_STOCK_THRESHOLD : parsed;
}
