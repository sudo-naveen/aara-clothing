"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Layers } from "lucide-react";
import type { Column } from "@/components/data-table";
import { formatDate } from "@/utils/format";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  parentName: string | null;
  productCount: number;
  createdAt: Date;
}

interface Props {
  data: CategoryRow[];
  page: number;
  totalPages: number;
  search: string;
}

export function CategoriesTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }

  const columns: Column<CategoryRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={`/dashboard/categories/${item.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "parentName",
      header: "Parent",
      cell: (item) => item.parentName ?? <span className="text-muted-foreground">-</span>,
    },
    {
      key: "productCount",
      header: "Products",
      className: "text-center",
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (item) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-1">
          <Link href={`/dashboard/categories/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (data.length === 0 && !search) {
    return (
      <div className="space-y-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            const url = new URL(window.location.href);
            url.searchParams.set("search", val);
            url.searchParams.delete("page");
            router.push(url.pathname + url.search);
          }}
          placeholder="Search categories..."
        />
        <Card className="flex flex-col items-center justify-center rounded-2xl border-border/50 py-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
            <Layers className="size-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">No categories yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create categories to organize your products
          </p>
          <Link href="/dashboard/categories/new" className="mt-4">
            <Button size="sm">
              <Pencil className="size-4" />
              Create Category
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={(val) => {
          const url = new URL(window.location.href);
          url.searchParams.set("search", val);
          url.searchParams.delete("page");
          router.push(url.pathname + url.search);
        }}
        placeholder="Search categories..."
      />

      {/* Mobile card view */}
      <div className="space-y-2 md:hidden">
        {data.map((item) => (
          <Card key={item.id} className="rounded-xl border-border/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/categories/${item.id}`}
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {item.parentName && (
                    <span className="text-xs text-muted-foreground">
                      Parent: {item.parentName}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {item.productCount} {item.productCount === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/dashboard/categories/${item.id}`}>
                  <Button variant="ghost" size="icon-sm">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(item) => item.id}
          emptyMessage="No categories found"
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          const url = new URL(window.location.href);
          url.searchParams.set("page", String(p));
          router.push(url.pathname + url.search);
        }}
      />
    </div>
  );
}
