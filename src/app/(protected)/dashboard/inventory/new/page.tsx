import { ProductForm } from "@/features/inventory/product-form";

export default async function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">New Product</h2>
        <p className="text-sm text-muted-foreground">Add a new product to your inventory</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
