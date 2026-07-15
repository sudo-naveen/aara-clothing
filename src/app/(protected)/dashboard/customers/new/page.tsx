import { NewCustomerContent } from "@/features/customers/new-customer-content";

export default function NewCustomerPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          New Customer
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Add a new customer to the database</p>
      </div>
      <NewCustomerContent />
    </div>
  );
}
