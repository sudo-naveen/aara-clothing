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
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Header({ username }: { username: string }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[var(--aara-secondary)] to-[var(--aara-accent)] p-8 shadow-lg shadow-aara-secondary/10">
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {getGreeting()}, <span className="font-bold">{username}</span>
          </h1>
          <p className="text-sm text-white/60">
            {getFormattedDate()}
          </p>
        </div>
        <NotificationBell />
      </div>

      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/[0.04]" />
      <div className="absolute -left-8 -top-8 size-24 rounded-full bg-white/[0.03]" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
