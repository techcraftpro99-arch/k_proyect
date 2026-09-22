"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  function toggle(next: Locale) {
    setLocale(next);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/70 p-0.5 text-xs font-semibold backdrop-blur-sm",
        className
      )}
      role="group"
      aria-label={t.lang.label}
    >
      <button
        type="button"
        onClick={() => toggle("es")}
        className={cn(
          "rounded-full px-2 py-1 transition-colors md:px-2.5",
          locale === "es"
            ? "bg-gradient-to-r from-[#9E00FF] to-[#3A89FF] text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {t.lang.es}
      </button>
      <button
        type="button"
        onClick={() => toggle("en")}
        className={cn(
          "rounded-full px-2 py-1 transition-colors md:px-2.5",
          locale === "en"
            ? "bg-gradient-to-r from-[#9E00FF] to-[#3A89FF] text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {t.lang.en}
      </button>
    </div>
  );
}
