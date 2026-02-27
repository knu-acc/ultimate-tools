import type { MetadataRoute } from "next";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";
const LANGS = ["ru", "kz", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    });

    for (const [category, { tools }] of Object.entries(CATEGORIES)) {
      entries.push({
        url: `${BASE_URL}/${lang}/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      });

      for (const toolSlug of tools) {
        if (TOOLS[toolSlug]) {
          entries.push({
            url: `${BASE_URL}/${lang}/${category}/${toolSlug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          });
        }
      }
    }
  }

  return entries;
}
