import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerById } from "@/features/customers/customers-service";
import { getCustomerOrderStats, listOrders } from "@/features/orders/orders-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Package, ShoppingBag, Calendar } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({ params }: Props) {
  const { id } = await params;

  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const stats = await getCustomerOrderStats(id);
  const ordersResult = await listOrders({
    page: 1,
    limit: 100,
    customerId: id,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">Customer Profile</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="size-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/customers/${id}/orders/new`}>
            <Button size="sm">
              <Plus className="size-4" />
              Create New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Section 1 — Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone</span>
              <p className="font-medium">{customer.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-sm text-muted-foreground">Address</span>
              <p className="font-medium">{customer.address ?? "-"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <p className="font-medium">{new Date(customer.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Customer Statistics */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Items Purchased
              </CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItemsPurchased}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Order
              </CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.mostRecentOrderDate
                  ? new Date(stats.mostRecentOrderDate).toLocaleDateString()
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section 3 — Order History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order History</CardTitle>
          <Link href={`/dashboard/customers/${id}/orders/new`}>
            <Button size="sm">
              <Plus className="size-4" />
              New Order
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Order #</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersResult.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  ordersResult.data.map((order) => {
                    const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
                      PENDING: "warning",
                      PROCESSING: "default",
                      DELIVERED: "success",
                      CANCELLED: "destructive",
                    };
                    return (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs">#{order.orderNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant[order.status] ?? "secondary"}>
                            {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{order.items.length}</td>
                        <td className="px-4 py-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/customers/${id}/orders/${order.id}`}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              View
                            </Link>
                            {order.status === "PENDING" && (
                              <Link
                                href={`/dashboard/customers/${id}/orders/${order.id}/edit`}
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                Edit
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
