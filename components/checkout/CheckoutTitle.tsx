"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

export function CheckoutTitle() {
  const { t } = useI18n();
  return <h1 className="mb-8 text-3xl font-bold">{t.checkout.title}</h1>;
}
