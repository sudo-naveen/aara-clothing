"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Monitor, Sun, Moon, Check, Palette } from "lucide-react";
import { AccentColorPicker } from "./accent-color-picker";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-secondary/10">
            <Monitor className="size-5 text-aara-secondary" />
          </div>
          <div>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Theme</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = mounted && theme === t.value;
              return (
                <Button
                  key={t.value}
                  variant={isActive ? "default" : "outline"}
                  className="relative flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setTheme(t.value)}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check className="size-3" />
                    </div>
                  )}
                  <Icon className="size-5" />
                  <span className="text-sm">{t.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Accent Color</Label>
          </div>
          <AccentColorPicker />
        </div>
      </CardContent>
    </Card>
  );
}
