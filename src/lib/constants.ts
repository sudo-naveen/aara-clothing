export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  CATEGORIES: "/dashboard/categories",
  INVENTORY: "/dashboard/inventory",
  CUSTOMERS: "/dashboard/customers",
  ORDERS: "/dashboard/orders",
  SETTINGS: "/dashboard/settings",
} as const;

export const APP_NAME = "Aara Clothing";
export const APP_DESCRIPTION = "Internal Inventory & Order Management System";

export const ORDER_STATUSES = {
  NOT_STARTED: "NOT_STARTED",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NOT_STARTED: "Not Started",
  PROCESSING: "Processing",
  DONE: "Done",
};

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  NOT_STARTED: ["PROCESSING", "DONE"],
  PROCESSING: ["NOT_STARTED", "DONE"],
  DONE: ["NOT_STARTED", "PROCESSING"],
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "success" | "destructive" | "warning" | "outline"> = {
  NOT_STARTED: "secondary",
  PROCESSING: "default",
  DONE: "success",
};

export const STOCK_THRESHOLDS = {
  LOW: 10,
  OUT: 0,
} as const;

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= STOCK_THRESHOLDS.OUT) return "out_of_stock";
  if (stock <= STOCK_THRESHOLDS.LOW) return "low_stock";
  return "in_stock";
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export const LOW_STOCK_THRESHOLD = STOCK_THRESHOLDS.LOW;
