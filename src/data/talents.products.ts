export const talentsProductKinds = [
  "Representation Package",
  "Campaign Package",
  "Talent Kit",
  "Brand Matchmaking",
  "Consulting",
] as const;

export type TalentsProductKind = (typeof talentsProductKinds)[number];

export interface TalentsProduct {
  id: string;
  division: string;
  name: string;
  kind: TalentsProductKind;
  image: string;
  priceCents: number;
  currency: "EUR";
  shortDescription: string;
  description: string;
  includes: string[];
  timeline?: string;
  deliveryFormat?: string;
}

export function formatTalentsPrice(
  priceCents: number,
  currency: TalentsProduct["currency"] = "EUR",
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function getTalentsProductById(productId: string) {
  return talentsProducts.find((product) => product.id === productId);
}

export const talentsProducts: TalentsProduct[] = [
  {
    id: "fashion-presence-blueprint",
    division: "fashion-luxury",
    name: "Presence Blueprint",
    kind: "Representation Package",
    image: "/images/contact/contact.jpg",
    priceCents: 180000,
    currency: "EUR",
    shortDescription:
      "Cadrage d'image, lecture du profil et structuration de présence pour talent premium.",
    description:
      "Une offre de représentation pensée pour poser les fondations d'un profil mode ou beauté: lecture d'image, positionnement éditorial, priorités de visibilité et grille de collaboration.",
    includes: [
      "Audit de profil",
      "Positionnement de présence",
      "Cadrage de collaborations",
      "Plan éditorial initial",
    ],
    timeline: "2 semaines",
    deliveryFormat: "Accompagnement + dossier stratégie",
  },
  {
    id: "fashion-brand-match",
    division: "fashion-luxury",
    name: "Brand Match Selection",
    kind: "Brand Matchmaking",
    image: "/images/brands/21-core/studio-1.webp",
    priceCents: 72000,
    currency: "EUR",
    shortDescription:
      "Sélection ciblée de maisons et marques alignées avec le positionnement du talent.",
    description:
      "Une préparation de mises en relation et de prises de contact qualifiées pour faire émerger les collaborations les plus cohérentes avec l'image et la trajectoire du talent.",
    includes: [
      "Sélection de marques",
      "Argumentaire de présentation",
      "Préparation des prises de contact",
      "Recommandations de posture",
    ],
    timeline: "6 jours",
    deliveryFormat: "Dossier de sélection",
  },
  {
    id: "lifestyle-campaign-kit",
    division: "lifestyle-hospitality",
    name: "Campaign Story Kit",
    kind: "Campaign Package",
    image: "/images/editorial/manifesto-vision.jpg",
    priceCents: 64000,
    currency: "EUR",
    shortDescription:
      "Cadre de campagne pour destination, lieu, marque hospitality ou activation lifestyle.",
    description:
      "Une structure de campagne pensée pour les talents lifestyle: tonalité, narration, formats, orientation des contenus et coordination d'une prise de parole cohérente.",
    includes: [
      "Narration de campagne",
      "Recommandations formats",
      "Angles éditoriaux",
      "Grille de livraison",
    ],
    timeline: "5 jours",
    deliveryFormat: "Kit éditorial",
  },
  {
    id: "hospitality-profile-kit",
    division: "lifestyle-hospitality",
    name: "Hospitality Profile Kit",
    kind: "Talent Kit",
    image: "/images/contact/contact 2.jpg",
    priceCents: 29000,
    currency: "EUR",
    shortDescription:
      "Kit de présentation premium pour créateur lifestyle, travel ou food.",
    description:
      "Un kit de présentation prêt à activer pour améliorer la lecture du profil auprès des marques, lieux et partenaires qui recherchent un visage crédible et bien cadré.",
    includes: [
      "Présentation talent",
      "Positionnement synthétique",
      "Arguments de collaboration",
      "Fichiers de diffusion",
    ],
    timeline: "Livraison rapide",
    deliveryFormat: "PDF + exports",
  },
  {
    id: "sport-endorsement-setup",
    division: "sport-performance",
    name: "Endorsement Setup",
    kind: "Consulting",
    image: "/images/home/hero/campaign-spring-26-hero.jpg",
    priceCents: 56000,
    currency: "EUR",
    shortDescription:
      "Préparation des partenariats et de la présence de marque pour profils sport et performance.",
    description:
      "Une offre de consulting pour clarifier l'image publique, les axes de partenariat et la manière d'activer une audience sans perdre en crédibilité sportive.",
    includes: [
      "Audit d'image",
      "Axes de partenariat",
      "Conseils de prise de parole",
      "Feuille de route visibilité",
    ],
    timeline: "4 jours",
    deliveryFormat: "Session + synthèse",
  },
  {
    id: "digital-growth-sprint",
    division: "culture-digital",
    name: "Digital Growth Sprint",
    kind: "Campaign Package",
    image: "/images/brands/21-production/prod-1.jpg",
    priceCents: 84000,
    currency: "EUR",
    shortDescription:
      "Sprint de visibilité et de structuration éditoriale pour créateur ou streamer.",
    description:
      "Une séquence courte mais intense pour clarifier les formats prioritaires, le rythme de publication, les angles de collaboration et les leviers de croissance les plus pertinents.",
    includes: [
      "Lecture d'audience",
      "Recommandations formats",
      "Grille de contenus",
      "Axes de partenariats",
    ],
    timeline: "7 jours",
    deliveryFormat: "Sprint stratégique",
  },
];
