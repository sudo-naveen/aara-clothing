"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "./customers-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import type { Customer } from "@/types";

interface CustomerFormProps {
  mode: "create" | "edit";
  initialData?: Customer;
  onSuccess?: (customer?: Customer) => void;
  onCancel?: () => void;
}

export function CustomerForm({ mode, initialData, onSuccess, onCancel }: CustomerFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const isEmbedded = !!onSuccess;

  const schema = isEdit ? updateCustomerSchema : createCustomerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput | UpdateCustomerInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      address: initialData?.address ?? "",
    },
  });

  async function onSubmit(data: CreateCustomerInput | UpdateCustomerInput) {
    try {
      const url = isEdit
        ? `/api/customers/${initialData!.id}`
        : "/api/customers";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save customer");
      }

      toast.success(
        isEdit ? "Customer updated successfully" : "Customer created successfully"
      );
      if (onSuccess) {
        onSuccess(result.data as Customer);
      } else {
        router.push("/dashboard/customers");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="Enter customer name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} placeholder="Enter address (optional)" />
        {errors.address && (
          <p className="text-sm text-destructive">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
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
  );

  if (isEmbedded) {
    return formContent;
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCancel}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <CardTitle>{isEdit ? "Edit Customer" : "Create Customer"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
