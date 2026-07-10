import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customers-service";
import { CustomerForm } from "@/features/customers/customer-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Edit Customer</h2>
        <p className="text-sm text-muted-foreground">Update customer information</p>
      </div>
      <CustomerForm
        mode="edit"
        initialData={{
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        }}
      />
    </div>
  );
}
