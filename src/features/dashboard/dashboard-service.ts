import { prisma } from "@/lib/prisma";
import { STOCK_THRESHOLDS } from "@/lib/constants";
import { getLowStockThreshold } from "@/lib/settings";

export async function getDashboardStats() {
  const lowThreshold = await getLowStockThreshold();
  const orderWhere = { customer: { is: {} } };

  const [
    totalProducts,
    totalVariants,
    totalCustomers,
    stockAggregation,
    lowStockProducts,
    outOfStockProducts,
    todayOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.productVariant.count({
      where: { product: { deletedAt: null } },
    }),
    prisma.customer.count(),
    prisma.productVariant.aggregate({
      where: { product: { deletedAt: null } },
      _sum: { stock: true },
    }),
    prisma.productVariant.count({
      where: {
        product: { deletedAt: null },
        stock: { gt: STOCK_THRESHOLDS.OUT, lte: lowThreshold },
      },
    }),
    prisma.productVariant.count({
      where: {
        product: { deletedAt: null },
        stock: { equals: STOCK_THRESHOLDS.OUT },
      },
    }),
    prisma.order.count({
      where: {
        ...orderWhere,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.count({ where: { ...orderWhere, status: "NOT_STARTED" } }),
    prisma.order.count({ where: { ...orderWhere, status: "PROCESSING" } }),
    prisma.order.count({ where: { ...orderWhere, status: "DONE" } }),
  ]);

  return {
    totalProducts,
    totalVariants,
    totalCustomers,
    totalStockUnits: stockAggregation._sum.stock ?? 0,
    lowStockProducts,
    outOfStockProducts,
    todayOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
  };
}

export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    where: { customer: { is: {} } },
    include: {
      customer: { select: { id: true, name: true } },
      items: { select: { quantity: true } },
    },
  });
}
