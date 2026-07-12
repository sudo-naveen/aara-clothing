"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Column } from "@/components/data-table";

interface ProductRow {
  id: string;
  name: string;
  variantCount: number;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  data: ProductRow[];
  page: number;
  totalPages: number;
  search: string;
}

export function ProductTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }

  const columns: Column<ProductRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={`/dashboard/inventory/${item.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "variantCount",
      header: "Variants",
      className: "text-center",
    },
    {
      key: "isActive",
      header: "Status",
      cell: (item) =>
        item.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-1">
          <Link href={`/dashboard/inventory/${item.id}`}>
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

  return (
    <div className="w-full space-y-4">
      <SearchInput
        value={search}
        onChange={(val) => {
          const url = new URL(window.location.href);
          url.searchParams.set("search", val);
          url.searchParams.delete("page");
          router.push(url.pathname + url.search);
        }}
        placeholder="Search products..."
      />
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        emptyMessage="No products found"
      />
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
