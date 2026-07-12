import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/features/orders/orders-service";
import { getCustomerById } from "@/features/customers/customers-service";
import { UpdateOrderStatus } from "@/features/orders/update-order-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, ArrowLeft } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_FLOW } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string; orderId: string }>;
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
  NOT_STARTED: "secondary",
  PROCESSING: "default",
  DONE: "success",
};

export default async function OrderDetailPage({ params }: Props) {
  const { id: customerId, orderId } = await params;

  const customer = await getCustomerById(customerId);
  if (!customer) notFound();

  const order = await getOrderById(orderId);
  if (!order || order.customerId !== customerId) notFound();

  const allowedTransitions = ORDER_STATUS_FLOW[order.status as keyof typeof ORDER_STATUS_FLOW] ?? [];

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-8 pt-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/customers/${customerId}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border transition-colors duration-200 hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              {customer.name} — {customer.phone}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-sm px-3 py-1">
            {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
          </Badge>
          {(order.status as string) === "NOT_STARTED" && (
            <Link href={`/dashboard/customers/${customerId}/orders/${orderId}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="size-4" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Order Items */}
      <Card className="mx-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="sticky top-0 border-b border-border/50 bg-muted/20 backdrop-blur-sm">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id} className={`border-b border-border/30 last:border-0 table-row-hover ${index % 2 === 1 ? "bg-muted/5" : ""}`}>
                    <td className="px-4 py-3 font-medium">
                      {item.variant.product.name}
                    </td>
                    <td className="px-4 py-3">
                      {item.variant.color} / {item.variant.size}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{item.variant.sku}</span>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Info */}
      <div className="grid gap-4 px-8 pb-8 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created by</span>
              <span>{order.user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        {allowedTransitions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map((status) => (
                  <UpdateOrderStatus
                    key={status}
                    orderId={orderId}
                    currentStatus={order.status}
                    newStatus={status}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
