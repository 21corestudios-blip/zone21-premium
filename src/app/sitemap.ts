import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { coreProducts } from "@/data/core.products";
import { coreServices } from "@/data/core.services";
import { productionArtists } from "@/data/production.artists";
import {
  productionProducts,
  productionStorefrontCategories,
} from "@/data/production.products";
import { talentDivisions } from "@/data/talents.divisions";
import { talentsProducts } from "@/data/talents.products";
import { wearCollections } from "@/data/wear.catalog";
import { wearProducts } from "@/data/wear.products";

type SitemapRoute = {
  path: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
};

function buildUrl(path: string) {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productionArtistSlugs = new Set(
    productionArtists.map((artist) => artist.slug),
  );
  const visibleProductionProducts = productionProducts.filter((product) =>
    productionArtistSlugs.has(product.artist),
  );

  const staticRoutes: SitemapRoute[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/a-propos", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ecosysteme", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.35 },
    { path: "/wear", changeFrequency: "weekly", priority: 0.85 },
    { path: "/core-studios", changeFrequency: "weekly", priority: 0.85 },
    { path: "/prod", changeFrequency: "weekly", priority: 0.85 },
    { path: "/talents-agency", changeFrequency: "weekly", priority: 0.85 },
  ];

  const wearRoutes: SitemapRoute[] = [
    ...wearCollections.map((collection) => ({
      path: `/wear/${collection.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...wearProducts.map((product) => ({
      path: `/wear/${product.collection}/${product.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  const coreRoutes: SitemapRoute[] = [
    ...coreServices.map((service) => ({
      path: `/core-studios/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...coreProducts.map((product) => ({
      path: `/core-studios/${product.service}/${product.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  const productionRoutes: SitemapRoute[] = [
    ...productionArtists.map((artist) => ({
      path: `/prod/${artist.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...productionArtists.flatMap((artist) =>
      productionStorefrontCategories.map((category) => ({
        path: `/prod/${artist.slug}/${category.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
    ),
    ...visibleProductionProducts.map((product) => ({
      path: `/prod/${product.artist}/${product.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  const talentsRoutes: SitemapRoute[] = [
    ...talentDivisions.map((division) => ({
      path: `/talents-agency/${division.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...talentsProducts.map((product) => ({
      path: `/talents-agency/${product.division}/${product.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [
    ...staticRoutes,
    ...wearRoutes,
    ...coreRoutes,
    ...productionRoutes,
    ...talentsRoutes,
  ].map((route) => ({
    url: buildUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
