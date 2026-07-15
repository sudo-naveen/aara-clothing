"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateStockSchema, type UpdateStockInput } from "./inventory-validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface Variant {
  id: string;
  product: { id: string; name: string };
  color: string;
  size: string;
  stock: number;
}

interface Props {
  variant: Variant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function StockUpdateDialog({
  variant,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [mode, setMode] = useState<"set" | "adjust">("set");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStockInput>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      stock: variant.stock,
    },
  });

  const currentStock = watch("stock");

  async function onSubmit(data: UpdateStockInput) {
    try {
      let body: Record<string, unknown>;

      if (mode === "adjust") {
        const amount = data.stock - variant.stock;
        body = { type: "adjust", amount };
      } else {
        body = { stock: data.stock };
      }

      const response = await fetch(`/api/inventory/stock/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      reset();
      onUpdated();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg bg-muted/30 border border-border p-4 text-sm">
            <div className="font-medium text-foreground">{variant.product.name}</div>
            <div className="text-muted-foreground">
              {variant.color} / {variant.size}
            </div>
            <div className="mt-2 text-muted-foreground">
              Current stock: <span className="font-semibold text-foreground">{variant.stock}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === "set" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("set");
                reset({ stock: variant.stock });
              }}
            >
              Set Stock
            </Button>
            <Button
              type="button"
              variant={mode === "adjust" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("adjust");
                reset({ stock: variant.stock });
              }}
            >
              Adjust Stock
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">
                {mode === "set" ? "New Stock Level" : "Adjustment Amount"}
              </Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">
                  {errors.stock.message}
                </p>
              )}
              {mode === "adjust" && (
                <p className="text-xs text-muted-foreground">
                  Resulting stock: <span className="font-medium">{currentStock}</span>
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="size-4" />
                    Update Stock
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
