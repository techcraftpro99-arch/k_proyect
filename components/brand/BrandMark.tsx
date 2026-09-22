"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Optional image URL. Header should omit this to keep the fixed logo. */
  src?: string;
  /** Render as a portrait photo (object-cover) instead of logo treatment */
  photo?: boolean;
}

const sizeStyles = {
  sm: "h-10 w-12 sm:h-11 sm:w-14",
  md: "h-12 w-14",
  lg: "h-16 w-20 sm:h-20 sm:w-24",
};

export function BrandMark({
  className,
  size = "sm",
  src,
  photo = false,
}: BrandMarkProps) {
  const imageSrc = src ?? DEFAULT_BRAND_IMAGE;
  const asPhoto = photo && imageSrc !== DEFAULT_BRAND_IMAGE;

  return (
    <div
      className={cn(
        "relative isolate shrink-0 overflow-hidden shadow-sm",
        asPhoto ? "rounded-2xl" : "rounded-xl",
        sizeStyles[size],
        className
      )}
    >
      {!asPhoto && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #9E00FF 0%, #3A89FF 100%)",
          }}
        />
      )}
      <Image
        src={imageSrc}
        alt={asPhoto ? "Foto de perfil" : "Logo"}
        fill
        className={cn(
          asPhoto ? "object-cover" : "object-contain p-1.5 mix-blend-screen"
        )}
        priority
        sizes="(max-width: 640px) 112px, 128px"
        unoptimized={imageSrc.startsWith("http")}
      />
    </div>
  );
}
