"use client";

import { useEffect, useState, useCallback, useTransition, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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

function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    function animate(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    startTime.current = null;
    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [value, duration]);

  return <>{display}</>;
}

const cardStyles = [
  {
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    glowColor: "shadow-emerald-500/5",
    ringColor: "ring-emerald-500/20",
  },
  {
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
    glowColor: "shadow-amber-500/5",
    ringColor: "ring-amber-500/20",
  },
  {
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    glowColor: "shadow-blue-500/5",
    ringColor: "ring-blue-500/20",
  },
  {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    glowColor: "shadow-primary/5",
    ringColor: "ring-primary/20",
  },
  {
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
    glowColor: "shadow-rose-500/5",
    ringColor: "ring-rose-500/20",
  },
  {
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    glowColor: "shadow-violet-500/5",
    ringColor: "ring-violet-500/20",
  },
  {
    gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-500",
    glowColor: "shadow-sky-500/5",
    ringColor: "ring-sky-500/20",
  },
  {
    gradient: "from-teal-500/10 via-teal-500/5 to-transparent",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-500",
    glowColor: "shadow-teal-500/5",
    ringColor: "ring-teal-500/20",
  },
  {
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
    glowColor: "shadow-orange-500/5",
    ringColor: "ring-orange-500/20",
  },
  {
    gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500",
    glowColor: "shadow-cyan-500/5",
    ringColor: "ring-cyan-500/20",
  },
];

export function DashboardWidgets({ initialStats }: Props) {
  const { refreshKey } = useDashboardRefresh();
  const [stats, setStats] = useState<Stats>(initialStats);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
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
      href: ROUTES.DASHBOARD,
      style: cardStyles[0],
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      href: ROUTES.CUSTOMERS,
      style: cardStyles[1],
    },
    {
      title: "Processing",
      value: stats.processingOrders,
      icon: Truck,
      href: ROUTES.CUSTOMERS,
      style: cardStyles[2],
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      href: ROUTES.CUSTOMERS,
      style: cardStyles[3],
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      href: ROUTES.INVENTORY,
      style: cardStyles[4],
      alert: stats.lowStockProducts > 0,
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      href: ROUTES.INVENTORY,
      style: cardStyles[5],
      alert: stats.outOfStockProducts > 0,
    },
  ];

  return (
    <div>
      {/* Section heading */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-semibold text-foreground/80 sm:text-base">Overview</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const style = card.style;

          const cardContent = (
            <Card
              variant="stat"
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                style.glowColor,
                card.alert && "ring-2 ring-destructive/10"
              )}
            >
              {/* Gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  style.gradient
                )}
              />

              <CardContent className="relative p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground/80 sm:text-sm">
                      {card.title}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">
                        {mounted ? (
                          <AnimatedCounter value={card.value} />
                        ) : (
                          card.value
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md sm:size-12",
                      style.iconBg,
                      style.ringColor,
                      "ring-1"
                    )}
                  >
                    <Icon className={cn("size-5", style.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );

          return (
            <div
              key={card.title}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {card.href ? (
                <Link
                  href={card.href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
                >
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
