"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Sun, Moon, Check } from "lucide-react";

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
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
