"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface CheckoutSuccessContentProps {
  order?: string;
  manual?: boolean;
}

export function CheckoutSuccessContent({
  order,
  manual,
}: CheckoutSuccessContentProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="glass-card w-full p-10">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">
          {manual ? t.success.orderReceived : t.success.paymentSuccessful}
        </h1>
        {order && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t.success.orderId}:{" "}
            <code className="rounded bg-slate-100 px-2 py-0.5">{order}</code>
          </p>
        )}
        <p className="mt-4 text-muted-foreground">
          {manual ? t.success.manualHint : t.success.paidHint}
        </p>
        <Link href="/?section=shop" className="mt-8 inline-block">
          <Button className="btn-gradient rounded-full px-8">
            {t.success.continue}
          </Button>
        </Link>
      </div>
    </div>
  );
}
