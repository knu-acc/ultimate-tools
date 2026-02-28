import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdsConsentProvider } from "@/contexts/AdsConsentContext";
import { getWebSiteSchema, getOrganizationSchema } from "@/lib/seo-metadata";
import { StickyBottomAd } from "@/components/ads/StickyBottomAd";
import { AdBlockDetector } from "@/components/ads/AdBlockDetector";
import { Analytics } from "@/components/Analytics";
import { ToastProvider } from "@/contexts/ToastContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ultimate Tools — 100+ бесплатных веб-инструментов",
    template: "%s | Ultimate Tools",
  },
  description:
    "100+ бесплатных онлайн-инструментов: калькуляторы, генераторы, конвертеры. Без регистрации, без отправки данных — всё в браузере. Калькулятор процентов, ИМТ, пароли, Base64, JSON, MD5.",
  keywords: [
    "онлайн инструменты",
    "бесплатные утилиты",
    "генератор паролей",
    "конвертер",
    "калькулятор",
    "Base64",
    "JSON",
    "MD5",
    "SHA256",
  ],
  authors: [{ name: "Ultimate Tools" }],
  creator: "Ultimate Tools",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US", "kk_KZ"],
    siteName: "Ultimate Tools",
    title: "Ultimate Tools — 100+ бесплатных веб-инструментов онлайн",
    description: "Калькуляторы, генераторы паролей, конвертеры. Без регистрации. Всё в браузере — конфиденциально и быстро.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ultimate Tools — бесплатные онлайн-инструменты" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Tools — 100+ бесплатных веб-инструментов",
    description: "Калькуляторы, генераторы, конвертеры. Без регистрации, всё в браузере.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const SITE_NAME = "Ultimate Tools";
const SITE_DESC = "100+ бесплатных онлайн-инструментов: калькуляторы, генераторы, конвертеры. Без регистрации, всё в браузере.";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema = getWebSiteSchema(BASE_URL, SITE_NAME, SITE_DESC);
  const organizationSchema = getOrganizationSchema(BASE_URL, SITE_NAME, SITE_DESC);
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script id="yandex-rtb-init" strategy="beforeInteractive">
          {`window.yaContextCb=window.yaContextCb||[]`}
        </Script>
        <Script src="https://yandex.ru/ads/system/context.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ThemeProvider>
          <AdsConsentProvider>
            <Analytics />
            <ToastProvider>
              <FavoritesProvider>
                {children}
              <StickyBottomAd />
              <AdBlockDetector />
              </FavoritesProvider>
            </ToastProvider>
          </AdsConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
