"use client";

import { Settings, User, Monitor, Boxes, Bell, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountSection } from "@/features/settings/account-section";
import { AppearanceSection } from "@/features/settings/appearance-section";
import { InventorySection } from "@/features/settings/inventory-section";
import { NotificationsSection } from "@/features/settings/notifications-section";
import { AboutSection } from "@/features/settings/about-section";

interface SettingsContentProps {
  name: string | null;
  username: string;
}

const TAB_STORAGE_KEY = "aara-settings-tab";

export function SettingsContent({ name, username }: SettingsContentProps) {
  return (
    <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
          <Settings className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Settings
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" storageKey={TAB_STORAGE_KEY}>
        <TabsList>
          <TabsTrigger value="account" icon={<User />}>
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" icon={<Monitor />}>
            Appearance
          </TabsTrigger>
          <TabsTrigger value="inventory" icon={<Boxes />}>
            Inventory
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={<Bell />}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="about" icon={<Info />}>
            About
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="account">
            <AccountSection name={name} username={username} />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSection />
          </TabsContent>

          <TabsContent value="inventory">
            <InventorySection />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsSection />
          </TabsContent>

          <TabsContent value="about">
            <AboutSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
