"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface PayPalButtonProps {
  orderId: string;
  total: number;
  onSuccess: (paypalOrderId: string) => void;
  onError: (error: string) => void;
}

export function PayPalButton({
  orderId,
  total,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const { t } = useI18n();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        {t.checkout.paypalNotConfigured}
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill" }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: orderId,
                amount: {
                  currency_code: "USD",
                  value: total.toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={async (_data, actions) => {
          const details = await actions?.order?.capture();
          if (details?.id) {
            onSuccess(details.id);
          } else {
            onError(t.checkout.captureFailed);
          }
        }}
        onError={() => onError(t.checkout.captureFailed)}
      />
    </PayPalScriptProvider>
  );
}

export function PayPalLoading() {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      {t.checkout.processing}
    </div>
  );
}
