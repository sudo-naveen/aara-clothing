"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ACCENT_COLORS,
  ACCENT_COLOR_STORAGE_KEY,
  DEFAULT_ACCENT_COLOR_ID,
  type AccentColor,
} from "@/lib/accent-colors";

function getStoredColorId(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT_COLOR_ID;
  const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  if (stored && ACCENT_COLORS.some((c) => c.id === stored)) return stored;
  return DEFAULT_ACCENT_COLOR_ID;
}

function applyAccentColor(color: AccentColor, isDark: boolean) {
  const root = document.documentElement;
  const vars = isDark ? color.dark : color.light;

  root.style.setProperty("--primary", vars.primary);
  root.style.setProperty("--primary-foreground", vars["primary-foreground"]);
  root.style.setProperty("--accent", vars.accent);
  root.style.setProperty("--ring", vars.ring);
  root.style.setProperty("--sidebar-primary", vars["sidebar-primary"]);
}

function getColorFromStorage(): AccentColor {
  const id = getStoredColorId();
  return ACCENT_COLORS.find((c) => c.id === id) ?? ACCENT_COLORS[0];
}

export function useAccentColor() {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() =>
    getColorFromStorage()
  );

  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color.id);

    const isDark = document.documentElement.classList.contains("dark");
    applyAccentColor(color, isDark);
  }, []);

  useEffect(() => {
    const color = getColorFromStorage();

    const isDark = document.documentElement.classList.contains("dark");
    applyAccentColor(color, isDark);

    const observer = new MutationObserver(() => {
      const current = getColorFromStorage();
      const dark = document.documentElement.classList.contains("dark");
      applyAccentColor(current, dark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { accentColor, setAccentColor };
}
