import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-10 w-12 sm:h-11 sm:w-14",
  md: "h-12 w-14",
  lg: "h-16 w-20 sm:h-20 sm:w-24",
};

export function BrandMark({ className, size = "sm" }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative isolate shrink-0 overflow-hidden rounded-xl shadow-sm",
        sizeStyles[size],
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #9E00FF 0%, #3A89FF 100%)",
        }}
      />
      <Image
        src="/images/logo-bd.png"
        alt="BD"
        fill
        className="object-contain p-1.5 mix-blend-screen"
        priority
        sizes="(max-width: 640px) 56px, 64px"
      />
    </div>
  );
}
