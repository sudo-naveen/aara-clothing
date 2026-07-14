"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronRight, Pencil, Loader2, Package } from "lucide-react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT, type OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

interface OrderItem {
  id: string;
  variant: {
    product: { id: string; name: string };
    color: string;
    size: string;
    sku: string;
  };
  quantity: number;
}

interface OrderRow {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
  total?: number;
}

interface Props {
  customerId: string;
  orders: OrderRow[];
  onStatusChange?: () => void;
}

const statusVariant = ORDER_STATUS_VARIANT;

function StatusSelector({
  orderId,
  currentStatus,
  onStatusChange,
}: {
  orderId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}) {
  const router = useRouter();
  const { requestRefresh } = useDashboardRefresh();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleChange = useCallback(
    async (newStatus: string) => {
      const previousStatus = optimisticStatus;
      setOptimisticStatus(newStatus);

      startTransition(async () => {
        try {
          const res = await fetch(`/api/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });
          const result = await res.json();
          if (!result.success) throw new Error(result.error);
          toast.success(
            `Status updated to ${ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS]}`
          );
          requestRefresh();
          onStatusChange?.();
          router.refresh();
        } catch (error) {
          setOptimisticStatus(previousStatus);
          if (error instanceof Error) toast.error(error.message);
        }
      });
    },
    [orderId, router, optimisticStatus, onStatusChange]
  );

  const variant = statusVariant[optimisticStatus as OrderStatus] ?? "secondary";
  const variantStyles: Record<string, string> = {
    default: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-muted/50 text-muted-foreground border-muted-foreground/20",
    success: "bg-success/10 text-success border-success/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    outline: "border border-border",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={optimisticStatus}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending}
          className={cn(
            "appearance-none rounded-full px-3 py-1 pr-8 text-xs font-medium transition-all duration-200",
            "border cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant] ?? variantStyles.secondary
          )}
        >
          {Object.values(ORDER_STATUSES).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 opacity-60" />
      </div>
      {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
}

export function CustomerOrdersSection({ customerId, orders, onStatusChange }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  function toggleExpand(orderId: string) {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  }

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  const orderCounts = {
    all: orders.length,
    NOT_STARTED: orders.filter((o) => o.status === "NOT_STARTED").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    DONE: orders.filter((o) => o.status === "DONE").length,
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Order History</CardTitle>
          <Link href={`/dashboard/customers/${customerId}/orders/new`} className="self-start">
            <Button size="sm">
              <Plus className="size-4" />
              New Order
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
              <Package className="size-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No orders yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create the first order for this customer
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Order History</CardTitle>
        <Link href={`/dashboard/customers/${customerId}/orders/new`} className="self-start">
          <Button size="sm">
            <Plus className="size-4" />
            New Order
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {/* Status Filter Tabs */}
        <div className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-none border-b border-border/50 px-3 sm:px-4 pt-2">
          {(["all", "NOT_STARTED", "PROCESSING", "DONE"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                statusFilter === status
                  ? "border-b-2 border-primary bg-muted/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              )}
            >
              {status === "all" ? "All" : ORDER_STATUS_LABELS[status]}
              <span className="ml-1 text-xs text-muted-foreground">({orderCounts[status]})</span>
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No orders with this status</p>
        ) : (
          <>
            {/* Mobile: Card view */}
            <div className="md:hidden divide-y divide-border/30">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div key={order.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpand(order.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(order.id); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer"
                    >
                      <div className="flex size-6 shrink-0 items-center justify-center">
                        {isExpanded ? (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">#{order.orderNumber}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <StatusSelector
                            orderId={order.id}
                            currentStatus={order.status}
                            onStatusChange={onStatusChange}
                          />
                          <span className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Link
                          href={`/dashboard/customers/${customerId}/orders/${order.id}`}
                          className="text-xs font-medium text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </Link>
                        {(order.status as string) === "NOT_STARTED" && (
                          <Link
                            href={`/dashboard/customers/${customerId}/orders/${order.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="icon-sm">
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {isExpanded && order.items.length > 0 && (
                      <div className="border-t border-border/20 bg-muted/10 px-4 py-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-2 text-sm">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{item.variant.product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.variant.color} / {item.variant.size}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">{item.variant.sku}</p>
                            </div>
                            <span className="shrink-0 font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop: Table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 backdrop-blur-sm">
                    <th className="w-10 px-2 py-3" />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <tr key={order.id} className={cn("border-b border-border/30 last:border-0 table-row-hover", index % 2 === 1 && "bg-muted/5")}>
                        <td colSpan={6} className="p-0">
                          <div>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleExpand(order.id)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(order.id); }}
                              className="flex w-full items-center px-2 py-3 text-left cursor-pointer"
                            >
                              <div className="flex w-6 shrink-0 items-center justify-center">
                                {isExpanded ? (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="size-4 text-muted-foreground" />
                                )}
                              </div>
                              <span className="w-[100px] px-2 font-mono text-xs">#{order.orderNumber}</span>
                              <div className="w-[160px] px-2">
                                <StatusSelector
                                  orderId={order.id}
                                  currentStatus={order.status}
                                  onStatusChange={onStatusChange}
                                />
                              </div>
                              <span className="w-[60px] px-2 text-center text-muted-foreground">{order.items.length}</span>
                              <span className="w-[120px] px-2 text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex flex-1 items-center justify-end gap-2 px-2">
                                <Link
                                  href={`/dashboard/customers/${customerId}/orders/${order.id}`}
                                  className="text-sm font-medium text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View
                                </Link>
                                {(order.status as string) === "NOT_STARTED" && (
                                  <Link
                                    href={`/dashboard/customers/${customerId}/orders/${order.id}/edit`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button variant="ghost" size="icon-sm">
                                      <Pencil className="size-4" />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>

                            {isExpanded && order.items.length > 0 && (
                              <div className="border-t border-border/20 bg-muted/10">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-border/10">
                                      <th className="w-10 px-2" />
                                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Variant</th>
                                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                                      <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                                      <th className="w-[100px] px-2" />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item) => (
                                      <tr key={item.id} className="border-b border-border/10 last:border-0">
                                        <td className="w-10 px-2" />
                                        <td className="px-4 py-2 font-medium text-foreground/80">
                                          {item.variant.product.name}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                          {item.variant.color} / {item.variant.size}
                                        </td>
                                        <td className="px-4 py-2">
                                          <span className="font-mono text-xs text-muted-foreground">{item.variant.sku}</span>
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium">{item.quantity}</td>
                                        <td className="w-[100px] px-2" />
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
