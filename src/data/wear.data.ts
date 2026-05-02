export interface WearCollection {
  id: string;
  name: string;
  image: string;
  href: string;
}

export interface WearData {
  hero: {
    title: string;
    image: string;
  };
  collections: WearCollection[];
}

export const wearData: WearData = {
  hero: {
    title: "L'Essence de la Matière",
    image: "/images/brands/21-wear/z21-21-wear-hero-1.webp",
  },
  collections: [
    {
      id: "classic",
      name: "Classic Collection",
      image: "/images/brands/21-wear/z21-21-wear-classic-collection-1.webp",
      href: "/wear/classic",
    },
    {
      id: "urban",
      name: "Urban Collection",
      image: "/images/brands/21-wear/z21-21-wear-urban-collection-1.webp",
      href: "/wear/urban",
    },
    {
      id: "heritage",
      name: "Heritage Collection",
      image: "/images/brands/21-wear/z21-21-wear-heritage-collection-1.webp",
      href: "/wear/heritage",
    },
    {
      id: "studio",
      name: "Studio Collection",
      image: "/images/brands/21-wear/z21-21-wear-collection-studio-1.webp",
      href: "/wear/studio",
    },
  ],
};
