"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { formatPrice, isProductPhotoUrl } from "@/lib/format";

function displayName(item: CheckoutItem, locale: "en" | "es") {
  if (locale === "en" && item.nameEn?.trim()) return item.nameEn.trim();
  return item.name;
}

interface CheckoutItem {
  productId: string;
  name: string;
  nameEn: string | null;
  price: number;
  thumbnailUrl: string;
  paymentLink: string | null;
}

interface CheckoutFormProps {
  buySlug?: string;
}

export function CheckoutForm({ buySlug }: CheckoutFormProps) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { items, removeItem, total, clearCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buyProduct, setBuyProduct] = useState<CheckoutItem | null>(null);
  const [cartProducts, setCartProducts] = useState<CheckoutItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(!buySlug && items.length > 0);

  useEffect(() => {
    if (!buySlug) return;
    fetch(`/api/products/${buySlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setBuyProduct({
            productId: data.product.productId,
            name: data.product.name,
            nameEn: data.product.nameEn ?? null,
            price: data.product.price,
            thumbnailUrl: data.product.thumbnailUrl,
            paymentLink: data.product.paymentLink ?? null,
          });
        }
      })
      .catch(() => {});
  }, [buySlug]);

  useEffect(() => {
    if (buySlug || items.length === 0) return;

    let cancelled = false;
    setLoadingCart(true);

    Promise.all(
      items.map(async (item) => {
        const res = await fetch(`/api/products/${item.slug}`);
        const data = await res.json();
        if (!res.ok || !data.product) {
          return {
            productId: item.productId,
            name: item.name,
            nameEn: null,
            price: item.price,
            thumbnailUrl: item.thumbnailUrl,
            paymentLink: null,
          } satisfies CheckoutItem;
        }
        return {
          productId: data.product.productId,
          name: data.product.name,
          nameEn: data.product.nameEn ?? null,
          price: data.product.price,
          thumbnailUrl: data.product.thumbnailUrl,
          paymentLink: data.product.paymentLink ?? null,
        } satisfies CheckoutItem;
      })
    )
      .then((products) => {
        if (!cancelled) setCartProducts(products);
      })
      .finally(() => {
        if (!cancelled) setLoadingCart(false);
      });

    return () => {
      cancelled = true;
    };
  }, [buySlug, items]);

  const checkoutItems: CheckoutItem[] = buyProduct
    ? [buyProduct]
    : buySlug || items.length === 0
      ? []
      : cartProducts.length
        ? cartProducts
        : items.map((i) => ({
            productId: i.productId,
            name: i.name,
            nameEn: null,
            price: i.price,
            thumbnailUrl: i.thumbnailUrl,
            paymentLink: null,
          }));

  const checkoutTotal = buyProduct
    ? buyProduct.price
    : checkoutItems.reduce((sum, i) => sum + i.price, 0) || total;

  async function payProduct(item: CheckoutItem) {
    if (!item.paymentLink) {
      setError(t.checkout.noPaymentLink);
      return;
    }

    setLoadingId(item.productId);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "paypal",
          items: [{ productId: item.productId, quantity: 1 as const }],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.checkout.checkoutFailed);

      if (!buyProduct) {
        removeItem(item.productId);
        if (items.length <= 1) clearCart();
      }

      window.location.assign(data.redirectUrl as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.checkout.checkoutFailed);
      setLoadingId(null);
    }
  }

  if (!checkoutItems.length && !loadingCart) {
    return (
      <div className="glass-card mx-auto max-w-lg p-10 text-center">
        <p className="text-lg font-medium">{t.checkout.empty}</p>
        <Button
          className="mt-4 rounded-full"
          onClick={() => router.push("/?section=shop")}
        >
          {t.checkout.browse}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">{t.checkout.orderSummary}</h2>
        <ul className="mt-5 space-y-4">
          {checkoutItems.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <div className="surface-brand relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.name}
                  fill
                  className={
                    isProductPhotoUrl(item.thumbnailUrl)
                      ? "rounded-2xl object-cover"
                      : "rounded-2xl object-contain p-1"
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{displayName(item, locale)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(item.price)}
                </p>
                {!item.paymentLink && (
                  <p className="mt-1 text-xs text-amber-600">{t.checkout.missingLink}</p>
                )}
              </div>
              {!buyProduct && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-white/50 pt-4 text-lg font-bold">
          <span>{t.checkout.total}</span>
          <span>{formatPrice(checkoutTotal)}</span>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">{t.checkout.paymentMethod}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.checkout.paypalLinkHint}</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-6">
          {loadingCart ? (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.checkout.creatingOrder}
            </div>
          ) : checkoutItems.length === 1 ? (
            <Button
              className="btn-gradient w-full rounded-full py-6 text-base"
              disabled={!!loadingId || !checkoutItems[0].paymentLink}
              onClick={() => void payProduct(checkoutItems[0])}
            >
              {loadingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.checkout.creatingOrder}
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t.checkout.payWithPaypal}
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t.checkout.payOneAtATime}</p>
              {checkoutItems.map((item) => (
                <Button
                  key={item.productId}
                  className="btn-gradient w-full rounded-full"
                  disabled={!!loadingId || !item.paymentLink}
                  onClick={() => void payProduct(item)}
                >
                  {loadingId === item.productId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.checkout.creatingOrder}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t.checkout.payProduct.replace("{name}", displayName(item, locale))}
                    </>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
