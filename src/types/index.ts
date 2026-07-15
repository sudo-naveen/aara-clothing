export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface User {
  id: string;
  name: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
  _count?: { variants: number };
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  size: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus = "NOT_STARTED" | "PROCESSING" | "DONE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
}
