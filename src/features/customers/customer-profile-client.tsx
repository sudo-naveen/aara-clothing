"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";
import { OrderForm } from "@/features/orders/order-form";
import { CustomerOrdersSection } from "./customer-orders-section";
import { Pencil, Plus, Trash2, ShoppingBag, Package, Calendar } from "lucide-react";
import type { Customer } from "@/types";
import { formatDate } from "@/utils/format";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

interface OrderItem {
  id: string;
  variant: {
    product: { id: string; name: string };
    color: string;
    size: string;
  };
  quantity: number;
}

interface OrderRow {
  id: string;
  orderNumber: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

interface Props {
  customer: Customer;
  stats: {
    totalOrders: number;
    totalItemsPurchased: number;
    mostRecentOrderDate: Date | null;
  } | null;
  orders: OrderRow[];
}

export function CustomerProfileClient({ customer, stats, orders }: Props) {
  const router = useRouter();
  const { requestRefresh } = useDashboardRefresh();
  const [editOpen, setEditOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    router.refresh();
  }, [router]);

  const handleOrderSuccess = useCallback(() => {
    setOrderOpen(false);
    requestRefresh();
    router.refresh();
  }, [router, requestRefresh]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Customer deleted");
      router.push("/dashboard/customers");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }, [customer.id, router]);

  return (
    <>
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-aara-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-40 rounded-full bg-aara-highlight/8 blur-3xl" />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-aara-primary/10">
            <ShoppingBag className="size-5 text-aara-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{customer.name}</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Customer Profile</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button
            size="sm"
            onClick={() => setOrderOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Plus className="size-4" />
            Add Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone</span>
              <p className="font-medium">{customer.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-sm text-muted-foreground">Address</span>
              <p className="font-medium">{customer.address ?? "-"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <p className="font-medium">{formatDate(customer.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-primary/10 transition-transform duration-200 group-hover:scale-110">
                <ShoppingBag className="size-4 text-aara-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Items Purchased
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-secondary/10 transition-transform duration-200 group-hover:scale-110">
                <Package className="size-4 text-aara-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItemsPurchased}</div>
            </CardContent>
          </Card>
          <Card className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Order
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-aara-accent/10 transition-transform duration-200 group-hover:scale-110">
                <Calendar className="size-4 text-aara-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.mostRecentOrderDate
                  ? formatDate(stats.mostRecentOrderDate)
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <CustomerOrdersSection
        customerId={customer.id}
        orders={orders}
        onNewOrder={() => setOrderOpen(true)}
      />

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            mode="edit"
            initialData={customer}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
            <DialogDescription>
              Create a new order for {customer.name}
            </DialogDescription>
          </DialogHeader>
          <OrderForm
            customerId={customer.id}
            mode="create"
            onSuccess={handleOrderSuccess}
            onCancel={() => setOrderOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {customer.name}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
