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
    heroImage: "/images/brands/21-wear/01_classic_collection.jpg",
    description:
      "Une ligne essentielle, structurée autour de silhouettes intemporelles, de matières maîtrisées et d’une élégance sobre.",
  },
  {
    slug: "urban",
    name: "Urban Collection",
    heroImage: "/images/brands/21-wear/02_urban_collection.jpg",
    description:
      "Une collection pensée pour l’énergie urbaine, entre présence, confort, attitude et précision des volumes.",
  },
  {
    slug: "heritage",
    name: "Heritage Collection",
    heroImage: "/images/brands/21-wear/03_heritage_collection.jpg",
    description:
      "Une interprétation contemporaine de l’héritage, où la mémoire des coupes et des matières rencontre une direction affirmée.",
  },
  {
    slug: "studio",
    name: "Studio Collection",
    heroImage: "/images/brands/21-wear/03_studio_collection.jpg",
    description:
      "Une collection plus expérimentale, guidée par le geste créatif, la recherche de texture et l’expression du studio.",
  },
];
