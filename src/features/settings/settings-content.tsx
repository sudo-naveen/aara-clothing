"use client";

import { useRef } from "react";
import { Settings } from "lucide-react";
import { ProfileSection } from "@/features/settings/profile-section";
import { AppearanceSection } from "@/features/settings/appearance-section";
import { InventorySection } from "@/features/settings/inventory-section";
import { AboutSection } from "@/features/settings/about-section";
import { SecuritySection } from "@/features/settings/security-section";

interface SettingsContentProps {
  name: string | null;
  username: string;
}

export function SettingsContent({ name, username }: SettingsContentProps) {
  const profileSectionRef = useRef<HTMLDivElement>(null);

  function scrollToPassword() {
    profileSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative space-y-6 p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
          <Settings className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div ref={profileSectionRef} className="space-y-6">
          <ProfileSection name={name} username={username} />
        </div>

        <div className="space-y-6">
          <AppearanceSection />
          <InventorySection />
          <AboutSection />
          <SecuritySection onChangePasswordClick={scrollToPassword} />
        </div>
      </div>
    </div>
  );
}
