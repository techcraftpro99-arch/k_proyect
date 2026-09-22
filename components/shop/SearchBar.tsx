"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    params.set("section", "shop");
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSearch}
        className="glass-card flex w-full items-center gap-2 p-2 sm:gap-3 sm:p-3"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.headline}
            aria-label={t.search.button}
            className="h-11 w-full rounded-full border-white/60 bg-white/80 pl-11 text-base sm:h-12 sm:pl-12 sm:text-lg"
          />
        </div>
        <Button
          type="submit"
          className="btn-gradient h-11 shrink-0 rounded-full px-5 sm:h-12 sm:px-8"
        >
          {t.search.button}
        </Button>
      </form>
    </section>
  );
}
