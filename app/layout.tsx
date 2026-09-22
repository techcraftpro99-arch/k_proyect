import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { BrandProvider } from "@/components/brand/BrandProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { getStoreSettings } from "@/lib/store-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getStoreSettings();

  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-full">
        <ThemeProvider>
          <GradientBackground />
          <LocaleProvider>
            <BrandProvider brandImageUrl={settings.brandImageUrl}>
              <CartProvider>
                <Header />
                <main className="relative z-10 flex-1">{children}</main>
                <Footer />
              </CartProvider>
            </BrandProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
