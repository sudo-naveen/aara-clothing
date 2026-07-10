import { Suspense } from "react";
import { listInventory } from "@/features/inventory/inventory-service";
import { inventoryQuerySchema } from "@/features/inventory/inventory-validation";
import { InventoryTable } from "@/features/inventory/inventory-table";

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

  const result = await listInventory(query);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Stock Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage stock levels for all product variants
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <InventoryTable
          data={result.data}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
        />
      </Suspense>
    </div>
  );
}
