export const coreProductKinds = [
  "Prestation",
  "Direction Package",
  "Marketing Kit",
  "Cadre",
  "Template",
] as const;

export type CoreProductKind = (typeof coreProductKinds)[number];

export interface CoreProduct {
  id: string;
  service: string;
  name: string;
  kind: CoreProductKind;
  image: string;
  priceCents: number;
  currency: "EUR";
  shortDescription: string;
  description: string;
  includes: string[];
  timeline?: string;
  deliveryFormat?: string;
}

export function formatCorePrice(
  priceCents: number,
  currency: CoreProduct["currency"] = "EUR",
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function getCoreProductById(productId: string) {
  return coreProducts.find((product) => product.id === productId);
}

export const coreProducts: CoreProduct[] = [
  {
    id: "brand-signature-system",
    service: "brand-design",
    name: "Signature System",
    kind: "Direction Package",
    image: "/images/brands/21-core/studio-1.webp",
    priceCents: 240000,
    currency: "EUR",
    shortDescription:
      "Territoire visuel premium pour maison, collection ou lancement exigeant.",
    description:
      "Une direction de marque complète pour poser les fondations visuelles d'un projet: typographie, palettes, système éditorial, principes d'application et cadrage de déploiement.",
    includes: [
      "Audit de positionnement",
      "Direction visuelle",
      "Kit identité principal",
      "Guide d'application",
    ],
    timeline: "2 à 3 semaines",
    deliveryFormat: "Fichiers source + export brand kit",
  },
  {
    id: "editorial-launch-kit",
    service: "brand-design",
    name: "Editorial Launch Kit",
    kind: "Marketing Kit",
    image: "/images/contact/contact.jpg",
    priceCents: 69000,
    currency: "EUR",
    shortDescription:
      "Pack graphique pour teasing, reveals, lancement produit ou campagne social media.",
    description:
      "Un ensemble de visuels et compositions prêt à être déployé pour une campagne de lancement ou une prise de parole premium sur plusieurs formats.",
    includes: [
      "Visuels feed et story",
      "Templates annonce",
      "Principes de hiérarchie typographique",
      "Exports optimisés",
    ],
    timeline: "5 jours",
    deliveryFormat: "Figma + exports JPG/PNG",
  },
  {
    id: "immersive-showcase-site",
    service: "web-experience",
    name: "Immersive Showcase Site",
    kind: "Prestation",
    image: "/images/home/hero/campaign-spring-26-hero.jpg",
    priceCents: 420000,
    currency: "EUR",
    shortDescription:
      "Site vitrine immersif avec direction web, architecture de contenu et intégration.",
    description:
      "Conception et réalisation d'un site éditorial ou marque, avec réflexion sur l'expérience, maquettes, développement front-end et mise en forme d'un récit digital cohérent.",
    includes: [
      "Cadrage UX",
      "Web design sur mesure",
      "Intégration front-end",
      "Recette et optimisation",
    ],
    timeline: "3 à 5 semaines",
    deliveryFormat: "Projet web intégré",
  },
  {
    id: "premium-landing-template",
    service: "web-experience",
    name: "Premium Landing Template",
    kind: "Template",
    image: "/images/editorial/manifesto-vision.jpg",
    priceCents: 29000,
    currency: "EUR",
    shortDescription:
      "Base de landing page premium pour lancement, capsule, drop ou offre studio.",
    description:
      "Template éditorial prêt à personnaliser avec une structure claire, des sections premium et une hiérarchie pensée pour la conversion sans banaliser l'esthétique.",
    includes: [
      "Template desktop et mobile",
      "Sections hero et contenu",
      "Bloc conversion",
      "Guide de personnalisation",
    ],
    timeline: "Livraison immédiate",
    deliveryFormat: "Figma",
  },
  {
    id: "gallery-frame-edition-01",
    service: "marketing-objects",
    name: "Gallery Frame Edition 01",
    kind: "Cadre",
    image: "/images/editorial/Ecosysteme.jpg",
    priceCents: 18000,
    currency: "EUR",
    shortDescription:
      "Cadre premium pour showroom, corner retail, bureau créatif ou capsule de marque.",
    description:
      "Objet encadré pensé comme un support de présence visuelle. Il sert autant à installer une ambiance de marque qu'à renforcer la lecture d'un espace de présentation ou de vente.",
    includes: [
      "Visuel premium imprimé",
      "Cadre prêt à poser",
      "Finition studio",
      "Certificat d'édition",
    ],
    timeline: "7 à 10 jours",
    deliveryFormat: "Objet physique",
  },
  {
    id: "retail-marketing-pack",
    service: "marketing-objects",
    name: "Retail Marketing Pack",
    kind: "Marketing Kit",
    image: "/images/contact/contact 2.jpg",
    priceCents: 54000,
    currency: "EUR",
    shortDescription:
      "Support de vente et diffusion pour boutique, pop-up, showroom ou activation locale.",
    description:
      "Kit de supports marketing conçu pour habiller un point de contact physique ou hybride: panneaux, assets, messages et éléments de diffusion pour améliorer la perception commerciale.",
    includes: [
      "Supports imprimables",
      "Visuels de diffusion",
      "Messages de vente",
      "Pack d'activation",
    ],
    timeline: "6 jours",
    deliveryFormat: "Fichiers print + digital",
  },
];
