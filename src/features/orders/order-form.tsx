"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Package } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, ORDER_STATUS_VARIANT, type OrderStatus } from "@/lib/constants";
import { useDashboardRefresh } from "@/components/providers/dashboard-refresh-provider";

interface VariantItem {
  id: string;
  color: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  variants: VariantItem[];
}

interface OrderItemRow {
  variantId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  stock: number;
}

interface OrderFormProps {
  customerId: string;
  orderId?: string;
  initialItems?: OrderItemRow[];
  initialStatus?: string;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderForm({ customerId, orderId, initialItems, initialStatus, mode, onSuccess, onCancel }: OrderFormProps) {
  const router = useRouter();
  const { requestRefresh } = useDashboardRefresh();
  const isEmbedded = !!onSuccess;
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<OrderItemRow[]>(initialItems ?? []);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    (initialStatus as OrderStatus) ?? ORDER_STATUSES.NOT_STARTED
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/inventory/stock?limit=500");
        const data = await res.json();
        if (data.success) {
          const variantList = data.data?.data ?? [];
          const productMap = new Map<string, Product>();

          for (const v of variantList) {
            if (!productMap.has(v.product.id)) {
              productMap.set(v.product.id, {
                id: v.product.id,
                name: v.product.name,
                price: Number(v.product.price),
                variants: [],
              });
            }
            productMap.get(v.product.id)!.variants.push({
              id: v.id,
              color: v.color,
              size: v.size,
              stock: v.stock,
            });
          }

          setProducts(Array.from(productMap.values()));
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const variants = selectedProduct?.variants ?? [];

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  function handleAddItem() {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (!selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    if (quantity > variant.stock) {
      toast.error(`Insufficient stock. Available: ${variant.stock}`);
      return;
    }

    if (items.some((i) => i.variantId === selectedVariantId)) {
      toast.error("This variant is already in the order");
      return;
    }

    setItems([
      ...items,
      {
        variantId: selectedVariantId,
        productName: selectedProduct?.name ?? "",
        variantLabel: `${variant.color} / ${variant.size}`,
        quantity,
        stock: variant.stock,
      },
    ]);

    setSelectedVariantId("");
    setQuantity(1);
  }

  function handleRemoveItem(variantId: string) {
    setItems(items.filter((i) => i.variantId !== variantId));
  }

  function handleQuantityChange(variantId: string, newQty: number) {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId !== variantId) return item;
        if (newQty > item.stock) {
          toast.error(`Cannot exceed available stock of ${item.stock}`);
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: newQty };
      })
    );
  }

  async function handleSubmit() {
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsBody = {
        ...(mode === "create" ? { customerId } : {}),
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const url = mode === "create"
        ? "/api/orders"
        : `/api/orders/${orderId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemsBody),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      if (mode === "edit" && initialStatus !== orderStatus) {
        const statusRes = await fetch(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: orderStatus }),
        });
        const statusResult = await statusRes.json();
        if (!statusResult.success) throw new Error(statusResult.error);
        requestRefresh();
      }

      toast.success(
        mode === "create" ? "Order created successfully" : "Order updated successfully"
      );
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/customers/${customerId}`);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading products...</div>;
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (products.length === 0) {
    const emptyState = (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 mb-4">
          <Package className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No inventory available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add products to inventory before creating an order.
        </p>
      </div>
    );

    if (isEmbedded) return emptyState;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{mode === "create" ? "Create New Order" : "Edit Order"}</CardTitle>
          </CardHeader>
          <CardContent>
            {emptyState}
          </CardContent>
        </Card>
      </div>
    );
  }

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Product</Label>
          <SearchableSelect
            value={selectedProductId}
            onChange={(val) => {
              setSelectedProductId(val);
              setSelectedVariantId("");
              setQuantity(1);
            }}
            placeholder="Search products..."
            emptyMessage="No products available"
            items={products.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
        </div>

        {selectedProductId && (
          <div className="space-y-2">
            <Label>Variant</Label>
            <Select
              value={selectedVariantId}
              onChange={(val) => {
                setSelectedVariantId(val);
                setQuantity(1);
              }}
              placeholder="Select variant"
              items={variants.map((v) => ({
                value: v.id,
                label: `${v.color} / ${v.size} (Stock: ${v.stock})`,
              }))}
            />
          </div>
        )}

        {selectedVariantId && (
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={variants.find((v) => v.id === selectedVariantId)?.stock ?? 999}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="min-w-0 flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddItem}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-2">
          <Label>Order Items</Label>
          {/* Mobile: Card view */}
          <div className="md:hidden space-y-2">
            {items.map((item) => (
              <div key={item.variantId} className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.variantLabel}</p>
                    <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveItem(item.variantId)}
                    className="shrink-0"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Qty:</Label>
                  <Input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.variantId, Number(e.target.value))
                    }
                    className="h-11 w-20 text-center"
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: Table view */}
          <div className="hidden md:block overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-2 font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground">Variant</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-center">Qty</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground text-center">Stock</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.variantId} className="border-b last:border-0">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">{item.variantLabel}</td>
                    <td className="px-4 py-2 text-center">
                      <Input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.variantId, Number(e.target.value))
                        }
                        className="h-11 w-20 text-center"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">{item.stock}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveItem(item.variantId)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4 rounded-md border p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={ORDER_STATUS_VARIANT[orderStatus]}>
              {ORDER_STATUS_LABELS[orderStatus]}
            </Badge>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="space-y-2">
          <Label>Order Status</Label>
          <Select
            value={orderStatus}
            onChange={(val) => setOrderStatus(val as OrderStatus)}
            items={Object.values(ORDER_STATUSES).map((s) => ({
              value: s,
              label: ORDER_STATUS_LABELS[s],
            }))}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full sm:w-auto"
        >
          <Save className="size-4" />
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Order"
            : "Update Order"}
        </Button>
      </div>
    </div>
  );

  if (isEmbedded) {
    return formContent;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create New Order" : "Edit Order"}</CardTitle>
        </CardHeader>
        <CardContent>
          {formContent}
        </CardContent>
      </Card>
    </div>
  );
}
