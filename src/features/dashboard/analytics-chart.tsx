"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface Props {
  initialStats: Stats;
}

export function AnalyticsChart({ initialStats }: Props) {
  const { refreshKey } = useDashboardRefresh();
  const [stats, setStats] = useState<Stats>(initialStats);
  const [, startTransition] = useTransition();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      startTransition(() => {
        fetchStats();
      });
    }
  }, [refreshKey, fetchStats, startTransition]);

  const maxValue = Math.max(
    stats.todayOrders,
    stats.pendingOrders,
    stats.processingOrders,
    stats.deliveredOrders,
    1
  );

  const orderBars = [
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      color: "bg-amber-500",
    },
    {
      label: "Processing",
      value: stats.processingOrders,
      color: "bg-blue-500",
    },
    {
      label: "Delivered",
      value: stats.deliveredOrders,
      color: "bg-primary",
    },
  ];

  return (
    <Card variant="default">
      <CardHeader className="border-b border-border/30 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="size-4 text-primary" />
          </div>
          <CardTitle className="text-base">Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <div className="space-y-4">
          {orderBars.map((bar) => {
            const percentage = (bar.value / maxValue) * 100;
            return (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground/80">
                    {bar.label}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {bar.value}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      bar.color
                    )}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-muted/20 p-3 sm:flex sm:gap-4">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Low Stock</p>
            <p className="text-sm font-semibold text-amber-500">{stats.lowStockProducts}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Out of Stock</p>
            <p className="text-sm font-semibold text-rose-500">{stats.outOfStockProducts}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-semibold text-emerald-500">{stats.todayOrders}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-sm font-semibold text-amber-500">{stats.pendingOrders}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
