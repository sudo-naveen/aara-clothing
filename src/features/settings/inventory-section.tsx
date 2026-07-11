"use client";

import { useSyncExternalStore } from "react";
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

const STORAGE_KEY = "aara-low-stock-threshold";
const DEFAULT_THRESHOLD = 10;

const emptySubscribe = () => () => {};
const getServerSnapshot = () => DEFAULT_THRESHOLD;
const getClientSnapshot = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return DEFAULT_THRESHOLD;
  const value = parseInt(stored, 10);
  return isNaN(value) ? DEFAULT_THRESHOLD : value;
};

export function InventorySection() {
  const storedThreshold = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LowStockThresholdInput>({
    resolver: zodResolver(lowStockThresholdSchema),
    defaultValues: { threshold: storedThreshold },
  });

  async function onSubmit(data: LowStockThresholdInput) {
    try {
      localStorage.setItem(STORAGE_KEY, data.threshold.toString());
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">Low Stock Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                id="threshold"
                type="number"
                {...register("threshold", { valueAsNumber: true })}
                className="w-32"
                min={1}
                max={9999}
              />
              <span className="text-sm text-muted-foreground">units</span>
            </div>
            {errors.threshold && (
              <p className="text-sm text-destructive">{errors.threshold.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Products with stock at or below this value will be flagged as low stock
            </p>
          </div>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
