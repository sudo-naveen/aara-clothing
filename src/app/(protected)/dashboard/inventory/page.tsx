import { Suspense } from "react";
import Link from "next/link";
import { listProducts, getVariantsInUse } from "@/features/inventory/inventory-service";
import { productQuerySchema } from "@/features/inventory/inventory-validation";
import { ProductTable } from "@/features/inventory/product-table";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/fab";
import { Boxes, Plus } from "lucide-react";
import { getLowStockThreshold } from "@/lib/settings";

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

  const [result, variantsInUse, lowStockThreshold] = await Promise.all([
    listProducts(query),
    getVariantsInUse(),
    getLowStockThreshold(),
  ]);

  const rows = result.data.map((p) => ({
    id: p.id,
    name: p.name,
    variants: (p as typeof p & { variants?: { id: string; color: string; size: string; stock: number }[] }).variants ?? [],
    isActive: p.isActive,
    createdAt: p.createdAt,
  }));

  return (
    <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-primary/8 blur-3xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
            <Boxes className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Inventory
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Manage your products and stock levels
            </p>
          </div>
        </div>
        <Link href="/dashboard/inventory/new" className="self-start">
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProductTable
          data={rows}
          variantsInUse={variantsInUse}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
          lowStockThreshold={lowStockThreshold}
        />
      </Suspense>
      <FloatingActionButton
        icon={<Plus className="size-6" />}
        label="Add Product"
        href="/dashboard/inventory/new"
      />
    </div>
  );
}
