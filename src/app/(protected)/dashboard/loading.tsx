import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -top-32 -right-32 -z-10 size-64 rounded-full bg-aara-highlight/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 -z-10 size-48 rounded-full bg-aara-accent/8 blur-3xl" />

      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-3 w-3 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>

      {/* Header skeleton */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[var(--aara-secondary)] to-[var(--aara-accent)] p-4 sm:mb-8 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72 rounded-lg bg-white/20 sm:h-9" />
          <Skeleton className="h-4 w-48 rounded-md bg-white/20" />
        </div>
      </div>

      {/* Section heading skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-5 w-1 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/40 bg-card p-4 shadow-soft sm:p-5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-8 w-14 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
