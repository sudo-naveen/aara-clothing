"use client";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, ORDER_STATUS_VARIANT } from "@/lib/constants";
import type { Column } from "@/components/data-table";
import { formatDate } from "@/utils/format";

interface OrderRow {
  id: string;
  orderNumber: number;
  status: string;
  itemCount: number;
  createdAt: Date;
}

interface Props {
  data: OrderRow[];
  customerId: string;
}

export function OrderTable({ data, customerId }: Props) {
  const columns: Column<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      cell: (item) => (
        <span className="font-mono text-xs">#{item.orderNumber}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <Badge variant={ORDER_STATUS_VARIANT[item.status as keyof typeof ORDER_STATUS_VARIANT] ?? "secondary"}>
          {ORDER_STATUS_LABELS[item.status as keyof typeof ORDER_STATUS_LABELS] ?? item.status}
        </Badge>
      ),
    },
    {
      key: "itemCount",
      header: "Items",
      className: "text-center",
    },
    {
      key: "createdAt",
      header: "Date",
      cell: (item) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${customerId}/orders/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Eye className="size-4" />
            </Button>
          </Link>
          {(item.status as string) === ORDER_STATUSES.NOT_STARTED && (
            <Link href={`/dashboard/customers/${customerId}/orders/${item.id}/edit`}>
              <Button variant="ghost" size="icon-sm">
                <Pencil className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
      emptyMessage="No orders found"
    />
  );
}
