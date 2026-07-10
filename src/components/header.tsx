import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Search, Bell, User } from "lucide-react";

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

export async function Header() {
  const session = await auth();
  const username = session?.user?.username ?? "User";

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      {/* Greeting Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[var(--aara-secondary)] to-[var(--aara-accent)] p-6 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {username}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {getFormattedDate()}
          </p>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-4 size-24 rounded-full bg-white/5" />
      </Card>

      {/* Actions Card */}
      <Card className="flex items-center justify-around border-border p-6 shadow-sm">
        <button className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors duration-200 hover:bg-muted">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Search className="size-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Search</span>
        </button>
        <button className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors duration-200 hover:bg-muted">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Bell className="size-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Alerts</span>
        </button>
        <button className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors duration-200 hover:bg-muted">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Profile</span>
        </button>
      </Card>
    </div>
  );
}
