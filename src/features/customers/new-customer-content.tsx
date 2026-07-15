"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "./customer-form";
import { OrderForm } from "@/features/orders/order-form";
import type { Customer } from "@/types";
import { ArrowLeft } from "lucide-react";

export function NewCustomerContent() {
  const router = useRouter();
  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

  const handleCustomerSuccess = useCallback((customer?: Customer) => {
    if (customer) {
      setCreatedCustomer(customer);
    } else {
      router.push("/dashboard/customers");
    }
  }, [router]);

  const handleOrderSuccess = useCallback(() => {
    if (createdCustomer) {
      router.push(`/dashboard/customers/${createdCustomer.id}`);
    }
  }, [createdCustomer, router]);

  const handleSkip = useCallback(() => {
    if (createdCustomer) {
      router.push(`/dashboard/customers/${createdCustomer.id}`);
    } else {
      router.push("/dashboard/customers");
    }
  }, [createdCustomer, router]);

  if (createdCustomer) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
          >
            <ArrowLeft className="size-4" />
            Skip for now
          </Button>
        </div>
        <OrderForm
          customerId={createdCustomer.id}
          mode="create"
          onSuccess={handleOrderSuccess}
          onCancel={handleSkip}
        />
      </div>
    );
  }

  return (
    <CustomerForm mode="create" onSuccess={handleCustomerSuccess} />
  );
}
