"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  lowStockThresholdSchema,
  type LowStockThresholdInput,
} from "./settings-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Boxes, Save, Loader2 } from "lucide-react";

export function InventorySection() {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LowStockThresholdInput>({
    resolver: zodResolver(lowStockThresholdSchema),
    defaultValues: { threshold: 10 },
  });

  useEffect(() => {
    async function fetchThreshold() {
      try {
        const res = await fetch("/api/settings/inventory");
        const result = await res.json();
        if (result.success) {
          setThreshold(result.data.lowStockThreshold);
          reset({ threshold: result.data.lowStockThreshold });
        }
      } catch {
        // keep default
      } finally {
        setLoading(false);
      }
    }
    fetchThreshold();
  }, [reset]);

  async function onSubmit(data: LowStockThresholdInput) {
    try {
      const res = await fetch("/api/settings/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      reset({ threshold: data.threshold });
      toast.success("Low stock threshold updated");
    } catch {
      toast.error("Failed to save setting");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-accent/10">
            <Boxes className="size-5 text-aara-accent" />
          </div>
          <div>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Configure inventory settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="threshold"
                  type="number"
                  {...register("threshold", { valueAsNumber: true })}
                  className="w-full sm:w-32"
                  min={1}
                  max={9999}
                />
                <span className="shrink-0 text-sm text-muted-foreground">units</span>
              </div>
              {errors.threshold && (
                <p className="text-sm text-destructive">{errors.threshold.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Products with stock at or below this value will be flagged as low stock
              </p>
            </div>
            <Button type="submit" size="sm" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
