import { prisma } from "@/lib/prisma";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
  InventoryQuery,
  UpdateStockInput,
} from "./inventory-validation";

export async function listProducts(query: ProductQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const enriched = data.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return {
    data: enriched,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      variants: {
        include: {
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
  };
}

export async function createProduct(input: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      price: input.price ?? 0,
      isActive: input.isActive ?? true,
    },
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = input.price;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function listInventory(query: InventoryQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    product: { deletedAt: null, isActive: true },
  };

  if (search) {
    where.OR = [
      { color: { contains: search, mode: "insensitive" } },
      { size: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.productVariant.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getVariantStock(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, deletedAt: true },
      },
    },
  });
}

export async function updateStock(id: string, input: UpdateStockInput) {
  const existing = await prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: { select: { deletedAt: true } },
    },
  });

  if (!existing) {
    throw new Error("Variant not found");
  }

  if (existing.product.deletedAt) {
    throw new Error("Cannot update stock for a deleted product");
  }

  return prisma.productVariant.update({
    where: { id },
    data: { stock: input.stock },
    include: {
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function adjustStock(id: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.productVariant.findUnique({
      where: { id },
      include: {
        product: { select: { deletedAt: true } },
      },
    });

    if (!existing) {
      throw new Error("Variant not found");
    }

    if (existing.product.deletedAt) {
      throw new Error("Cannot update stock for a deleted product");
    }

    const newStock = existing.stock + amount;

    if (newStock < 0) {
      throw new Error(
        `Insufficient stock. Current stock: ${existing.stock}, adjustment: ${amount}`
      );
    }

    return tx.productVariant.update({
      where: { id },
      data: { stock: newStock },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    });
  });
}
