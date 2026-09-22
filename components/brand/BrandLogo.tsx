import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "gradient" | "light";
}

export function BrandLogo({ className, variant = "gradient" }: BrandLogoProps) {
  if (variant === "light") {
    return (
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-auto w-full", className)}
        aria-label="BD Logo"
      >
        <defs>
          <linearGradient id="bd-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9E00FF" />
            <stop offset="100%" stopColor="#3A89FF" />
          </linearGradient>
        </defs>
        <path
          d="M72 58 C72 28, 118 18, 138 42 C152 58, 148 88, 128 98 C158 108, 168 148, 148 178 C128 208, 78 198, 72 158 C66 118, 88 88, 118 82 C98 72, 78 68, 72 58 Z"
          fill="url(#bd-gradient)"
          stroke="url(#bd-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M118 118 C148 108, 198 118, 228 148 C258 178, 248 228, 208 248 C168 268, 118 248, 108 208 C98 168, 88 138, 118 118 Z"
          fill="none"
          stroke="url(#bd-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M198 42 L204 36 M214 52 L220 46"
          stroke="url(#bd-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M208 32 L214 26 M218 42 L224 36"
          stroke="url(#bd-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-3xl",
        className
      )}
      style={{
        background: "linear-gradient(145deg, rgba(158,0,255,0.08) 0%, rgba(58,137,255,0.12) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(158,0,255,0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(58,137,255,0.15), transparent 50%)",
        }}
      />
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-full p-6 sm:p-10"
        aria-hidden
      >
        <defs>
          <linearGradient id="bd-hero-gradient" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#9E00FF" />
            <stop offset="55%" stopColor="#9E00FF" />
            <stop offset="100%" stopColor="#3A89FF" />
          </linearGradient>
          <filter id="bd-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M78 62 C78 34, 120 24, 136 46 C148 60, 146 86, 126 96 C154 104, 164 140, 146 168 C128 196, 82 188, 78 152 C74 116, 94 90, 122 86 C104 78, 86 72, 78 62 Z"
          fill="url(#bd-hero-gradient)"
          filter="url(#bd-glow)"
        />
        <path
          d="M122 122 C150 112, 192 122, 218 148 C244 174, 236 218, 200 236 C164 254, 122 236, 114 200 C106 164, 98 140, 122 122 Z"
          fill="none"
          stroke="url(#bd-hero-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#bd-glow)"
        />
        <g stroke="url(#bd-hero-gradient)" strokeLinecap="round">
          <path d="M192 48 L198 42" strokeWidth="4" />
          <path d="M206 58 L212 52" strokeWidth="4" />
          <path d="M202 38 L208 32" strokeWidth="3" />
          <path d="M216 48 L222 42" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}
