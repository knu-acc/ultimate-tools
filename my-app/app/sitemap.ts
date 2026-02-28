import type { MetadataRoute } from "next";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";
const LANGS = ["ru", "kz", "en"] as const;

// High-traffic tools get higher priority in sitemap
const HIGH_PRIORITY_TOOLS = new Set([
  "password-generator", "qr-generator", "base64", "json-formatter",
  "bmi", "percent-calc", "word-counter", "md5", "sha256",
  "url-encode", "case-converter", "countdown", "pomodoro",
  "color-picker", "uuid", "random-number", "regex-tester",
  "loan-calc", "tip-calculator", "utm-builder", "morse-code",
]);

// Static date — update when content changes significantly
const LAST_MODIFIED = new Date("2026-02-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "daily" as const,
      priority: 1,
    });

    for (const [category, { tools }] of Object.entries(CATEGORIES)) {
      entries.push({
        url: `${BASE_URL}/${lang}/${category}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      });

      for (const toolSlug of tools) {
        if (TOOLS[toolSlug]) {
          entries.push({
            url: `${BASE_URL}/${lang}/${category}/${toolSlug}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: "monthly" as const,
            priority: HIGH_PRIORITY_TOOLS.has(toolSlug) ? 0.9 : 0.7,
          });
        }
      }
    }
  }

  return entries;
}
