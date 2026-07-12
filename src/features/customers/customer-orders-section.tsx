"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_FLOW, type OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  variant: {
    product: { id: string; name: string };
    color: string;
    size: string;
    sku: string;
  };
  quantity: number;
}

interface OrderRow {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

interface Props {
  customerId: string;
  orders: OrderRow[];
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
  NOT_STARTED: "secondary",
  PROCESSING: "default",
  DONE: "success",
};

function StatusSelector({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const allowedTransitions = ORDER_STATUS_FLOW[currentStatus as OrderStatus] ?? [];

  const handleChange = useCallback(async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      toast.success(`Status updated to ${ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS]}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  if (allowedTransitions.length === 0) {
    return (
      <Badge variant={statusVariant[currentStatus] ?? "secondary"}>
        {ORDER_STATUS_LABELS[currentStatus as keyof typeof ORDER_STATUS_LABELS] ?? currentStatus}
      </Badge>
    );
  }

  return (
    <Select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      items={[
        { value: currentStatus, label: ORDER_STATUS_LABELS[currentStatus as keyof typeof ORDER_STATUS_LABELS] ?? currentStatus },
        ...allowedTransitions.map((s) => ({
          value: s,
          label: ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS] ?? s,
        })),
      ]}
    />
  );
}

export function CustomerOrdersSection({ customerId, orders }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  function toggleExpand(orderId: string) {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Order History</CardTitle>
          <Link href={`/dashboard/customers/${customerId}/orders/new`}>
            <Button size="sm">
              <Plus className="size-4" />
              New Order
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Order History</CardTitle>
        <Link href={`/dashboard/customers/${customerId}/orders/new`}>
          <Button size="sm">
            <Plus className="size-4" />
            New Order
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20 backdrop-blur-sm">
                <th className="w-10 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <tr key={order.id} className={cn("border-b border-border/30 last:border-0 table-row-hover", index % 2 === 1 && "bg-muted/5")}>
                    <td colSpan={6} className="p-0">
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleExpand(order.id)}
                          className="flex w-full items-center px-2 py-3 text-left"
                        >
                          <div className="flex w-6 shrink-0 items-center justify-center">
                            {isExpanded ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="w-[100px] px-2 font-mono text-xs">#{order.orderNumber}</span>
                          <div className="w-[160px] px-2">
                            <StatusSelector orderId={order.id} currentStatus={order.status} />
                          </div>
                          <span className="w-[60px] px-2 text-center text-muted-foreground">{order.items.length}</span>
                          <span className="w-[120px] px-2 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex flex-1 items-center justify-end gap-2 px-2">
                            <Link
                              href={`/dashboard/customers/${customerId}/orders/${order.id}`}
                              className="text-sm font-medium text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                            </Link>
                            {(order.status as string) === "NOT_STARTED" && (
                              <Link
                                href={`/dashboard/customers/${customerId}/orders/${order.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button variant="ghost" size="icon-sm">
                                  <Pencil className="size-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </button>

                        {isExpanded && order.items.length > 0 && (
                          <div className="border-t border-border/20 bg-muted/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border/10">
                                  <th className="w-10 px-2" />
                                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Variant</th>
                                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                                  <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                                  <th className="w-[100px] px-2" />
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.id} className="border-b border-border/10 last:border-0">
                                    <td className="w-10 px-2" />
                                    <td className="px-4 py-2 font-medium text-foreground/80">
                                      {item.variant.product.name}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                      {item.variant.color} / {item.variant.size}
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className="font-mono text-xs text-muted-foreground">{item.variant.sku}</span>
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium">{item.quantity}</td>
                                    <td className="w-[100px] px-2" />
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
