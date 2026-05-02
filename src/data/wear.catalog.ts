export interface WearCollectionPage {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
}

export const wearCollections: WearCollectionPage[] = [
  {
    slug: "classic",
    name: "Classic Collection",
    heroImage:
      "/images/brands/21-wear/z21-21-wear-classic-collection-hero-2.webp",
    description:
      "Une ligne essentielle, structurée autour de silhouettes intemporelles, de matières maîtrisées et d’une élégance sobre.",
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
