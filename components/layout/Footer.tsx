"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";
const year = new Date().getFullYear();

export function Footer() {
  const { t } = useI18n();

  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-white/40 bg-white/40 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} {storeName}. {t.footer.rights}
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            {t.footer.privacy}
          </a>
          <a href="#" className="hover:text-foreground">
            {t.footer.terms}
          </a>
          <a
            href="mailto:support@example.com"
            className="hover:text-foreground"
          >
            {t.footer.support}
          </a>
        </div>
      </div>
    </footer>
  );
}
