"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Layers,
  Users,
  ShoppingCart,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle,
  XOctagon,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalVariants: number;
  totalCustomers: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface Props {
  stats: Stats;
}

export function DashboardWidgets({ stats }: Props) {
  const cards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingCart,
      href: "/dashboard/customers",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      href: "/dashboard/customers",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Package,
      href: "/dashboard/customers",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/dashboard/inventory",
      color: "text-[var(--aara-secondary)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Variants",
      value: stats.totalVariants,
      icon: Layers,
      href: "/dashboard/inventory",
      color: "text-[var(--aara-accent)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      href: "/dashboard/customers",
      color: "text-[var(--aara-secondary)]",
      bg: "bg-[var(--aara-highlight)]/20",
    },
    {
      title: "Total Stock Units",
      value: stats.totalStockUnits,
      icon: ShoppingCart,
      href: "/dashboard/inventory/stock",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      href: "/dashboard/inventory/stock",
      color: stats.lowStockProducts > 0 ? "text-amber-600" : "text-muted-foreground",
      bg: stats.lowStockProducts > 0 ? "bg-amber-50" : "bg-muted",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      href: "/dashboard/inventory/stock",
      color: stats.outOfStockProducts > 0 ? "text-destructive" : "text-muted-foreground",
      bg: stats.outOfStockProducts > 0 ? "bg-red-50" : "bg-muted",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      href: "/dashboard/customers",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: XOctagon,
      href: "/dashboard/customers",
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card className="group cursor-pointer border-border transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`flex size-9 items-center justify-center rounded-xl ${card.bg} transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className={`size-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{card.value}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
