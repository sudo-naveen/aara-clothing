import { prisma } from "@/lib/prisma";
import { sendNotification } from "./notifications-service";
import { createNotification } from "./notifications-db-service";
import { STOCK_THRESHOLDS } from "@/lib/constants";

export async function notifyAllUsers(
  title: string,
  body: string,
  excludeUserId?: string
) {
  const where = excludeUserId ? { id: { not: excludeUserId } } : {};
  const users = await prisma.user.findMany({ where, select: { id: true } });

  await Promise.all(
    users.map(async (user) => {
      await createNotification(user.id, title, body);
      await sendNotification(user.id, title, body).catch(() => {});
    })
  );
}

export async function checkAndNotifyLowStock(
  variantId: string,
  currentStock: number
) {
  if (currentStock > STOCK_THRESHOLDS.LOW) return;

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      product: { select: { name: true } },
    },
  });

  if (!variant) return;

  const status = currentStock === STOCK_THRESHOLDS.OUT ? "out of stock" : "low";
  const title = currentStock === STOCK_THRESHOLDS.OUT
    ? "Out of Stock"
    : "Low Stock Alert";
  const body = `${variant.product.name} (${variant.color}/${variant.size}) is ${status}: ${currentStock} remaining`;

  await notifyAllUsers(title, body);
}
