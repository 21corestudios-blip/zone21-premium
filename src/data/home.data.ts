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
      src: "/images/home/hero/z21-home-hero-01.webp",
      alt: "Campagne institutionnelle Zone 21",
    },
    imageMobile: {
      src: "/images/home/hero/campaign-spring-26-hero.2.jpg",
      alt: "Campagne institutionnelle Zone 21 sur mobile",
    },
  },

  manifesto: {
    tagline:
      "Une architecture créative dédiée à l'émergence des maisons de demain.",
    image: {
      src: "/images/editorial/manifesto-vision.jpg",
      alt: "Vision de la Maison Zone 21",
    },
    paragraphs: [
      "Zone 21 donne forme aux marques avec une vision fondée sur l’exigence, la précision et la durée. Chaque projet naît d’une attention profonde portée aux matières, à la justesse du positionnement et à la construction d’un héritage pensé pour s’inscrire au-delà de l’instant.",
      "Ici, il ne s’agit pas simplement de structurer un écosystème, mais de faire émerger des univers désirables, cohérents et durables, capables de traverser le temps avec une présence calme, une force maîtrisée et une autorité naturelle.",
    ],
  },

  maisons: [
    {
      id: "wear",
      name: "21 WEAR",
      category: "Mode & Prêt-à-porter",
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
      category: "Agence Créative",
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
      category: "Promotion d'Artistes",
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
      category: "Promotion de Talents",
      image: {
        src: "/images/brands/21-core/studio-1.webp",
        alt: "Agence créative 21 Talents Agency",
      },
      href: "/talents-agency",
      gridClass: "portrait",
    },
  ],
};
