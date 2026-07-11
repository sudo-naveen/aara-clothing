import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
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
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50">
      {(title || actions) && (
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/10">
          {title && <CardTitle>{title}</CardTitle>}
          {actions}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b border-border/50 bg-muted/20 backdrop-blur-sm">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className ?? ""}`}
                  >
                    {col.header}
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
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50">
                        <Inbox className="size-6 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {emptyMessage}
                      </p>
                      {emptyDescription && (
                        <p className="mt-1 text-xs text-muted-foreground">
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
                    className={`border-b border-border/30 last:border-0 table-row-hover ${
                      index % 2 === 1 ? "bg-muted/5" : ""
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 ${col.className ?? ""}`}
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
