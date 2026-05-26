export interface WearCollectionPage {
  slug: string;
  name: string;
  promise?: string;
  heroImage: string;
  description: string;
}

export const wearCollections: WearCollectionPage[] = [
  {
    slug: "classic",
    name: "Classic Collection",
    promise:
      "Capsule essentielle CO-KAIN, premium streetwear sobre, testable en POD.",
    heroImage:
      "/images/brands/21-wear/z21-21-wear-classic-collection-hero-2.webp",
    description:
      "La Classic Collection pose les bases CO-KAIN avec une capsule lisible, sans visage, pensée pour tester t-shirts, hoodies et casquettes en production à la demande via Gelato. L’offre reste volontairement sobre, commerciale et mesurable avant tout déploiement plus large.",
  },
  {
    slug: "urban",
    name: "Urban Collection",
    heroImage:
      "/images/brands/21-wear/z21-21-wear-urban-collection-hero-1.webp",
    description:
      "Une collection pensée pour l’énergie urbaine, entre présence, confort, attitude et précision des volumes.",
  },
  {
    slug: "heritage",
    name: "Heritage Collection",
    heroImage:
      "/images/brands/21-wear/z21-21-wear-heritage-collection-hero-1.webp",
    description:
      "Une interprétation contemporaine de l’héritage, où la mémoire des coupes et des matières rencontre une direction affirmée.",
  },
  {
    slug: "studio",
    name: "Studio Collection",
    heroImage:
      "/images/brands/21-wear/z21-21-wear-studio-collection-hero-1.webp",
    description:
      "Une collection plus expérimentale, guidée par le geste créatif, la recherche de texture et l’expression du studio.",
  },
];
