import { prisma } from "@/lib/prisma";
import type { CreateVariantInput, UpdateVariantInput } from "./variants-validation";

export async function listVariants(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getVariantById(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
  });
}

export async function createVariant(input: CreateVariantInput) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, deletedAt: null },
  });
  if (!product) throw new Error("Product not found");

  return prisma.productVariant.create({
    data: {
      productId: input.productId,
      color: input.color,
      size: input.size,
      stock: input.stock ?? 0,
    },
  });
}

export async function updateVariant(id: string, input: UpdateVariantInput) {
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return null;

  const data: Record<string, unknown> = {};
  if (input.color !== undefined) data.color = input.color;
  if (input.size !== undefined) data.size = input.size;
  if (input.stock !== undefined) data.stock = input.stock;

  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

export async function deleteVariant(id: string) {
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.productVariant.delete({ where: { id } });
}
