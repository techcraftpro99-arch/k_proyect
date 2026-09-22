import type { PaymentProvider } from "./types";
import { PayPalProvider } from "./paypal.provider";
import { ManualProvider } from "./manual.provider";

const providers: Record<string, PaymentProvider> = {
  paypal: new PayPalProvider(),
  whatsapp: new ManualProvider("whatsapp"),
  tiktok: new ManualProvider("tiktok"),
};

export function getPaymentProvider(method: string): PaymentProvider {
  const provider = providers[method];
  if (!provider) {
    throw new Error(`Unknown payment method: ${method}`);
  }
  return provider;
}

export function getAllPaymentMethods(): PaymentProvider[] {
  return Object.values(providers);
}
