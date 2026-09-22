"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

export function ShopSectionTitle({ showShop }: { showShop: boolean }) {
  const { t } = useI18n();
  return (
    <h2 className="text-2xl font-semibold">
      {showShop ? t.shop.title : t.shop.featured}
    </h2>
  );
}
