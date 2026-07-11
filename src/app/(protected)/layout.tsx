import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { SignOutButton } from "@/features/auth/sign-out-button";
import {
  LayoutDashboard,
  Package2,
  Boxes,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.PRODUCTS, label: "Products", icon: Package2 },
  { href: ROUTES.INVENTORY, label: "Inventory", icon: Boxes },
  { href: ROUTES.CUSTOMERS, label: "Customers", icon: Users },
  { href: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="pin-stripe absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <div className="flex size-9 items-center justify-center rounded-xl gradient-accent shadow-md shadow-primary/20">
                <Package2 className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Aara Clothing
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:text-foreground hover:shadow-sm"
                  >
                    <Icon className="size-4 transition-colors duration-200 group-hover:text-primary" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center">
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="pin-stripe-vertical absolute top-16 left-0 h-[calc(100%-4rem)] w-4 opacity-20 pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
