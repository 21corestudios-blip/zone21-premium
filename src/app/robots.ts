import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://zone-21.fr")
  .replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/wear/panier",
        "/wear/checkout",
        "/core-studios/panier",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
