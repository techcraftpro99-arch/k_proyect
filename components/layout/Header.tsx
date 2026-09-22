"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const { count } = useCart();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/?section=shop", label: t.nav.shop },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <BrandMark size="sm" />
          <span className="hidden max-w-[9rem] truncate text-sm font-semibold leading-tight tracking-tight sm:inline lg:max-w-none lg:text-lg gradient-text">
            {t.nav.brand}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
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

        {/* Mobile: fills remaining width with spaced icons. Desktop: compact cluster on the right. */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1 pl-2 md:ml-auto md:w-auto md:flex-none md:justify-end md:gap-2 md:pl-0">
          <LanguageSwitcher className="md:mr-0" />
          <ThemeToggle />
          <Link href="/checkout">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t.nav.cart}
              className="relative size-8"
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
            <Button
              variant="ghost"
              size="icon"
              aria-label={t.nav.account}
              className="size-8"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
              aria-label={t.nav.menu}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,320px)]">
              <SheetHeader>
                <SheetTitle>{t.nav.menu}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-[#9E00FF]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
