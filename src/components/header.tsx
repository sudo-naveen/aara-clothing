"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { NotificationBell } from "@/components/notification-bell";
import { SignOutButton } from "@/features/auth/sign-out-button";
import {
  Sun,
  Moon,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({ username }: { username: string }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const { theme, setTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-6 rounded-2xl border border-border/40 bg-gradient-to-br from-[var(--aara-secondary)] to-[var(--aara-accent)] shadow-lg shadow-aara-secondary/10 sm:mb-8">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/[0.04]" />
        <div className="absolute -left-8 -top-8 size-24 rounded-full bg-white/[0.03]" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="relative px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
        {/* Top row: greeting + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
              {getGreeting()}, <span className="font-bold">{username}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-white/60 sm:text-sm">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>{getFormattedDate()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex size-9 items-center justify-center rounded-xl text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            <NotificationBell />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-200 hover:bg-white/10",
                  profileOpen && "bg-white/10"
                )}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white ring-2 ring-white/10">
                  {getInitials(username)}
                </div>
                <ChevronDown className="hidden size-3.5 text-white/60 transition-transform duration-200 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 animate-in fade-in-0 zoom-in-95 origin-top-right rounded-xl border border-border/60 bg-card p-1.5 shadow-elevated">
                  <div className="border-b border-border/40 px-3 py-2.5">
                    <p className="text-sm font-medium text-card-foreground">{username}</p>
                    <p className="text-xs text-muted-foreground">Employee</p>
                  </div>
                  <div className="pt-1">
                    <SignOutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
