"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Inventory", href: ROUTES.INVENTORY, icon: Package },
  { name: "Customers", href: ROUTES.CUSTOMERS, icon: Users },
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-6 overflow-y-auto px-4 py-6">
        {/* Logo */}
        <Link href={ROUTES.DASHBOARD} className="flex items-center px-2">
          <Image
            src="/aara-logo-white.png"
            alt="Aara Clothing"
            height={32}
            width={64}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[var(--aara-secondary)] to-[var(--aara-accent)] text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-border pt-4">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
