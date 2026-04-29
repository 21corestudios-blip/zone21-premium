export interface ImageAsset {
  src: string;
  alt: string;
}

export interface HeroData {
  title: string;
  imageDesktop: ImageAsset;
  imageMobile: ImageAsset;
}

export interface ManifestoData {
  tagline: string;
  image: ImageAsset;
  paragraphs: string[];
}

export interface MaisonData {
  id: string;
  name: string;
  category: string;
  image: ImageAsset;
  href: string;
  gridClass: string;
}

export interface HomeData {
  hero: HeroData;
  manifesto: ManifestoData;
  maisons: MaisonData[];
}

export const homeData: HomeData = {
  hero: {
    title: "L'Exigence pour Signature",
    imageDesktop: {
      src: "/images/home/hero/z21-home-hero-main-01-desktop-2.webp",
      alt: "Campagne institutionnelle Zone 21",
    },
    imageMobile: {
      src: "/images/home/hero/campaign-spring-26-hero.2.jpg",
      alt: "Campagne institutionnelle Zone 21 sur mobile",
    },
  },

  manifesto: {
    tagline: "Jamais dans la tendance. Toujours dans la bonne direction.",
    image: {
      src: "/images/editorial/z21-home-section-univers-01-3.webp",
      alt: "Vision éditoriale de Zone 21",
    },
    paragraphs: [
      "ZONE 21 ne court pas après la tendance. Le projet avance autrement : avec une direction, une exigence et une identité qui ne changent pas au premier mouvement du moment.",
      "Ici, chaque marque, chaque image, chaque son et chaque récit doivent tenir debout. Pas pour plaire vite. Pas pour disparaître vite. Mais pour construire des codes reconnaissables, durables et cohérents.",
      "ZONE 21 avance entre culture street, héritage musical, vêtement, production, image et narration. Un territoire créatif où chaque univers garde sa personnalité, mais partage la même base : caractère, précision, cohérence et vision.",
    ],
  },

  maisons: [
    {
      id: "wear",
      name: "21 WEAR",
      category: "Vêtement, culture street & silhouettes premium",
      image: {
        src: "/images/brands/21-wear/campaign-1.webp",
        alt: "Campagne 21 Wear",
      },
      href: "/wear",
      gridClass: "portrait",
    },
    {
      id: "core",
      name: "21 CORE STUDIOS",
      category: "Image, direction créative & systèmes de marque",
      image: {
        src: "/images/brands/21-core/studio-1.webp",
        alt: "21 Core Studios",
      },
      href: "/core-studios",
      gridClass: "portrait",
    },
    {
      id: "prod",
      name: "21 PRODUCTION",
      category: "Son, artistes & héritage musical",
      image: {
        src: "/images/brands/21-production/prod-1.jpg",
        alt: "21 Production",
      },
      href: "/prod",
      gridClass: "portrait",
    },
    {
      id: "talents",
      name: "21 TALENTS AGENCY",
      category: "Talents, visages & présences éditoriales",
      image: {
        src: "/images/brands/21-core/studio-1.webp",
        alt: "Agence créative 21 Talents Agency",
      },
      href: "/talents-agency",
      gridClass: "portrait",
    },
  ],
};
