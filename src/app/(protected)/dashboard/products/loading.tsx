export default function ProductsLoading() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted/40">
          <div className="size-5 animate-pulse rounded-lg bg-muted/60" />
        </div>
        <div>
          <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/60" />
          <div className="mt-1.5 h-4 w-48 animate-pulse rounded-lg bg-muted/40" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card">
        <div className="border-b border-border/30 p-4">
          <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
        </div>
        <div className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex h-14 items-center border-b border-border/20 px-4 ${i % 2 === 1 ? "bg-muted/5" : ""}`}
            >
              <div className="h-4 w-32 animate-pulse rounded-lg bg-muted/50" />
              <div className="ml-auto h-4 w-16 animate-pulse rounded-lg bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
