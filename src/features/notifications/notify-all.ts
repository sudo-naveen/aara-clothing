import { prisma } from "@/lib/prisma";
import { sendNotification } from "./notifications-service";
import { createNotification } from "./notifications-db-service";
import { STOCK_THRESHOLDS } from "@/lib/constants";
import { getLowStockThreshold } from "@/lib/settings";

export async function notifyAllUsers(
  title: string,
  body: string,
  excludeUserId?: string,
  tag?: string
) {
  const where = excludeUserId ? { id: { not: excludeUserId } } : {};
  const users = await prisma.user.findMany({ where, select: { id: true } });

  await Promise.all(
    users.map(async (user) => {
      await createNotification(user.id, title, body);
      await sendNotification(user.id, title, body, undefined, tag).catch(() => {});
    })
  );
}

export async function checkAndNotifyLowStock(variants: { id: string; stock: number }[]) {
  const lowThreshold = await getLowStockThreshold();
  const lowVariants = variants.filter((v) => v.stock <= lowThreshold);
  if (lowVariants.length === 0) return;

  const details = await prisma.productVariant.findMany({
    where: { id: { in: lowVariants.map((v) => v.id) } },
    include: { product: { select: { name: true } } },
  });

  const lines = details.map((v) => {
    const stock = lowVariants.find((lv) => lv.id === v.id)!.stock;
    const status = stock === STOCK_THRESHOLDS.OUT ? "OUT OF STOCK" : "low";
    return `${v.product.name} (${v.color}/${v.size}): ${status} — ${stock} left`;
  });

  const title = "Stock Alert";
  const body = lines.join("\n");

  await notifyAllUsers(title, body, undefined, "stock-alert");
}
