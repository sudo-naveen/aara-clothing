"use client";

import { useState, useCallback } from "react";
import { Popover } from "@base-ui/react/popover";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePushNotifications } from "@/features/notifications/use-push-notifications";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

async function fetchNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
  const response = await fetch("/api/notifications");
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export function NotificationBell() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { permission, isSupported, requestPermission } = usePushNotifications();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!session?.user,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId?: string) => {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationId ? { notificationId } : { markAll: true }),
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleEnableNotifications = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className="relative flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end">
          <Popover.Popup
            className={cn(
              "z-50 w-80 rounded-xl border border-border/60 bg-card p-0 shadow-elevated outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            )}
          >
            <div className="border-b border-border/50 px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markReadMutation.mutate()}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {isSupported && permission !== "granted" && (
              <div className="border-b border-border/50 px-4 py-3">
                <button
                  onClick={handleEnableNotifications}
                  className="w-full rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Enable Push Notifications
                </button>
              </div>
            )}

            <div className="max-h-80 space-y-px overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                    <Bell className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-card-foreground">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You&apos;re all caught up.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markReadMutation.mutate(notification.id)}
                    className={cn(
                      "cursor-pointer border-b border-border/30 px-4 py-3.5 transition-colors duration-150 last:border-b-0 hover:bg-accent/10",
                      !notification.read && "bg-accent/10"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary ring-2 ring-primary/20" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm",
                            notification.read
                              ? "text-card-foreground/80"
                              : "font-medium text-card-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground/80 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/60">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}