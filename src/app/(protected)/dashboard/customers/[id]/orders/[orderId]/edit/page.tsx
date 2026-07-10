import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/orders-service";
import { getCustomerById } from "@/features/customers/customers-service";
import { OrderForm } from "@/features/orders/order-form";

interface Props {
  params: Promise<{ id: string; orderId: string }>;
}

export default async function EditOrderPage({ params }: Props) {
  const { id: customerId, orderId } = await params;

  const customer = await getCustomerById(customerId);
  if (!customer) notFound();

  const order = await getOrderById(orderId);
  if (!order || order.customerId !== customerId) notFound();

  if (order.status !== "PENDING") {
    return (
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Cannot Edit Order</h2>
        <p className="text-muted-foreground">
          Only pending orders can be edited. This order is currently {order.status.toLowerCase()}.
        </p>
      </div>
    );
  }

  const items = order.items.map((item) => ({
    variantId: item.variantId,
    productName: item.variant.product.name,
    variantLabel: `${item.variant.color} / ${item.variant.size} (${item.variant.sku})`,
    quantity: item.quantity,
    stock: item.variant.stock + item.quantity,
  }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Edit Order</h2>
        <p className="text-sm text-muted-foreground">Update order details</p>
      </div>
      <OrderForm
        customerId={customerId}
        orderId={orderId}
        initialItems={items}
        mode="edit"
      />
    </div>
  );
}
