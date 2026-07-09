import { Suspense } from "react";
import Link from "next/link";
import { listProducts } from "@/features/products/products-service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "@/features/products/products-table";

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="size-4" />
            New Product
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTable
          data={result.data.map((p: any) => ({
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
