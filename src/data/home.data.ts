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
      src: "/images/home/hero/z21-home-hero-main-01-desktop-7.webp",
      alt: "Campagne ZONE 21, maison créative indépendante",
    },
    imageMobile: {
      src: "/images/home/hero/campaign-spring-26-hero.2.jpg",
      alt: "Campagne mobile ZONE 21, univers créatif premium",
    },
  },

  manifesto: {
    tagline: "Jamais dans la tendance. Toujours dans la bonne direction.",
    image: {
      src: "/images/editorial/z21-home-section-univers-01-8.webp",
      alt: "Vision éditoriale ZONE 21 entre image, vêtement et narration",
    },
    paragraphs: [
      "ZONE 21 est une maison créative indépendante. Elle avance hors tendance, avec une direction claire, une exigence stable et une identité qui ne cède pas au premier mouvement du moment.",
      "Ici, chaque vêtement, chaque image, chaque son, chaque talent et chaque récit doivent tenir debout. Pas pour plaire vite. Pas pour disparaître vite. Mais pour construire une signature durable.",
      "ZONE 21 relie culture street, vêtement premium, image de marque, musique, production et narration. Chaque univers garde sa personnalité, mais partage la même base : caractère, précision, cohérence et niveau de finition.",
    ],
  },

  maisons: [
    {
      id: "wear",
      name: "21 WEAR",
      category: "Vêtement premium, culture street & silhouettes signature",
      image: {
        src: "/images/ecosysteme/z21-ecosysteme-grid-21-wear-2.webp",
        alt: "21 Wear, vêtement premium et culture street",
      },
      href: "/wear",
      gridClass: "portrait",
    },
    {
      id: "core",
      name: "21 CORE STUDIOS",
      category: "Image, direction artistique & systèmes de marque",
      image: {
        src: "/images/ecosysteme/z21-ecosysteme-grid-21-core studios-1.webp",
        alt: "21 Core Studios, direction artistique et image de marque",
      },
      href: "/core-studios",
      gridClass: "portrait",
    },
    {
      id: "prod",
      name: "21 PRODUCTION",
      category: "Son, artistes & production musicale",
      image: {
        src: "/images/ecosysteme/z21-ecosysteme-grid-21-production-1.webp",
        alt: "21 Production, studio sonore et production musicale",
      },
      href: "/prod",
      gridClass: "portrait",
    },
    {
      id: "talents",
      name: "21 TALENTS AGENCY",
      category: "Talents, visages & présences éditoriales",
      image: {
        src: "/images/ecosysteme/z21-ecosysteme-grid-21-talents-agency-2.webp",
        alt: "21 Talents Agency, talents et présences éditoriales",
      },
      href: "/talents-agency",
      gridClass: "portrait",
    },
  ],
};
