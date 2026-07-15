import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customers-service";
import { getCustomerOrderStats, listOrders } from "@/features/orders/orders-service";
import { CustomerProfileClient } from "@/features/customers/customer-profile-client";

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
      <CustomerProfileClient
        customer={{
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        }}
        stats={stats}
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
