import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
}

export function DataTable<T>({
  title,
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage = "No data found",
  emptyDescription,
  actions,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 shadow-soft">
      {(title || actions) && (
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/10">
          {title && <CardTitle>{title}</CardTitle>}
          {actions}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto -mx-px">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b border-border/40 bg-muted/20 backdrop-blur-sm">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-4",
                      col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors duration-150",
                      col.className
                    )}
                    onClick={() => col.sortable && onSort?.(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortColumn === col.key && (
                        <span className="text-primary">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="size-2 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "0ms" }} />
                        <span className="size-2 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "150ms" }} />
                        <span className="size-2 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50">
                        <SearchX className="size-7 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {emptyMessage}
                      </p>
                      {emptyDescription && (
                        <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">
                          {emptyDescription}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={keyExtractor(item)}
                    className={cn(
                      "border-b border-border/20 last:border-0 transition-all duration-150",
                      index % 2 === 1 ? "bg-muted/3" : "",
                      "hover:bg-muted/10 hover:shadow-sm"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "whitespace-nowrap px-3 py-3.5 sm:whitespace-normal sm:px-4",
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell(item)
                          : (item as unknown as Record<string, unknown>)[col.key] as React.ReactNode ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
