"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Check, X, Loader2 } from "lucide-react";
import { usePushNotifications } from "@/features/notifications/use-push-notifications";
import { useState } from "react";

export function NotificationsSection() {
  const { permission, subscription, isSupported, requestPermission, unsubscribe } =
    usePushNotifications();
  const [loading, setLoading] = useState(false);

  const isSubscribed = !!subscription;
  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  async function handleToggle() {
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await requestPermission();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-highlight/10">
            <Bell className="size-5 text-aara-highlight" />
          </div>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage push notification preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSupported ? (
          <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/30 p-4">
            <BellOff className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Push notifications not supported
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your browser does not support push notifications. Try Chrome,
                Firefox, or Safari 16.4+.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Permission status */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Push Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive alerts when order statuses change
                </p>
              </div>
              <Button
                variant={isSubscribed ? "destructive" : "default"}
                size="sm"
                onClick={handleToggle}
                disabled={loading || isDenied}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isSubscribed ? (
                  "Disable"
                ) : (
                  "Enable"
                )}
              </Button>
            </div>

            {/* Status details */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Permission status */}
              <div className="flex items-center gap-3 rounded-xl border border-border/40 p-3.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
                  <Bell className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Permission</p>
                  <div className="mt-0.5">
                    {isGranted ? (
                      <Badge variant="success" className="text-[10px]">
                        <Check className="mr-1 size-3" />
                        Granted
                      </Badge>
                    ) : isDenied ? (
                      <Badge variant="destructive" className="text-[10px]">
                        <X className="mr-1 size-3" />
                        Denied
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Not asked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscription status */}
              <div className="flex items-center gap-3 rounded-xl border border-border/40 p-3.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
                  {isSubscribed ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Subscription</p>
                  <div className="mt-0.5">
                    {isSubscribed ? (
                      <Badge variant="success" className="text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isDenied && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <X className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Notifications blocked
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You&apos;ve denied notification permissions. To re-enable,
                    click the lock icon in your browser&apos;s address bar and
                    allow notifications, then reload the page.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}