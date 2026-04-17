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
    image: "/images/brands/21-wear/accueil_21_wear.jpg",
  },
  collections: [
    {
      id: "classic",
      name: "Classic Collection",
      image: "/images/brands/21-wear/01_classic_collection.jpg",
      href: "/wear/classic",
    },
    {
      id: "urban",
      name: "Urban Collection",
      image: "/images/brands/21-wear/02_urban_collection.jpg",
      href: "/wear/urban",
    },
    {
      id: "heritage",
      name: "Heritage Collection",
      image: "/images/brands/21-wear/03_heritage_collection.jpg",
      href: "/wear/heritage",
    },
    {
      id: "studio",
      name: "Studio Collection",
      image: "/images/brands/21-wear/03_studio_collection.jpg",
      href: "/wear/studio",
    },
  ],
};
