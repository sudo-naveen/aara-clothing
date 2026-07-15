import { Suspense } from "react";
import Link from "next/link";
import { listCategories } from "@/features/categories/categories-service";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/fab";
import { Plus, Layers } from "lucide-react";
import { CategoriesTable } from "@/features/categories/categories-table";
import type { Category } from "@/types";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function CategoriesPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const result = await listCategories({
    page: page ? Number(page) : 1,
    limit: 20,
    search,
  });

  const categories = result.data as (Category & {
    parent?: { id: string; name: string } | null;
    _count?: { products: number };
  })[];

  return (
    <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-secondary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
            <Layers className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Categories
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Organize your products
            </p>
          </div>
        </div>
        <Link href="/dashboard/categories/new" className="self-start">
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
            New Category
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable
          data={categories.map((cat) => ({
            ...cat,
            parentName: cat.parent?.name ?? null,
            productCount: cat._count?.products ?? 0,
          }))}
          page={result.page}
          totalPages={result.totalPages}
          search={search ?? ""}
        />
      </Suspense>
      <FloatingActionButton
        icon={<Plus className="size-6" />}
        label="Add Category"
        href="/dashboard/categories/new"
      />
    </div>
  );
}
