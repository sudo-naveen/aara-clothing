import { Suspense } from "react";
import { listProducts } from "@/features/inventory/inventory-service";
import { productQuerySchema } from "@/features/inventory/inventory-validation";
import { ProductTable } from "@/features/inventory/product-table";
import { Boxes } from "lucide-react";
import type { Product } from "@/types";

interface ProductRow {
  id: string;
  name: string;
  variantCount: number;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function InventoryPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const query = productQuerySchema.parse({
    page: page ? Number(page) : 1,
    limit: 20,
    search,
  });

  const result = await listProducts(query);

  const rows: ProductRow[] = result.data.map((p) => ({
    id: p.id,
    name: p.name,
    variantCount: (p as Product & { _count?: { variants: number } })._count?.variants ?? 0,
    isActive: p.isActive,
    createdAt: p.createdAt,
  }));

  return (
    <div className="relative space-y-6 p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-primary/8 blur-3xl" />
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
          <Boxes className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your products and stock levels
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProductTable
          data={rows}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
        />
      </Suspense>
    </div>
  );
}
