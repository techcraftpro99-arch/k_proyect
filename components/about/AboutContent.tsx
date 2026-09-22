"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Sword, Gift, Megaphone, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/components/brand/BrandProvider";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

export function AboutContent() {
  const { t } = useI18n();
  const { brandImageUrl, isCustomBrandImage } = useBrand();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const portraitSrc = isCustomBrandImage ? brandImageUrl : DEFAULT_BRAND_IMAGE;

  const services = [
    { icon: Clapperboard, ...t.about.services.mvp },
    { icon: Gift, ...t.about.services.dedications },
    { icon: Megaphone, ...t.about.services.flyers },
    { icon: Sword, ...t.about.services.battles },
  ];

  const contactHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hola Karol! Quiero una animación / flyer para mi live ⚔️"
      )}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="relative overflow-hidden rounded-3xl glass-card">
        <div className="absolute inset-0 surface-brand opacity-60" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 15% 20%, rgba(158,0,255,0.18), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(58,137,255,0.2), transparent 45%)",
          }}
        />

        <div className="relative z-10 grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E00FF]">
              <Sparkles className="h-3.5 w-3.5" />
              {t.about.eyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.about.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.about.lead} ⚔️
            </p>
            <p className="mt-4 text-xl font-semibold gradient-text sm:text-2xl">
              {t.about.highlight}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.about.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/?section=shop">
                <Button className="btn-gradient rounded-full px-6">
                  {t.about.ctaShop}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {contactHref && (
                <a href={contactHref} target="_blank" rel="noreferrer">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/70 bg-white/70 px-6"
                  >
                    {t.about.ctaContact}
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <div
              className="w-full max-w-[280px] rounded-[28px] p-[2px] shadow-xl"
              style={{
                background: "linear-gradient(135deg, #9E00FF, #3A89FF)",
                boxShadow: "0 24px 60px rgba(158,0,255,0.2)",
              }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[26px] bg-white/80">
                {!isCustomBrandImage && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #9E00FF 0%, #3A89FF 100%)",
                    }}
                  />
                )}
                <Image
                  src={portraitSrc}
                  alt="Karol"
                  fill
                  priority
                  sizes="280px"
                  unoptimized={portraitSrc.startsWith("http")}
                  className={
                    isCustomBrandImage
                      ? "object-cover"
                      : "object-contain p-10 mix-blend-screen"
                  }
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 pb-5 pt-16 text-center">
                  <p className="text-2xl font-bold tracking-tight text-white">
                    Karol
                  </p>
                </div>
              </div>
            </div>
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              {t.about.note}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">{t.about.servicesTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="glass-card product-card-hover p-6"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #9E00FF, #3A89FF)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
