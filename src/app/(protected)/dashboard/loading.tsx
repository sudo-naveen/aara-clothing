export default function DashboardLoading() {
  return (
    <div className="relative p-8">
      <div className="pointer-events-none absolute -top-32 -right-32 -z-10 size-64 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 -z-10 size-48 rounded-full bg-aara-accent/8 blur-3xl" />

      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted/60" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-muted/40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between pb-3">
              <div className="h-4 w-24 animate-pulse rounded-lg bg-muted/60" />
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted/40">
                <div className="size-4 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
            <div className="h-8 w-16 animate-pulse rounded-lg bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
