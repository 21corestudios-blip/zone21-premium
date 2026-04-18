export const productionProductKinds = [
  "Beat",
  "Template",
  "Plug-in Chain",
  "Chord Progression Pack",
] as const;

export type ProductionProductKind = (typeof productionProductKinds)[number];

export interface ProductionProduct {
  id: string;
  artist: string;
  name: string;
  kind: ProductionProductKind;
  image: string;
  priceCents: number;
  currency: "EUR";
  shortDescription: string;
  description: string;
  includes: string[];
  bpm?: number;
  key?: string;
}

export function formatProductionPrice(
  priceCents: number,
  currency: ProductionProduct["currency"] = "EUR",
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function getProductionProductById(productId: string) {
  return productionProducts.find((product) => product.id === productId);
}

export const productionProducts: ProductionProduct[] = [
  {
    id: "nova-midnight-run",
    artist: "nova",
    name: "Midnight Run",
    kind: "Beat",
    image: "/images/brands/21-production/prod-1.jpg",
    priceCents: 8900,
    currency: "EUR",
    shortDescription:
      "Beat editorial sombre, pense pour topline rap, vocal hybride ou format teaser premium.",
    description:
      "Une production centree sur la tension, avec une batterie concise, des nappes enveloppantes et un espace tres travaille pour accueillir une voix lead ou un topliner exigeant.",
    includes: [
      "WAV stereo premium",
      "Version sans tag",
      "Stems principaux",
      "Licence de demonstration",
    ],
    bpm: 142,
    key: "F# minor",
  },
  {
    id: "nova-afterglow-kit",
    artist: "nova",
    name: "Afterglow Chain",
    kind: "Plug-in Chain",
    image: "/images/contact/contact.jpg",
    priceCents: 4900,
    currency: "EUR",
    shortDescription:
      "Chaine de traitement voix et master bus pour obtenir une presence moderne et dense.",
    description:
      "Un preset workflow concu pour accelerer la mise en place d'une session: nettoyage, couleur, compression et finition dans un seul package facilement adaptable.",
    includes: [
      "Preset chain principal",
      "Version lead vocal",
      "Version bus instrumental",
      "Guide PDF de prise en main",
    ],
  },
  {
    id: "elya-clubline-01",
    artist: "elya",
    name: "Clubline 01",
    kind: "Template",
    image: "/images/home/hero/campaign-spring-26-hero.jpg",
    priceCents: 6900,
    currency: "EUR",
    shortDescription:
      "Template de session pour construire un track club clair, nerveux et evolutif.",
    description:
      "Architecture de projet pre-organisee pour aller vite: routing, premix, sidechains, groupes et automations de base deja poses pour que l'energie reste au centre.",
    includes: [
      "Session pre-routee",
      "Bus et groupes organises",
      "Markers de structure",
      "Notes d'utilisation",
    ],
    bpm: 128,
    key: "A minor",
  },
  {
    id: "elya-rise-pack",
    artist: "elya",
    name: "Rise Progressions",
    kind: "Chord Progression Pack",
    image: "/images/contact/contact 2.jpg",
    priceCents: 3500,
    currency: "EUR",
    shortDescription:
      "Pack d'accords et progressions pour electronique elegante, afro club et edits immersifs.",
    description:
      "Une selection de progressions midi et audio concues pour installer rapidement une tension melodique raffinée et exploitable en composition ou en live arrangement.",
    includes: [
      "Fichiers MIDI",
      "Exports audio",
      "Versions maj/min",
      "Guide de reinterpretation",
    ],
  },
  {
    id: "kael-silk-harmony",
    artist: "kael",
    name: "Silk Harmony",
    kind: "Chord Progression Pack",
    image: "/images/a_propos/photo_texte.jpg",
    priceCents: 4200,
    currency: "EUR",
    shortDescription:
      "Banque d'accords premium pour toplines neo soul, pop sensible et scoring emotionnel.",
    description:
      "Des suites harmoniques pensées pour donner une profondeur immediate aux maquettes, aux toplines ou aux bandes originales sans sacrifier la lisibilite du morceau.",
    includes: [
      "Progressions MIDI",
      "Voicings alternatifs",
      "Versions tonalite majeure et mineure",
      "Mini guide arrangement",
    ],
    key: "Multiple keys",
  },
  {
    id: "kael-frame-session",
    artist: "kael",
    name: "Frame Session",
    kind: "Template",
    image: "/images/editorial/Ecosysteme.jpg",
    priceCents: 7900,
    currency: "EUR",
    shortDescription:
      "Template de composition et arrangement pour demo haut de gamme, pack de writing ou session studio.",
    description:
      "Une base de travail sobre et propre, destinee aux producteurs et beatmakers qui veulent retrouver rapidement un niveau de lisibilite, d'espace et d'organisation professionnel.",
    includes: [
      "Template de production complet",
      "Organisation stems et groupes",
      "Bus FX et reverbs prets",
      "Checklist de finalisation",
    ],
  },
];
