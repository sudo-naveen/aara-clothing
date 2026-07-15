import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerById } from "@/features/customers/customers-service";
import { getCustomerOrderStats, listOrders } from "@/features/orders/orders-service";
import { CustomerOrdersSection } from "@/features/customers/customer-orders-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus, Package, ShoppingBag, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({ params }: Props) {
  const { id } = await params;

  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const [stats, ordersResult] = await Promise.all([
    getCustomerOrderStats(id),
    listOrders({
      page: 1,
      limit: 100,
      customerId: id,
    }),
  ]);

  return (
    <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-aara-primary/10">
            <ShoppingBag className="size-5 text-aara-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{customer.name}</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Customer Profile</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/customers/${id}/edit`} className="flex-1 sm:flex-none">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Pencil className="size-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/customers/${id}/orders/new`} className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="size-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

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

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-primary/10 transition-transform duration-200 group-hover:scale-110">
                <ShoppingBag className="size-4 text-aara-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Items Purchased
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-secondary/10 transition-transform duration-200 group-hover:scale-110">
                <Package className="size-4 text-aara-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItemsPurchased}</div>
            </CardContent>
          </Card>
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Order
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-accent/10 transition-transform duration-200 group-hover:scale-110">
                <Calendar className="size-4 text-aara-accent" />
              </div>
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

      <CustomerOrdersSection
        customerId={id}
        orders={ordersResult.data.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items.map((item) => ({
            id: item.id,
            variant: {
              product: {
                id: item.variant.product.id,
                name: item.variant.product.name,
              },
              color: item.variant.color,
              size: item.variant.size,
            },
            quantity: item.quantity,
          })),
        }))}
      />
    </div>
  );
}
