import { Suspense } from "react";
import Link from "next/link";
import { listCustomers } from "@/features/customers/customers-service";
import { customerQuerySchema } from "@/features/customers/customers-validation";
import { CustomersTable } from "@/features/customers/customers-table";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/fab";
import { Plus, Users } from "lucide-react";

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
    <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-secondary/8 blur-3xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Customers
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Manage your customer database
            </p>
          </div>
        </div>
        <Link href="/dashboard/customers/new" className="self-start">
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
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
      <FloatingActionButton
        icon={<Plus className="size-6" />}
        label="Add Customer"
        href="/dashboard/customers/new"
      />
    </div>
  );
}
