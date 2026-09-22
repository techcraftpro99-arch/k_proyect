export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";
export type PaymentMethod = "paypal" | "whatsapp" | "tiktok";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  email: string;
  customerName: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference: string | null;
  paypalOrderId: string | null;
  total: number;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

export interface DownloadToken {
  id: string;
  orderId: string;
  productFileId: string;
  token: string;
  expiresAt: string;
  downloadedAt: string | null;
  fileName: string;
}
