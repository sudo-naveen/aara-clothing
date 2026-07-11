import { Suspense } from "react";
import Link from "next/link";
import { listProducts } from "@/features/inventory/inventory-service";
import { Button } from "@/components/ui/button";
import { Plus, Package2 } from "lucide-react";
import { ProductsTable } from "@/features/products/products-table";
import type { Product } from "@/types";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const result = await listProducts({
    page: page ? Number(page) : 1,
    limit: 20,
    search,
  });

  const products = result.data as (Product & {
    category?: { id: string; name: string } | null;
    _count?: { variants: number };
  })[];

  return (
    <div className="relative space-y-6 p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
            <Package2 className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="size-4" />
            New Product
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTable
          data={products.map((p) => ({
            ...p,
            categoryName: p.category?.name ?? "-",
            variantCount: p._count?.variants ?? 0,
          }))}
          page={result.page}
          totalPages={result.totalPages}
          search={search ?? ""}
        />
      </Suspense>
    </div>
  );
}
