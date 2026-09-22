export type PaymentMethod = "paypal" | "whatsapp" | "tiktok";

export interface PaymentSession {
  redirectUrl?: string;
  clientToken?: string;
  metadata?: Record<string, string>;
}

export interface PaymentWebhookResult {
  orderId: string;
  paid: boolean;
  paymentReference?: string;
}

export interface PaymentProvider {
  readonly method: PaymentMethod;
  createSession(
    orderId: string,
    total: number,
    email: string
  ): Promise<PaymentSession>;
  handleWebhook?(payload: unknown): Promise<PaymentWebhookResult | null>;
}

export interface ManualPaymentContact {
  whatsappUrl: string;
  tiktokUrl: string;
  message: string;
}
