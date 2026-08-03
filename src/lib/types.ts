export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BLOCKED";
export type GearStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "UNAVAILABLE";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "ONGOING"
  | "RETURNED"
  | "CANCELLED"
  | "OVERDUE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  activeStatus: ActiveStatus;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
}

export interface Profile {
  id: string;
  profilePhoto?: string | null;
  bio?: string | null;
  address?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface Gear {
  id: string;
  name: string;
  description: string;
  brand?: string | null;
  images: string[];
  specifications?: Record<string, string> | null;
  pricePerDay: string | number;
  quantity: number;
  status: GearStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  categoryId: string;
  category?: Category;
  provider?: { id: string; name: string; email: string; phone?: string | null };
  reviews?: Review[];
  _count?: { reviews: number };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customerId: string;
  gearId: string;
  rentalOrderId: string;
  customer?: { id: string; name: string };
}

export interface RentalOrderItem {
  id: string;
  quantity: number;
  pricePerDay: string | number;
  subtotal: string | number;
  returnCondition?: string | null;
  orderId: string;
  gearId: string;
  gear?: Gear;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  endDate: string;
  returnedAt?: string | null;
  totalAmount: string | number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer?: { id: string; name: string; email: string; phone?: string | null };
  items: RentalOrderItem[];
  payments?: Payment[];
  reviews?: Review[];
}

export interface Payment {
  id: string;
  transactionId: string;
  stripePaymentIntentId?: string | null;
  sslSessionKey?: string | null;
  sslValId?: string | null;
  amount: string | number;
  method?: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  rentalOrderId: string;
  customerId: string;
  rentalOrder?: RentalOrder;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
}

export interface DashboardStats {
  totalUsers?: number;
  totalGear?: number;
  totalRentals?: number;
  [key: string]: unknown;
}
