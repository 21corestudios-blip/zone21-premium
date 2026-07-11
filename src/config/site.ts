const fallbackSiteUrl = "https://zone-21.fr";

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "");
}

function resolveSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    return normalizeUrl(siteUrl);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
  }

  return fallbackSiteUrl;
}

export const siteConfig = {
  name: "ARCANE",
  legalName: "ZONE 21",
  url: resolveSiteUrl(),
  locale: "fr_FR",
  language: "fr-FR",
  description:
    "ARCANE est une maison créative indépendante dédiée aux univers premium entre vêtement, image, musique, production, talents et culture street.",
  logo: "/images/ui/Z21_logo-01.svg",
  socialImage: {
    url: "/images/home/hero/z21-home-hero-main-01-desktop-7.webp",
    width: 2048,
    height: 1136,
    alt: "ARCANE - maison créative indépendante",
  },
  category: "creative business",
  authors: [{ name: "ARCANE" }],
} as const;

export function buildSiteUrl(path: string) {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
