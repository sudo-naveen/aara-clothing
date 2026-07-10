import { notFound } from "next/navigation";
import { getProductById } from "@/features/inventory/inventory-service";
import { ProductForm } from "@/features/inventory/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Edit Product</h2>
        <p className="text-sm text-muted-foreground">Update product information</p>
      </div>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
