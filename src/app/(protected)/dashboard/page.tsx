import { getDashboardStats } from "@/features/dashboard/dashboard-service";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { Header } from "@/components/header";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const [stats, session] = await Promise.all([
    getDashboardStats(),
    auth(),
  ]);

  const username = session?.user?.name ?? session?.user?.username ?? "there";

  return (
    <div className="relative p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-96 rounded-full blob-primary blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full blob-accent blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-48 rounded-full bg-aara-highlight/5 blur-2xl" />
      </div>

      <div className="relative">
        <Header username={username} />
        <DashboardWidgets stats={stats} />
      </div>
    </div>
  );
}
