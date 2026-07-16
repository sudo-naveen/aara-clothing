"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StockUpdateDialog } from "./stock-update-dialog";
import { getStockStatus, STOCK_STATUS_LABELS } from "@/lib/constants";
import { Pencil, Package } from "lucide-react";
import type { Column } from "@/components/data-table";

interface InventoryRow {
  id: string;
  productId: string;
  product: { id: string; name: string };
  color: string;
  size: string;
  stock: number;
  createdAt: Date;
}

interface Props {
  data: InventoryRow[];
  page: number;
  totalPages: number;
  search: string;
  lowStockThreshold?: number;
}

function StockBadge({ stock, lowStockThreshold }: { stock: number; lowStockThreshold?: number }) {
  const status = getStockStatus(stock, lowStockThreshold);
  const variantMap = {
    in_stock: "success" as const,
    low_stock: "warning" as const,
    out_of_stock: "destructive" as const,
  };

  return (
    <Badge variant={variantMap[status]}>
      {STOCK_STATUS_LABELS[status]} ({stock})
    </Badge>
  );
}

export function InventoryTable({ data, page, totalPages, search, lowStockThreshold }: Props) {
  const router = useRouter();
  const [editingVariant, setEditingVariant] = useState<InventoryRow | null>(
    null
  );

  const columns: Column<InventoryRow>[] = [
    {
      key: "product",
      header: "Product",
      cell: (item) => (
        <span className="font-medium">{item.product.name}</span>
      ),
    },
    {
      key: "color",
      header: "Color",
    },
    {
      key: "size",
      header: "Size",
    },
    {
      key: "stock",
      header: "Stock",
      className: "text-center",
      cell: (item) => <StockBadge stock={item.stock} lowStockThreshold={lowStockThreshold} />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setEditingVariant(item)}
        >
          <Pencil className="size-4" />
        </Button>
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
          placeholder="Search by product, color, or size..."
        />
        <Card className="flex flex-col items-center justify-center rounded-2xl border-border/50 py-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
            <Package className="size-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">No stock items yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add products to start tracking inventory
          </p>
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
        placeholder="Search by product, color, or size..."
      />

      {/* Mobile card view */}
      <div className="space-y-2 md:hidden">
        {data.map((item) => (
          <Card key={item.id} className="rounded-xl border-border/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.product.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {item.color} / {item.size}
                  </span>
                </div>
                <div className="mt-1.5">
                  <StockBadge stock={item.stock} lowStockThreshold={lowStockThreshold} />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditingVariant(item)}
              >
                <Pencil className="size-4" />
              </Button>
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
          emptyMessage="No inventory items found"
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
      {editingVariant && (
        <StockUpdateDialog
          variant={editingVariant}
          open={!!editingVariant}
          onOpenChange={(open) => {
            if (!open) setEditingVariant(null);
          }}
          onUpdated={() => {
            setEditingVariant(null);
            toast.success("Stock updated successfully");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
