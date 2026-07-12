"use client";

import { ACCENT_COLORS, type AccentColor } from "@/lib/accent-colors";
import { useAccentColor } from "@/hooks/use-accent-color";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccentColorPicker() {
  const { accentColor, setAccentColor } = useAccentColor();

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
      {ACCENT_COLORS.map((color: AccentColor) => {
        const isActive = accentColor.id === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => setAccentColor(color)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-200",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "bg-muted/80"
                : "hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "relative size-10 rounded-full transition-all duration-200",
                "ring-2 ring-offset-2 ring-offset-background",
                isActive
                  ? "ring-foreground scale-110"
                  : "ring-border group-hover:ring-muted-foreground/50 group-hover:scale-105"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className="size-5 text-white drop-shadow-md"
                    strokeWidth={3}
                  />
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors duration-200",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {color.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
