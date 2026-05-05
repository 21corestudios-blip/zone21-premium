import type { MetadataRoute } from "next";

import { coreServices } from "@/data/core.services";
import { wearCollections } from "@/data/wear.catalog";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://zone21.com")
  .replace(/\/$/, "");

function buildUrl(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = [
    "/",
    "/wear",
    "/core-studios",
    "/prod",
    "/talents-agency",
  ];
  const wearRoutes = wearCollections.map(
    (collection) => `/wear/${collection.slug}`,
  );
  const coreRoutes = coreServices.map(
    (service) => `/core-studios/${service.slug}`,
  );

  return [...staticRoutes, ...wearRoutes, ...coreRoutes].map((route) => ({
    url: buildUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length === 2 ? 0.85 : 0.7,
  }));
}
