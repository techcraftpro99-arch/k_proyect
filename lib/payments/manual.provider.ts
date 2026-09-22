import type { PaymentProvider, PaymentSession } from "./types";

export class ManualProvider implements PaymentProvider {
  readonly method: "whatsapp" | "tiktok";

  constructor(method: "whatsapp" | "tiktok") {
    this.method = method;
  }

  async createSession(
    orderId: string,
    total: number,
    email: string
  ): Promise<PaymentSession> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const message = encodeURIComponent(
      `Hola! Quiero confirmar mi compra.\nOrden: ${orderId}\nEmail: ${email}\nTotal: $${total.toFixed(2)}\nComprobante adjunto.`
    );

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL ?? "";

    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${message}`
      : `${appUrl}/checkout/success?order=${orderId}&manual=whatsapp`;

    const tiktokRedirect = tiktokUrl
      ? `${tiktokUrl}?text=${message}`
      : `${appUrl}/checkout/success?order=${orderId}&manual=tiktok`;

    return {
      redirectUrl: this.method === "whatsapp" ? whatsappUrl : tiktokRedirect,
      metadata: { orderId, message: decodeURIComponent(message) },
    };
  }
}
