import { Suspense } from "react";
import { listInventory } from "@/features/inventory/inventory-service";
import { inventoryQuerySchema } from "@/features/inventory/inventory-validation";
import { InventoryTable } from "@/features/inventory/inventory-table";
import { getLowStockThreshold } from "@/lib/settings";

export default async function InventoryStockPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = inventoryQuerySchema.parse({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search ?? "",
  });

  const [result, lowStockThreshold] = await Promise.all([
    listInventory(query),
    getLowStockThreshold(),
  ]);

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Stock Management</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Manage stock levels for all product variants
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <InventoryTable
          data={result.data}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
          lowStockThreshold={lowStockThreshold}
        />
      </Suspense>
    </div>
  );
}
