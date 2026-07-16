import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import type {
  CreateOrderInput,
  UpdateOrderInput,
  OrderQuery,
} from "./orders-validation";
import { sendNotification } from "@/features/notifications/notifications-service";
import { createNotification } from "@/features/notifications/notifications-db-service";

export async function listOrders(query: OrderQuery) {
  const { page, limit, search, customerId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (customerId) {
    where.customerId = customerId;
  }

  if (search) {
    where.orderNumber = isNaN(Number(search)) ? undefined : Number(search);
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        customer: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
      },
      customer: {
        select: { id: true, name: true, phone: true },
      },
      user: {
        select: { id: true, username: true },
      },
    },
  });
}

export async function createOrder(input: CreateOrderInput, userId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: input.customerId },
  });
  if (!customer) throw new Error("Customer not found");

  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: { select: { id: true, name: true, price: true, deletedAt: true } },
    },
  });

  if (variants.length !== variantIds.length) {
    throw new Error("One or more variants not found");
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const duplicateVariantIds = input.items
    .map((i) => i.variantId)
    .filter((id, index, arr) => arr.indexOf(id) !== index);
  if (duplicateVariantIds.length > 0) {
    throw new Error("Duplicate variants are not allowed in the same order");
  }

  const orderItems = input.items.map((item) => {
    const variant = variantMap.get(item.variantId)!;
    const price = Number(variant.product.price);
    return {
      variantId: item.variantId,
      quantity: item.quantity,
      price,
      subtotal: price * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await prisma.$transaction(async (tx) => {
    const currentVariants = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: { select: { id: true, name: true, deletedAt: true } },
      },
    });

    const currentVariantMap = new Map(currentVariants.map((v) => [v.id, v]));

    for (const item of input.items) {
      const variant = currentVariantMap.get(item.variantId);
      if (!variant) throw new Error(`Variant ${item.variantId} not found`);
      if (variant.product.deletedAt) {
        throw new Error(`Product "${variant.product.name}" has been deleted`);
      }
      if (variant.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${variant.product.name} (${variant.color}/${variant.size}). Available: ${variant.stock}, requested: ${item.quantity}`
        );
      }
    }

    for (const item of input.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        customerId: input.customerId,
        subtotal,
        discount: 0,
        total: subtotal,
        createdBy: userId,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        customer: {
          select: { id: true, name: true },
        },
      },
    });
  });

  return order;
}

export async function updateOrder(id: string, input: UpdateOrderInput) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existing) throw new Error("Order not found");
  if (existing.status !== "NOT_STARTED") {
    throw new Error("Only orders with 'Not Started' status can be edited");
  }

  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        select: { id: true, name: true, price: true, deletedAt: true },
      },
    },
  });

  if (variants.length !== variantIds.length) {
    throw new Error("One or more variants not found");
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  for (const item of input.items) {
    const variant = variantMap.get(item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found`);
    if (variant.product.deletedAt) {
      throw new Error(`Product "${variant.product.name}" has been deleted`);
    }

    const originalItem = existing.items.find(
      (oi) => oi.variantId === item.variantId
    );
    const originalQty = originalItem?.quantity ?? 0;
    const stockDiff = item.quantity - originalQty;

    if (stockDiff > 0 && variant.stock < stockDiff) {
      throw new Error(
        `Insufficient stock for ${variant.product.name} (${variant.color}/${variant.size}). Available: ${variant.stock}, need additional: ${stockDiff}`
      );
    }
  }

  const duplicateVariantIds = input.items
    .map((i) => i.variantId)
    .filter((id, index, arr) => arr.indexOf(id) !== index);
  if (duplicateVariantIds.length > 0) {
    throw new Error("Duplicate variants are not allowed in the same order");
  }

  return prisma.$transaction(async (tx) => {
    for (const oldItem of existing.items) {
      await tx.productVariant.update({
        where: { id: oldItem.variantId },
        data: { stock: { increment: oldItem.quantity } },
      });
    }

    await tx.orderItem.deleteMany({ where: { orderId: id } });

    const orderItems = input.items.map((item) => {
      const variant = variantMap.get(item.variantId)!;
      const price = Number(variant.product.price);
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        subtotal: price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    for (const item of input.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id },
      data: {
        subtotal,
        discount: 0,
        total: subtotal,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        customer: {
          select: { id: true, name: true },
        },
      },
    });
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus, userId: string) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, username: true } },
    },
  });
  if (!existing) throw new Error("Order not found");

  if (status === (existing.status as OrderStatus)) {
    return getOrderById(id);
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    // When reverting to NOT_STARTED, restore stock (undo the original deduction)
    if (status === "NOT_STARTED" && existing.status !== "NOT_STARTED") {
      for (const item of existing.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        customer: {
          select: { id: true, name: true },
        },
      },
    });
  });

  // Send notifications to all other users
  const orderNumber = existing.orderNumber;
  const statusLabel = ORDER_STATUS_LABELS[status];
  const notificationTitle = `Order #${orderNumber}`;
  const notificationBody = `Status updated to "${statusLabel}" by ${existing.user?.username || 'a user'}`;

  // Get all users except the one who made the change
  const otherUsers = await prisma.user.findMany({
    where: { id: { not: userId } },
    select: { id: true },
  });

  // Create notifications in DB and send push notifications
  for (const user of otherUsers) {
    await createNotification(user.id, notificationTitle, notificationBody, id);
    await sendNotification(user.id, notificationTitle, notificationBody, id).catch(() => {
      // Ignore push notification errors - they're best effort
    });
  }

  return updatedOrder;
}

export async function deleteOrder(id: string) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existing) throw new Error("Order not found");

  return prisma.$transaction(async (tx) => {
    for (const item of existing.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.order.delete({ where: { id } });
  });
}

export async function getCustomerOrderStats(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });
  if (!customer) return null;

  const [orderCount, itemAggregation, lastOrder] = await Promise.all([
    prisma.order.count({ where: { customerId } }),
    prisma.orderItem.aggregate({
      where: { order: { customerId } },
      _sum: { quantity: true },
    }),
    prisma.order.findFirst({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  return {
    totalOrders: orderCount,
    totalItemsPurchased: itemAggregation._sum.quantity ?? 0,
    mostRecentOrderDate: lastOrder?.createdAt ?? null,
  };
}
