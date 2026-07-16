"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Package, ChevronDown, ChevronRight } from "lucide-react";
import { getStockStatus, STOCK_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";

interface VariantRow {
  id: string;
  color: string;
  size: string;
  stock: number;
}

interface ProductRow {
  id: string;
  name: string;
  variants: VariantRow[];
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  data: ProductRow[];
  variantsInUse: Map<string, { inUse: number; ordered: number }>;
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
    <Badge variant={variantMap[status]} className="text-[10px]">
      {STOCK_STATUS_LABELS[status]} ({stock})
    </Badge>
  );
}

export function ProductTable({ data, variantsInUse, page, totalPages, search, lowStockThreshold }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

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
          placeholder="Search products..."
        />
        <Card className="flex flex-col items-center justify-center rounded-2xl border-border/50 py-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
            <Package className="size-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">No products yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first product to get started
          </p>
          <Link href="/dashboard/inventory/new" className="mt-4">
            <Button size="sm">
              <Pencil className="size-4" />
              Add Product
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
        placeholder="Search products..."
      />

      {/* Mobile card view */}
      <div className="space-y-2 md:hidden">
        {data.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <Card key={item.id} className="rounded-xl border-border/50 overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(item.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleExpand(item.id); }}
                className="flex items-start justify-between gap-3 p-4 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex size-5 shrink-0 items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <Link
                      href={`/dashboard/inventory/${item.id}`}
                      className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 pl-7">
                    <span className="text-xs text-muted-foreground">
                      {item.variants.length} {item.variants.length === 1 ? "variant" : "variants"}
                    </span>
                    <Badge variant={item.isActive ? "success" : "secondary"} className="text-[10px]">
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link href={`/dashboard/inventory/${item.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {isExpanded && item.variants.length > 0 && (
                <div className="border-t border-border/30 bg-muted/10 px-4 py-3 space-y-2">
                  {item.variants.map((v) => {
                    const usage = variantsInUse.get(v.id);
                    const inUse = usage?.inUse ?? 0;
                    const ordered = usage?.ordered ?? 0;
                    return (
                      <div key={v.id} className="flex items-center justify-between gap-2 text-sm pl-7">
                        <span className="text-muted-foreground">
                          {v.color} / {v.size}
                        </span>
                        <div className="flex items-center gap-2">
                          {ordered > 0 && (
                            <Badge variant="secondary" className="text-[10px]">Order({ordered})</Badge>
                          )}
                          {inUse > 0 && (
                            <Badge variant="warning" className="text-[10px]">In Use: {inUse}</Badge>
                          )}
                           <StockBadge stock={v.stock} lowStockThreshold={lowStockThreshold} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {isExpanded && item.variants.length === 0 && (
                <div className="border-t border-border/30 bg-muted/10 px-4 py-3 pl-7">
                  <p className="text-xs text-muted-foreground">No variants</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Desktop table view with expandable rows */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <colgroup>
            <col className="w-8" />
            <col />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-28" />
            <col className="w-20" />
          </colgroup>
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-3 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variants</th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <tr key={item.id}>
                  <td colSpan={6} className="p-0">
                    <div className={cn("border-b border-border/30", index % 2 === 1 && "bg-muted/5")}>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="flex size-8 shrink-0 items-center justify-center"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-3.5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex flex-1 items-center py-3">
                          <div className="flex-1 px-0">
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="font-medium text-foreground transition-colors hover:text-primary text-left"
                            >
                              {item.name}
                            </button>
                          </div>
                          <div className="w-24 text-center text-muted-foreground">
                            {item.variants.length}
                          </div>
                          <div className="w-24 text-center">
                            <Badge variant={item.isActive ? "success" : "secondary"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="w-28 text-muted-foreground">
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="flex w-20 items-center justify-end gap-1 pr-3">
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
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-border/20 bg-muted/10 pl-8">
                          {item.variants.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border/10">
                                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Color</th>
                                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Size</th>
                                  <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">In Use</th>
                                  <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.variants.map((v) => {
                                  const usage = variantsInUse.get(v.id);
                                  const inUse = usage?.inUse ?? 0;
                                  const ordered = usage?.ordered ?? 0;
                                  return (
                                    <tr key={v.id} className="border-b border-border/10 last:border-0">
                                      <td className="px-4 py-2 text-muted-foreground">{v.color}</td>
                                      <td className="px-4 py-2 text-muted-foreground">{v.size}</td>
                                      <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          {ordered > 0 && (
                                            <Badge variant="secondary" className="text-[10px]">Ordered: {ordered}</Badge>
                                          )}
                                          {inUse > 0 && (
                                            <Badge variant="warning" className="text-[10px]">In Use: {inUse}</Badge>
                                          )}
                                          {ordered === 0 && inUse === 0 && (
                                            <span className="text-muted-foreground">—</span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 text-right"><StockBadge stock={v.stock} /></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <p className="px-4 py-3 text-xs text-muted-foreground">No variants</p>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
