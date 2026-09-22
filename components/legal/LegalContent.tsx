"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

export function LegalContent() {
  const { t } = useI18n();
  const legal = t.legal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {legal.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{legal.updated}</p>

      <section id="privacy" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl font-semibold">{legal.privacyTitle}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {legal.privacyIntro}
        </p>
        <div className="mt-6 space-y-6">
          {legal.privacySections.map((section) => (
            <article key={section.title}>
              <h3 className="text-base font-semibold">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="terms" className="scroll-mt-24 mt-14 border-t border-white/50 pt-12">
        <h2 className="text-2xl font-semibold">{legal.termsTitle}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {legal.termsIntro}
        </p>
        <div className="mt-6 space-y-6">
          {legal.termsSections.map((section) => (
            <article key={section.title}>
              <h3 className="text-base font-semibold">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
