"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createVariantSchema, type CreateVariantInput } from "./variants-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface VariantFormProps {
  productId: string;
  onVariantCreated?: () => void;
}

export function VariantForm({ productId, onVariantCreated }: VariantFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVariantInput>({
    resolver: zodResolver(createVariantSchema),
    defaultValues: {
      productId,
      color: "",
      size: "",
      stock: 0,
    },
  });

  async function onSubmit(data: CreateVariantInput) {
    try {
      const response = await fetch(`/api/inventory/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to create variant");
      }

      reset({ productId, color: "", size: "", stock: 0 });
      onVariantCreated?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" placeholder="e.g. Black" {...register("color")} />
          {errors.color && (
            <p className="text-sm text-destructive">{errors.color.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input id="size" placeholder="e.g. M" {...register("size")} />
          {errors.size && (
            <p className="text-sm text-destructive">{errors.size.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" min="0" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        <Plus className="size-4" />
        Add Variant
      </Button>
    </form>
  );
}
