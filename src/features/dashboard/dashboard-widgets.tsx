"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

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

const cardLinks: Record<string, string> = {
  "Today's Orders": ROUTES.DASHBOARD,
  "Pending Orders": ROUTES.CUSTOMERS,
  Processing: ROUTES.CUSTOMERS,
  Delivered: ROUTES.CUSTOMERS,
  "Low Stock": ROUTES.INVENTORY,
  "Out of Stock": ROUTES.INVENTORY,
};

export function DashboardWidgets({ initialStats }: Props) {
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
      // silently fail, keep current stats
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      startTransition(() => {
        fetchStats();
      });
    }
  }, [refreshKey, fetchStats, startTransition]);

  const cards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingBag,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      accent: "group-hover:shadow-primary/10",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary",
      accent: "group-hover:shadow-secondary/10",
    },
    {
      title: "Processing",
      value: stats.processingOrders,
      icon: Truck,
      gradient: "from-secondary/15 to-secondary/5",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      accent: "group-hover:shadow-secondary/10",
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      gradient: "from-primary/15 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      accent: "group-hover:shadow-primary/10",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      gradient: stats.lowStockProducts > 0 ? "from-amber-500/15 to-amber-500/5" : "from-muted/50 to-muted/20",
      iconBg: stats.lowStockProducts > 0 ? "bg-amber-500/15" : "bg-muted/50",
      iconColor: stats.lowStockProducts > 0 ? "text-amber-500" : "text-muted-foreground",
      accent: stats.lowStockProducts > 0 ? "group-hover:shadow-amber-500/10" : "",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      gradient: stats.outOfStockProducts > 0 ? "from-destructive/15 to-destructive/5" : "from-muted/50 to-muted/20",
      iconBg: stats.outOfStockProducts > 0 ? "bg-destructive/15" : "bg-muted/50",
      iconColor: stats.outOfStockProducts > 0 ? "text-destructive" : "text-muted-foreground",
      accent: stats.outOfStockProducts > 0 ? "group-hover:shadow-destructive/10" : "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const href = cardLinks[card.title];

        const cardContent = (
          <Card
            className={`group card-shine transition-all duration-200 hover:translate-y-[-2px] hover:shadow-elevated ${card.accent} ${href ? "cursor-pointer" : "cursor-default"}`}
            tabIndex={href ? 0 : undefined}
            role={href ? "link" : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md`}>
                <Icon className={`size-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{card.value}</div>
            </CardContent>
          </Card>
        );

        if (href) {
          return (
            <Link key={card.title} href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl">
              {cardContent}
            </Link>
          );
        }

        return <div key={card.title}>{cardContent}</div>;
      })}
    </div>
  );
}
