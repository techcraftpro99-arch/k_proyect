"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LocaleProvider";

const year = new Date().getFullYear();

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative z-10 border-t border-white/40 bg-white/40 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} {t.nav.brand}. {t.footer.rights}
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/legal#privacy" className="hover:text-foreground">
            {t.footer.privacy}
          </Link>
          <Link href="/legal#terms" className="hover:text-foreground">
            {t.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
