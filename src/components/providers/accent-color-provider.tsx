"use client";

import { useEffect } from "react";
import {
  ACCENT_COLORS,
  ACCENT_COLOR_STORAGE_KEY,
  DEFAULT_ACCENT_COLOR_ID,
} from "@/lib/accent-colors";

function applyStoredAccentColor() {
  const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  const colorId =
    stored && ACCENT_COLORS.some((c) => c.id === stored)
      ? stored
      : DEFAULT_ACCENT_COLOR_ID;

  const color = ACCENT_COLORS.find((c) => c.id === colorId);
  if (!color) return;

  const isDark = document.documentElement.classList.contains("dark");
  const vars = isDark ? color.dark : color.light;
  const root = document.documentElement;

  root.style.setProperty("--primary", vars.primary);
  root.style.setProperty("--primary-foreground", vars["primary-foreground"]);
  root.style.setProperty("--accent", vars.accent);
  root.style.setProperty("--ring", vars.ring);
  root.style.setProperty("--sidebar-primary", vars["sidebar-primary"]);
}

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyStoredAccentColor();

    const observer = new MutationObserver(() => {
      applyStoredAccentColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
