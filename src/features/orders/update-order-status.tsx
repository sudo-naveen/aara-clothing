"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUS_FLOW, type OrderStatus } from "@/lib/constants";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

interface Props {
  orderId: string;
  currentStatus: string;
  newStatus: string;
}

export function UpdateOrderStatus({ orderId, currentStatus, newStatus }: Props) {
  const router = useRouter();
  const { requestRefresh } = useDashboardRefresh();
  const [isLoading, setIsLoading] = useState(false);

  const allowedTransitions = ORDER_STATUS_FLOW[currentStatus as OrderStatus] ?? [];
  const isAllowed = allowedTransitions.includes(newStatus as OrderStatus);

  if (!isAllowed) return null;

  async function handleClick() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      toast.success(
        `Order status updated to ${ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS]}`
      );
      requestRefresh();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isLoading}>
      {ORDER_STATUS_LABELS[newStatus as keyof typeof ORDER_STATUS_LABELS] ?? newStatus}
    </Button>
  );
}
