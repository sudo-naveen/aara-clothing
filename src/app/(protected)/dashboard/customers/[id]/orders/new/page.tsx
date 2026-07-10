import { OrderForm } from "@/features/orders/order-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewOrderPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">New Order</h2>
        <p className="text-sm text-muted-foreground">Create a new order for this customer</p>
      </div>
      <OrderForm customerId={id} mode="create" />
    </div>
  );
}
