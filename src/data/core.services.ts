export interface CoreService {
  slug: string;
  name: string;
  role: string;
  image: string;
  heroImage: string;
  tagline: string;
  description: string;
  capabilities: string[];
  signature: string[];
}

export function getCoreServiceBySlug(serviceSlug: string) {
  return coreServices.find((service) => service.slug === serviceSlug);
}

export const coreServices: CoreService[] = [
  {
    slug: "brand-design",
    name: "Brand Design",
    role: "Identité, direction artistique & graphisme",
    image: "/images/brands/21-core/z21-21-core-studios-brand-design-grid.webp",
    heroImage:
      "/images/brands/21-core/z21-21-core-studios-brand-design-hero.webp",
    tagline:
      "Identités haut de gamme, systèmes visuels et cohérence de marque.",
    description:
      "Le pôle Brand Design construit les langages visuels, les territoires graphiques et les outils éditoriaux qui donnent de la tenue à une marque. Chaque détail est pensé pour aligner perception, désirabilité et usage réel.",
    capabilities: [
      "Direction artistique",
      "Identité visuelle",
      "Systèmes de marque",
    ],
    signature: [
      "Typographies affirmées",
      "Compositions éditoriales",
      "Codes premium durables",
    ],
  },
  {
    slug: "web-experience",
    name: "Web Experience",
    role: "UX, web design & codage",
    image:
      "/images/brands/21-core/z21-21-core-studios-web-experience-grid.webp",
    heroImage:
      "/images/brands/21-core/z21-21-core-studios-web-experience-hero.webp",
    tagline:
      "Interfaces sur mesure, narrations visuelles et exécution front-end.",
    description:
      "Le pôle Web Experience relie stratégie, interface et développement pour créer des sites désirables, performants et clairs. L'approche combine direction visuelle, structure de contenu et intégration précise.",
    capabilities: ["Web design", "Développement front-end", "Parcours premium"],
    signature: [
      "Narration immersive",
      "Hiérarchie lisible",
      "Détails d'interface maîtrisés",
    ],
  },
  {
    slug: "marketing-objects",
    name: "Marketing Objects",
    role: "Supports, produits marketing & objets encadrés",
    image:
      "/images/brands/21-core/z21-21-core-studios-marketing-objects-grid.webp",
    heroImage:
      "/images/brands/21-core/z21-21-core-studios-marketing-objects-hero.webp",
    tagline: "Assets activables, objets de marque et supports de visibilité.",
    description:
      "Le pôle Marketing Objects développe des produits prêts à l'usage pour les lancements, showrooms, boutiques et campagnes: cadres, kits marketing, visuels de diffusion et supports de présentation.",
    capabilities: [
      "Produits marketing",
      "Cadres et supports visuels",
      "Kits de diffusion",
    ],
    signature: [
      "Objets désirables",
      "Praticité commerciale",
      "Finition studio",
    ],
  },
];
