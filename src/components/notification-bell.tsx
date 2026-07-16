"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [];

function getUnreadCount() {
  return notifications.filter((n) => !n.read).length;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = getUnreadCount();

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
            <div className="border-b border-border/50 px-4 py-3">
              <h3 className="text-sm font-semibold text-card-foreground">
                Notifications
              </h3>
            </div>

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
                    className={cn(
                      "border-b border-border/30 px-4 py-3.5 transition-colors duration-150 last:border-b-0 hover:bg-accent/10",
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
                          {notification.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/60">
                          {notification.timestamp}
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
