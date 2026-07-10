import { Suspense } from "react";
import Link from "next/link";
import { listCustomers } from "@/features/customers/customers-service";
import { customerQuerySchema } from "@/features/customers/customers-validation";
import { CustomersTable } from "@/features/customers/customers-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = customerQuerySchema.parse({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search ?? "",
  });

  const result = await listCustomers(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Customers</h2>
          <p className="text-sm text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="size-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersTable
          data={result.data}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
        />
      </Suspense>
    </div>
  );
}
