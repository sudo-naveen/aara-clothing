"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANT } from "@/lib/constants";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

interface RecentOrder {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  customer: { name: string };
  items: { quantity: number }[];
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Orders</CardTitle>
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                <div className="space-y-1">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate text-sm font-medium">
                      #{order.orderNumber}
                      <span className="ml-2 text-muted-foreground">— {order.customer.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalItems} items · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={ORDER_STATUS_VARIANT[order.status as keyof typeof ORDER_STATUS_VARIANT] ?? "secondary"} className="shrink-0">
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
