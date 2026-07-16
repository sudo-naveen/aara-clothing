"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Users } from "lucide-react";
import type { Column } from "@/components/data-table";
import { formatDate } from "@/utils/format";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  orderCount: number;
  lastOrderDate: Date | null;
}

interface Props {
  data: CustomerRow[];
  page: number;
  totalPages: number;
  search: string;
}

export function CustomersTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Customer deleted successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const columns: Column<CustomerRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={`/dashboard/customers/${item.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "address",
      header: "Address",
      cell: (item) => (
        <span className="text-muted-foreground">
          {item.address ?? "-"}
        </span>
      ),
    },
    {
      key: "orderCount",
      header: "Orders",
      cell: (item) => (
        <span className="font-medium">{item.orderCount}</span>
      ),
    },
    {
      key: "lastOrderDate",
      header: "Last Order",
      cell: (item) => (
        <span className="text-muted-foreground">
          {item.lastOrderDate
            ? formatDate(item.lastOrderDate)
            : "-"}
        </span>
      ),
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
          <Link href={`/dashboard/customers/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(item.id, item.name)}
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
          placeholder="Search by name or phone..."
        />
        <Card className="flex flex-col items-center justify-center rounded-2xl border-border/50 py-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
            <Users className="size-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">No customers yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first customer to get started
          </p>
          <Link href="/dashboard/customers/new" className="mt-4">
            <Button size="sm">
              <Pencil className="size-4" />
              Add Customer
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
        placeholder="Search by name or phone..."
      />

      {/* Mobile card view */}
      <div className="space-y-2 md:hidden">
        {data.map((item) => (
          <Card key={item.id} className="rounded-xl border-border/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/customers/${item.id}`}
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.phone}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {item.orderCount} {item.orderCount === 1 ? "order" : "orders"}
                  </span>
                  {item.lastOrderDate && (
                    <span className="text-xs text-muted-foreground">
                      Last: {formatDate(item.lastOrderDate)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/dashboard/customers/${item.id}`}>
                  <Button variant="ghost" size="icon-sm">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(item.id, item.name)}
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
          emptyMessage="No customers found"
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
