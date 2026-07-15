import { getDashboardStats } from "@/features/dashboard/dashboard-service";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { AnalyticsChart } from "@/features/dashboard/analytics-chart";
import { RecentOrders } from "@/features/dashboard/recent-orders";
import { Header } from "@/components/header";
import { auth } from "@/auth";
import { ChevronRight, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const [stats, session] = await Promise.all([
    getDashboardStats(),
    auth(),
  ]);

  const username = session?.user?.name ?? session?.user?.username ?? "there";

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-96 rounded-full blob-primary blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full blob-accent blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-48 rounded-full bg-aara-highlight/5 blur-2xl" />
      </div>

      <div className="relative">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm">
          <LayoutDashboard className="size-3.5 text-muted-foreground/60" />
          <span className="text-muted-foreground/60">Dashboard</span>
          <ChevronRight className="size-3 text-muted-foreground/30" />
          <span className="font-medium text-foreground/80">Overview</span>
        </nav>

        <Header username={username} />

        <div className="space-y-6 sm:space-y-8">
          <DashboardWidgets
            initialStats={{
              todayOrders: stats.todayOrders,
              pendingOrders: stats.pendingOrders,
              processingOrders: stats.processingOrders,
              deliveredOrders: stats.deliveredOrders,
              lowStockProducts: stats.lowStockProducts,
              outOfStockProducts: stats.outOfStockProducts,
            }}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsChart
              initialStats={{
                todayOrders: stats.todayOrders,
                pendingOrders: stats.pendingOrders,
                processingOrders: stats.processingOrders,
                deliveredOrders: stats.deliveredOrders,
                lowStockProducts: stats.lowStockProducts,
                outOfStockProducts: stats.outOfStockProducts,
              }}
            />
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
}
