"use client";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { Column } from "@/components/data-table";

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

const statusVariantMap: Record<string, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
  PENDING: "warning",
  PROCESSING: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

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
        <Badge variant={statusVariantMap[item.status] ?? "secondary"}>
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
      cell: (item) => new Date(item.createdAt).toLocaleDateString(),
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
          {(item.status as string) === "PENDING" && (
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
