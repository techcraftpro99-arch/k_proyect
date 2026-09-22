import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { GradientBackground } from "@/components/layout/GradientBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: `${storeName} — Digital Design Assets`,
    template: `%s | ${storeName}`,
  },
  description:
    "Premium digital design assets — mockups, presets, templates, and vectors for creative professionals.",
  metadataBase: new URL(appUrl),
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    siteName: storeName,
    title: `${storeName} — Digital Design Assets`,
    description:
      "Premium digital design assets — mockups, presets, templates, and vectors.",
  },
  twitter: {
    card: "summary_large_image",
    title: storeName,
    description: "Premium digital design assets for creative professionals.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="relative min-h-full">
        <GradientBackground />
        <LocaleProvider>
          <CartProvider>
            <Header />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
