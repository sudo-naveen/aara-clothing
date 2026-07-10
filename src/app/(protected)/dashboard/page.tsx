import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/features/dashboard/dashboard-service";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your store today
        </p>
      </div>
      <DashboardWidgets stats={stats} />
    </div>
  );
}
