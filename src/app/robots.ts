import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/preview/",
        "/wear/panier",
        "/wear/checkout",
        "/core-studios/panier",
        "/prod/panier",
        "/talents-agency/panier",
        "/collaborateurs",
        "/ged/",
        "/rdm/",
        "/account/",
        "/commande/",
        "/*?preview=*",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
