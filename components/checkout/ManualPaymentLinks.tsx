"use client";

import { MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface ManualPaymentLinksProps {
  orderId: string;
  total: number;
  email: string;
  method: "whatsapp" | "tiktok";
  redirectUrl?: string;
}

export function ManualPaymentLinks({
  orderId,
  total,
  email,
  method,
  redirectUrl,
}: ManualPaymentLinksProps) {
  const { t } = useI18n();
  const instructions =
    method === "whatsapp" ? t.checkout.whatsappHint : t.checkout.tiktokHint;

  return (
    <div className="space-y-4 rounded-2xl border border-white/60 bg-white/60 p-5">
      <p className="text-sm text-muted-foreground">{instructions}</p>
      <div className="rounded-lg bg-slate-50 p-3 text-sm">
        <p>
          <strong>{t.checkout.orderId}:</strong> {orderId}
        </p>
        <p>
          <strong>{t.checkout.emailLabel}:</strong> {email}
        </p>
        <p>
          <strong>{t.checkout.totalLabel}:</strong> ${total.toFixed(2)} USD
        </p>
      </div>
      {redirectUrl && (
        <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
          <Button className="btn-gradient w-full rounded-full">
            {method === "whatsapp" ? (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.checkout.openWhatsapp}
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                {t.checkout.openTiktok}
              </>
            )}
          </Button>
        </a>
      )}
    </div>
  );
}
