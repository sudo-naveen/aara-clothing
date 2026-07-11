import { Card } from "@/components/ui/card";
import { NotificationBell } from "@/components/notification-bell";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    year: "numeric",
  });
}

export function Header({ username }: { username: string }) {
  return (
    <Card className="relative mb-6 overflow-hidden border-0 bg-gradient-to-br from-[var(--aara-secondary)] to-[var(--aara-accent)] p-6 text-white shadow-lg shadow-aara-secondary/20">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {username}
          </h1>
          <p className="mt-1.5 text-sm text-white/70">
            {getFormattedDate()}
          </p>
        </div>
        <NotificationBell />
      </div>
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-6 size-24 rounded-full bg-white/5" />
      <div className="absolute -left-4 -bottom-4 size-16 rounded-full bg-white/5" />
      {/* Subtle mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
    </Card>
  );
}
