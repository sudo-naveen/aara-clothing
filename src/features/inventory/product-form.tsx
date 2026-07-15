"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProductSchema, updateProductSchema, type CreateProductInput, type UpdateProductInput } from "./inventory-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantForm } from "@/features/variants/variant-form";
import { ImageUpload } from "@/features/images/image-upload";
import { ArrowLeft, Save } from "lucide-react";
import type { Product, ProductVariant } from "@/types";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const schema = isEdit ? updateProductSchema : createProductSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  async function onSubmit(data: CreateProductInput | UpdateProductInput) {
    try {
      const url = isEdit ? `/api/inventory/${initialData!.id}` : "/api/inventory";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save product");
      }

      router.push("/dashboard/inventory");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const variants = initialData?.variants ?? [];

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-8">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {isEdit ? "Edit Product" : "Create Product"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Enter product name" />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} placeholder="Enter product description" />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                defaultChecked={initialData?.isActive ?? true}
                onChange={(e) => setValue("isActive", e.target.checked)}
                className="size-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="size-4" />
                    {isEdit ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEdit && initialData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VariantForm
                productId={initialData.id}
                onVariantCreated={() => router.refresh()}
              />

              {variants.length > 0 && (
                <div className="space-y-4">
                  {variants.map((variant: ProductVariant) => (
                    <div
                      key={variant.id}
                      className="rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="mb-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div>
                          <span className="text-muted-foreground">Color:</span>{" "}
                          <span className="font-medium">{variant.color}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>{" "}
                          <span className="font-medium">{variant.size}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stock:</span>{" "}
                          <span className="font-medium">{variant.stock}</span>
                        </div>
                      </div>

                      <ImageUpload
                        variantId={variant.id}
                        images={variant.images ?? []}
                        onImageChange={() => router.refresh()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
