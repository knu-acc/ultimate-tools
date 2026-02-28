import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*?input=",
          "/*?text=",
          "/*?q=",
          "/*?config=",
          "/*?data=",
          "/*?value=",
        ],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/api/",
          "/*?input=",
          "/*?text=",
          "/*?q=",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/*?input=",
          "/*?text=",
          "/*?q=",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
