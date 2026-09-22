"use client";

import { createContext, useContext } from "react";
import { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

interface BrandContextValue {
  brandImageUrl: string;
  isCustomBrandImage: boolean;
}

const BrandContext = createContext<BrandContextValue>({
  brandImageUrl: DEFAULT_BRAND_IMAGE,
  isCustomBrandImage: false,
});

export function BrandProvider({
  brandImageUrl,
  children,
}: {
  brandImageUrl: string;
  children: React.ReactNode;
}) {
  const isCustomBrandImage =
    Boolean(brandImageUrl) && brandImageUrl !== DEFAULT_BRAND_IMAGE;

  return (
    <BrandContext.Provider value={{ brandImageUrl, isCustomBrandImage }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
