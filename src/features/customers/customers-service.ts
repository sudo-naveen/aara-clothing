import { prisma } from "@/lib/prisma";
import type {
  CustomerQuery,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers-validation";

export async function listCustomers(query: CustomerQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  const customerIds = data.map((c) => c.id);

  const lastOrders = await prisma.order.groupBy({
    by: ["customerId"],
    where: { customerId: { in: customerIds } },
    _max: { createdAt: true },
  });

  const lastOrderMap = new Map(
    lastOrders.map((o) => [o.customerId, o._max.createdAt])
  );

  const enriched = data.map((customer) => ({
    ...customer,
    orderCount: customer._count.orders,
    lastOrderDate: lastOrderMap.get(customer.id) ?? null,
  }));

  return {
    data: enriched,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });
}

export async function createCustomer(input: CreateCustomerInput) {
  try {
    return await prisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone,
        address: input.address ?? null,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint") &&
      error.message.includes("phone")
    ) {
      throw new Error("A customer with this phone number already exists");
    }
    throw error;
  }
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return null;

  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.address !== undefined) data.address = input.address ?? null;

  try {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint") &&
      error.message.includes("phone")
    ) {
      throw new Error("A customer with this phone number already exists");
    }
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return null;

  const activeOrderCount = await prisma.order.count({
    where: { customerId: id, status: { not: "DONE" } },
  });
  if (activeOrderCount > 0) {
    throw new Error("Cannot delete customer with active orders (not yet completed)");
  }

  return prisma.customer.delete({ where: { id } });
}
