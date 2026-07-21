export interface ImageAsset {
  src: string;
  alt: string;
}

export interface HeroData {
  title: string;
  seoImage: ImageAsset;
  imageDesktop: ImageAsset;
  imageMobile: ImageAsset;
}

export interface ManifestoData {
  tagline: string;
  image: ImageAsset;
  paragraphs: string[];
}

export interface HomeImageSectionData {
  image: ImageAsset;
  imageClassName: string;
  backgroundClassName: string;
  overlayClassName?: string;
}

export interface HomeEditorialSectionData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: ImageAsset;
  imagePosition: "left" | "right";
  theme: "light" | "dark";
  sectionClassName: string;
  imageClassName: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export interface MaisonData {
  id: string;
  name: string;
  section: string;
  category: string;
  image: ImageAsset;
  logo: ImageAsset;
  href: string;
  gridClass: string;
}

export interface HomeData {
  hero: HeroData;
  manifesto: ManifestoData;
  universeImage: HomeImageSectionData;
  maisonsIntro: HomeEditorialSectionData;
  zone4Image: HomeImageSectionData;
  about: HomeEditorialSectionData;
  zone6Image: HomeImageSectionData;
  contact: HomeEditorialSectionData;
  zone8Image: HomeImageSectionData;
  maisons: MaisonData[];
}

export const homeData: HomeData = {
  hero: {
    title: "L'Exigence pour Signature",
    seoImage: {
      src: "/images/home/hero/Image_hero_0003_16_9.webp",
      alt: "ARCANE - maison créative indépendante premium",
    },
    imageDesktop: {
      src: "/images/home/hero/Image_hero_0003_16_9.webp",
      alt: "Campagne ARCANE, maison créative indépendante",
    },
    imageMobile: {
      src: "/images/home/hero/Image_hero_0003_16_9.webp",
      alt: "Campagne mobile ARCANE, univers créatif premium",
    },
  },

  manifesto: {
    tagline: "Jamais dans la tendance. Toujours dans la bonne direction.",
    image: {
      src: "/images/editorial/Image_manifesto_0001_1-1.webp",
      alt: "Vision éditoriale ARCANE entre image, vêtement et narration",
    },
    paragraphs: [
      "ARCANE est une maison créative indépendante. Elle avance hors tendance, avec une direction claire, une exigence stable et une identité qui ne cède pas au premier mouvement du moment.",
      "Ici, chaque vêtement, chaque image, chaque son, chaque talent et chaque récit doivent tenir debout. Pas pour plaire vite. Pas pour disparaître vite. Mais pour construire une signature durable.",
      "ARCANE relie culture street, vêtement premium, image de marque, musique, events, production et narration. Chaque univers garde sa personnalité, mais partage la même base : caractère, précision, cohérence et niveau de finition.",
    ],
  },

  universeImage: {
    image: {
      src: "/images/editorial/Image_zone_02_0001_16_9.webp",
      alt: "",
    },
    imageClassName: "object-cover object-center",
    backgroundClassName: "bg-white",
  },

  maisonsIntro: {
    eyebrow: "Les Maisons ARCANE",
    title: "Des signatures distinctes. Une même culture.",
    paragraphs: [
      "ARCANE rassemble des maisons qui ne racontent pas la même chose, mais parlent depuis les mêmes racines : la rue, l’image, le son, le vêtement, le geste juste.",
      "CO-KAIN travaille la silhouette. EKKO donne corps aux présences qui incarnent l’époque. CYPHER structure les events. BACKSPIN porte le son. CORE STUDIOS façonne le design.",
      "Chaque maison avance avec son langage, son rythme et son territoire. Ensemble, elles composent une marque-monde : culturelle, urbaine, précise, pensée pour durer sans perdre sa tension.",
    ],
    image: {
      src: "/images/editorial/Image_les_maisons_0002_1_1.webp",
      alt: "Les Maisons ARCANE",
    },
    imagePosition: "right",
    theme: "light",
    sectionClassName: "bg-white",
    imageClassName: "object-contain object-center",
    ctaHref: "/ecosysteme",
    ctaLabel: "Découvrir les Maisons",
  },

  zone4Image: {
    image: {
      src: "/images/home/Image_zone_03_0009_16_9.webp",
      alt: "",
    },
    imageClassName: "object-cover object-[center_1%]",
    backgroundClassName: "bg-white",
  },

  about: {
    eyebrow: "À Propos",
    title: "Les Origines.",
    paragraphs: [
      "ARCANE prend forme autour de figures fondatrices. Elena Davalon, Naya Delmare et Heka ne sont pas de simples personnages : ils incarnent les premières forces de la maison. L’image, la silhouette, le son, la présence et le récit.",
      "À travers eux, ARCANE installe ses racines : une culture urbaine assumée, un héritage hip-hop et RnB, une attention au vêtement, au rythme, au détail et aux signes capables de durer.",
      "De cette base naît un territoire créatif plus large. Une maison pensée pour relier les univers sans les confondre, construire des lignes fortes et donner à chaque projet une présence reconnaissable.",
    ],
    image: {
      src: "/images/home/Image_les_origines_0002_1_1.webp",
      alt: "Figures fondatrices de ARCANE",
    },
    imagePosition: "left",
    theme: "light",
    sectionClassName: "bg-white",
    imageClassName: "object-contain object-center",
    ctaHref: "/a-propos",
    ctaLabel: "Découvrir les origines",
  },

  zone6Image: {
    image: {
      src: "/images/home/Image_zone_06_0002_16_9.webp",
      alt: "",
    },
    imageClassName: "object-cover object-[center_1%]",
    backgroundClassName: "bg-white",
    overlayClassName:
      "bg-gradient-to-b from-transparent via-bg/10 to-bg/65 mix-blend-multiply",
  },

  contact: {
    eyebrow: "Contact",
    title: "Entrer dans la Zone.",
    paragraphs: [
      "Une collaboration commence rarement par un formulaire. Elle commence par une intention claire, une idée à cadrer, une présence à construire ou un univers à faire exister avec justesse.",
      "ARCANE reçoit chaque prise de contact avec exigence, discrétion et attention. Demande de création sur mesure, projet éditorial, direction artistique, image, musique, talent ou développement de marque : chaque échange est traité comme un point d’entrée sérieux.",
      "Entrer dans la Zone, c’est ouvrir un espace de travail où la vision, la stratégie et la production avancent ensemble. Avec précision, avec tenue, et avec le souci de créer quelque chose qui garde sa force dans le temps.",
    ],
    image: {
      src: "/images/home/Image_entrez_dans_la_zone_0001_1_1.webp",
      alt: "Entrer dans la ARCANE",
    },
    imagePosition: "right",
    theme: "light",
    sectionClassName: "bg-white",
    imageClassName: "object-contain object-center",
    ctaHref: "/contact",
    ctaLabel: "Entrer en contact",
  },

  zone8Image: {
    image: {
      src: "/images/home/ARC-home-zone-4-0001.webp",
      alt: "",
    },
    imageClassName: "object-cover object-[center_0%]",
    backgroundClassName: "bg-white",
    overlayClassName:
      "bg-gradient-to-b from-transparent via-bg/20 to-bg/85 mix-blend-multiply",
  },

  maisons: [
    {
      id: "wear",
      name: "CO-KAIN",
      section: "Wear",
      category: "Vêtement premium, culture street & silhouettes signature",
      image: {
        src: "/images/ecosysteme/ARC-ecosysteme-grid-21-wear-0001.webp",
        alt: "CO-KAIN, vêtement premium et culture street",
      },
      logo: {
        src: "/images/ui/cokain-logo-blanc.svg",
        alt: "CO-KAIN",
      },
      href: "/wear",
      gridClass: "portrait",
    },
    {
      id: "talents",
      name: "EKKO",
      section: "Talents",
      category: "Talents, visages & présences éditoriales",
      image: {
        src: "/images/ecosysteme/ARC-ecosysteme-grid-21-talents-agency-0001.webp",
        alt: "EKKO, talents et présences éditoriales",
      },
      logo: {
        src: "/images/ui/ekko-logo-couleur-blanc.svg",
        alt: "EKKO",
      },
      href: "/talents-agency",
      gridClass: "portrait",
    },
    {
      id: "events",
      name: "CYPHER",
      section: "Events",
      category: "Events, sessions & expériences culturelles",
      image: {
        src: "/images/ecosysteme/ARC-ecosysteme-hero-0001.webp",
        alt: "CYPHER, events et sessions culturelles",
      },
      logo: {
        src: "/images/ui/cypher-logo-couleur-blanc.svg",
        alt: "CYPHER",
      },
      href: "/contact",
      gridClass: "portrait",
    },
    {
      id: "music",
      name: "BACKSPIN",
      section: "Music",
      category: "Son, artistes & production musicale",
      image: {
        src: "/images/ecosysteme/ARC-ecosysteme-grid-21-production-0001.webp",
        alt: "BACKSPIN, studio sonore et production musicale",
      },
      logo: {
        src: "/images/ui/backspin-logo-blanc-noir.svg",
        alt: "BACKSPIN",
      },
      href: "/prod",
      gridClass: "portrait",
    },
    {
      id: "design",
      name: "CORE STUDIOS",
      section: "Design",
      category: "Image, direction artistique & systèmes de marque",
      image: {
        src: "/images/ecosysteme/ARC-ecosysteme-grid-21-core studios-0001.webp",
        alt: "Core Studios, direction artistique et image de marque",
      },
      logo: {
        src: "/images/ui/core-studios-logo-couleur-blanc.svg",
        alt: "CORE STUDIOS",
      },
      href: "/core-studios",
      gridClass: "portrait",
    },
  ],
};
