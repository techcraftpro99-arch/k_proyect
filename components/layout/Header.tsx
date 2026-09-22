"use client";

import Link from "next/link";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { BrandMark } from "@/components/brand/BrandMark";

export function Header() {
  const { count } = useCart();
  const { t } = useI18n();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/?section=shop", label: t.nav.shop },
    { href: "/about", label: t.nav.about },
    { href: "/?featured=true", label: t.nav.sale },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size="sm" />
          <span className="hidden max-w-[11rem] text-sm font-semibold leading-tight tracking-tight sm:inline lg:max-w-none lg:text-lg gradient-text">
            {t.nav.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-[#9E00FF]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="mr-1" />
          <Button variant="ghost" size="icon" aria-label={t.nav.search}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={t.nav.favorites}>
            <Heart className="h-5 w-5" />
          </Button>
          <Link href="/checkout">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t.nav.cart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9E00FF] text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="ghost" size="icon" aria-label={t.nav.account}>
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
