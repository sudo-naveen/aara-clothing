import { CustomerForm } from "@/features/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">New Customer</h2>
        <p className="text-sm text-muted-foreground">Add a new customer to the database</p>
      </div>
      <CustomerForm mode="create" />
    </div>
  );
}
