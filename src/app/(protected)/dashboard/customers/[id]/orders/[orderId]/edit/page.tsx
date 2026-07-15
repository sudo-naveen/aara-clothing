import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/orders-service";
import { getCustomerById } from "@/features/customers/customers-service";
import { OrderForm } from "@/features/orders/order-form";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string; orderId: string }>;
}

export default async function EditOrderPage({ params }: Props) {
  const { id: customerId, orderId } = await params;

  const customer = await getCustomerById(customerId);
  if (!customer) notFound();

  const order = await getOrderById(orderId);
  if (!order || order.customerId !== customerId) notFound();

  if ((order.status as string) !== "NOT_STARTED") {
    return (
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Cannot Edit Order</h2>
        <p className="text-muted-foreground">
          Only orders with &apos;Not Started&apos; status can be edited. This order is currently {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status.toLowerCase()}.
        </p>
      </div>
    );
  }

  const items = order.items.map((item) => ({
    variantId: item.variantId,
    productName: item.variant.product.name,
    variantLabel: `${item.variant.color} / ${item.variant.size}`,
    quantity: item.quantity,
    stock: item.variant.stock + item.quantity,
  }));

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Edit Order</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">Update order details</p>
      </div>
      <OrderForm
        customerId={customerId}
        orderId={orderId}
        initialItems={items}
        initialStatus={order.status}
        mode="edit"
      />
    </div>
  );
}
