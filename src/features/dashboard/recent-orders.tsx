"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShoppingCart, Package } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT } from "@/lib/constants";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";
import { cn } from "@/lib/utils";

interface RecentOrder {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  customer: { id: string; name: string };
  items: { quantity: number }[];
}

const statusDotColors: Record<string, string> = {
  NOT_STARTED: "bg-amber-500",
  PROCESSING: "bg-blue-500",
  DONE: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
};

function getStatusDotColor(status: string): string {
  return statusDotColors[status] ?? "bg-muted-foreground";
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/30 p-3.5 sm:p-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="space-y-2 min-w-0 flex-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
    </div>
  );
}

export function RecentOrders() {
  const { refreshKey } = useDashboardRefresh();
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/recent-orders");
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchOrders();
    });
  }, [fetchOrders, startTransition]);

  useEffect(() => {
    if (refreshKey > 0) {
      startTransition(() => {
        fetchOrders();
      });
    }
  }, [refreshKey, fetchOrders, startTransition]);

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <ShoppingCart className="size-4 text-primary" />
          </div>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </div>
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="sm" className="gap-1.5">
            View All
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {loading ? (
          <div className="space-y-2.5">
            {[...Array(4)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50">
              <Package className="size-7 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No orders yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/customers/${order.customer.id}`}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl border border-border/30 p-3.5 transition-all duration-200 sm:p-4",
                    "hover:border-border/60 hover:bg-muted/30 hover:shadow-soft",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Order number avatar */}
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                        "bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:scale-105"
                      )}
                    >
                      #{order.orderNumber.toString().slice(-2)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          #{order.orderNumber}
                        </span>
                        <span className="hidden text-xs text-muted-foreground/50 sm:inline">·</span>
                        <span className="hidden truncate text-sm text-muted-foreground sm:inline">
                          {order.customer.name}
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span>{getTimeAgo(order.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={ORDER_STATUS_VARIANT[order.status as keyof typeof ORDER_STATUS_VARIANT] ?? "secondary"}
                      className="shrink-0 gap-1.5 pl-2"
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          getStatusDotColor(order.status)
                        )}
                      />
                      {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                    </Badge>
                    <ArrowRight className="size-4 text-muted-foreground/30 transition-all duration-200 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
