"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Sword, Gift, Megaphone, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/BrandMark";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function AboutContent() {
  const { t } = useI18n();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

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
    : "#contact";

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
              <a href={contactHref} target={whatsapp ? "_blank" : undefined} rel="noreferrer">
                <Button
                  variant="outline"
                  className="rounded-full border-white/70 bg-white/70 px-6"
                >
                  {t.about.ctaContact}
                </Button>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <div
              className="rounded-[28px] p-[2px] shadow-xl"
              style={{
                background: "linear-gradient(135deg, #9E00FF, #3A89FF)",
                boxShadow: "0 24px 60px rgba(158,0,255,0.2)",
              }}
            >
              <div className="flex flex-col items-center rounded-[26px] bg-white/80 px-10 py-12 backdrop-blur-xl">
                <BrandMark size="lg" className="h-24 w-28 sm:h-28 sm:w-32" />
                <p className="mt-6 text-2xl font-bold tracking-tight">Karol</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Motion · Live · Battle Design
                </p>
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
