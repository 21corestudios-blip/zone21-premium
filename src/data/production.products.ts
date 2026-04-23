export const productionProductKinds = [
  "Beat",
  "Album",
  "Template",
  "Plug-in Chain",
  "Chord Progression Pack",
] as const;

export const productionSellableKinds = [
  ...productionProductKinds,
  "Track",
  "Vinyl",
  "Cassette",
] as const;

export type ProductionProductKind = (typeof productionProductKinds)[number];
export type ProductionSellableKind = (typeof productionSellableKinds)[number];

export interface ProductionProductPreview {
  src?: string;
  durationLabel?: string;
  label?: string;
}

export interface ProductionSellable {
  id: string;
  artist: string;
  name: string;
  kind: ProductionSellableKind;
  image: string;
  priceCents: number;
  currency: "EUR";
  shortDescription: string;
  description: string;
  includes: string[];
  bpm?: number;
  key?: string;
  preview?: ProductionProductPreview;
  parentProductId?: string;
  parentProductName?: string;
  availability?: "available" | "preorder";
  ctaLabel?: string;
}

export interface ProductionTrack extends ProductionSellable {
  kind: "Track";
  trackNumber: number;
  durationLabel: string;
}

export interface ProductionEdition extends ProductionSellable {
  kind: "Vinyl" | "Cassette";
  availability: "preorder";
  releaseLabel: string;
}

export interface ProductionProduct extends ProductionSellable {
  kind: ProductionProductKind;
  tracks?: ProductionTrack[];
  editions?: ProductionEdition[];
}

export const productionStorefrontCategorySlugs = [
  "albums",
  "tracks",
  "templates",
  "midi",
  "loops",
  "drum-kits",
] as const;

export type ProductionStorefrontCategorySlug =
  (typeof productionStorefrontCategorySlugs)[number];

export interface ProductionStorefrontCategory {
  slug: ProductionStorefrontCategorySlug;
  name: string;
  eyebrow: string;
  description: string;
  emptyMessage: string;
}

export const productionStorefrontCategories: ProductionStorefrontCategory[] = [
  {
    slug: "albums",
    name: "Albums",
    eyebrow: "Format long",
    description: "Projets complets, bundles premium et editions physiques.",
    emptyMessage: "Aucun album n'est encore publie dans cette selection.",
  },
  {
    slug: "tracks",
    name: "Titres",
    eyebrow: "Piste a l'unite",
    description: "Acheter une piste precise sans prendre tout le projet.",
    emptyMessage: "Aucun titre unitaire n'est encore disponible ici.",
  },
  {
    slug: "templates",
    name: "Templates",
    eyebrow: "Sessions",
    description: "Structures de travail, presets et bases de production.",
    emptyMessage: "Les templates arrivent prochainement.",
  },
  {
    slug: "midi",
    name: "MIDI",
    eyebrow: "Composition",
    description: "Progressions, harmonies et matiere melodique editable.",
    emptyMessage: "Les packs MIDI arrivent prochainement.",
  },
  {
    slug: "loops",
    name: "Loops",
    eyebrow: "Textures",
    description: "Fragments musicaux, ambiances et elements recurrents.",
    emptyMessage: "Les loops arrivent prochainement.",
  },
  {
    slug: "drum-kits",
    name: "Drum Kits",
    eyebrow: "Percussions",
    description: "Kits de batteries, one-shots et matiere rythmique.",
    emptyMessage: "Les drum kits arrivent prochainement.",
  },
];

export function formatProductionPrice(
  priceCents: number,
  currency: ProductionSellable["currency"] = "EUR",
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export const productionProducts: ProductionProduct[] = [
  {
    id: "nova-midnight-run",
    artist: "nova",
    name: "Midnight Run",
    kind: "Album",
    image: "/images/brands/21-production/prod-1.jpg",
    priceCents: 8900,
    currency: "EUR",
    shortDescription:
      "Projet nocturne en quatre titres, pense comme une sortie premium entre tension editoriale et impact immediat.",
    description:
      "Midnight Run se presente comme un mini-format construit pour les artistes qui veulent acheter une direction deja posee. L'album complet donne acces a l'ensemble des titres, a une coherence sonore forte et a une matiere directement exploitable en session ou en release planning.",
    includes: [
      "Album complet en WAV premium",
      "Versions sans tag",
      "Stems principaux",
      "Licence de demonstration",
    ],
    bpm: 142,
    key: "F# minor",
    preview: {
      durationLabel: "2:18",
    },
    tracks: [
      {
        id: "nova-midnight-run-track-01",
        artist: "nova",
        name: "Midnight Run",
        kind: "Track",
        trackNumber: 1,
        durationLabel: "2:18",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 2900,
        currency: "EUR",
        shortDescription: "Lead title sombre et frontal.",
        description:
          "Titre principal avec impact immediat, tension melodique et espace concu pour une topline rap ou hybride.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        bpm: 142,
        key: "F# minor",
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        ctaLabel: "Acheter le titre",
      },
      {
        id: "nova-midnight-run-track-02",
        artist: "nova",
        name: "No Signal",
        kind: "Track",
        trackNumber: 2,
        durationLabel: "2:41",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 2700,
        currency: "EUR",
        shortDescription: "Variation plus froide et plus aeree.",
        description:
          "Production tendue avec respiration plus large et bas du spectre tres controle.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        bpm: 140,
        key: "E minor",
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        ctaLabel: "Acheter le titre",
      },
      {
        id: "nova-midnight-run-track-03",
        artist: "nova",
        name: "Blue Static",
        kind: "Track",
        trackNumber: 3,
        durationLabel: "2:09",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 2500,
        currency: "EUR",
        shortDescription: "Track plus sec, plus editorial, plus nerveux.",
        description:
          "Un titre plus direct, avec drums compacts et lignes harmoniques tres lisibles.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        bpm: 144,
        key: "G minor",
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        ctaLabel: "Acheter le titre",
      },
      {
        id: "nova-midnight-run-track-04",
        artist: "nova",
        name: "Last Exit",
        kind: "Track",
        trackNumber: 4,
        durationLabel: "3:04",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 3200,
        currency: "EUR",
        shortDescription: "Final plus cinematographique et plus ample.",
        description:
          "Cloture plus ample avec textures larges et dynamique marquee pour visuels, trailers ou release premium.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        bpm: 138,
        key: "D# minor",
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        ctaLabel: "Acheter le titre",
      },
    ],
    editions: [
      {
        id: "nova-midnight-run-vinyl-preorder",
        artist: "nova",
        name: "Midnight Run Vinyl",
        kind: "Vinyl",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 4200,
        currency: "EUR",
        shortDescription: "Edition vinyle en precommande.",
        description:
          "Edition physique pensee comme objet editorial, avec livraison apres lancement de la fabrication.",
        includes: ["Vinyle 12 pouces", "Pochette premium", "Numero de lot"],
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        availability: "preorder",
        ctaLabel: "Precommander le vinyl",
        releaseLabel: "Expedition estimee: juillet 2026",
      },
      {
        id: "nova-midnight-run-cassette-preorder",
        artist: "nova",
        name: "Midnight Run Cassette",
        kind: "Cassette",
        image: "/images/brands/21-production/prod-1.jpg",
        priceCents: 2600,
        currency: "EUR",
        shortDescription: "Edition cassette en precommande.",
        description:
          "Edition compacte et collectible, proposee en precommande avant production finale.",
        includes: ["Cassette edition limitee", "J-card imprimee", "Numero de lot"],
        parentProductId: "nova-midnight-run",
        parentProductName: "Midnight Run",
        availability: "preorder",
        ctaLabel: "Precommander la cassette",
        releaseLabel: "Expedition estimee: juillet 2026",
      },
    ],
  },
  {
    id: "nova-afterglow-kit",
    artist: "nova",
    name: "Afterglow Chain",
    kind: "Album",
    image: "/images/contact/contact.jpg",
    priceCents: 6900,
    currency: "EUR",
    shortDescription:
      "Projet plus lumineux, structure en trois pistes, entre impact melodique et finition radio-edit.",
    description:
      "Afterglow Chain rassemble trois titres construits comme un ensemble court et coherent. L'album complet est pense pour ceux qui veulent une palette plus lumineuse, mais toujours precise et premium.",
    includes: [
      "Album complet en WAV premium",
      "Versions sans tag",
      "Stems principaux",
      "Licence de demonstration",
    ],
    preview: {
      durationLabel: "1:56",
    },
    tracks: [
      {
        id: "nova-afterglow-chain-track-01",
        artist: "nova",
        name: "Afterglow",
        kind: "Track",
        trackNumber: 1,
        durationLabel: "1:56",
        image: "/images/contact/contact.jpg",
        priceCents: 2400,
        currency: "EUR",
        shortDescription: "Ouverture plus brillante et plus frontale.",
        description:
          "Une entree directe, avec un contraste net entre texture et energie melodique.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        parentProductId: "nova-afterglow-kit",
        parentProductName: "Afterglow Chain",
        ctaLabel: "Acheter le titre",
      },
      {
        id: "nova-afterglow-chain-track-02",
        artist: "nova",
        name: "Glassline",
        kind: "Track",
        trackNumber: 2,
        durationLabel: "2:24",
        image: "/images/contact/contact.jpg",
        priceCents: 2300,
        currency: "EUR",
        shortDescription: "Titre plus net, plus sec, plus structure.",
        description:
          "Piste orientee precision avec arrangement compact et transitions rapides.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        parentProductId: "nova-afterglow-kit",
        parentProductName: "Afterglow Chain",
        ctaLabel: "Acheter le titre",
      },
      {
        id: "nova-afterglow-chain-track-03",
        artist: "nova",
        name: "Soft Circuit",
        kind: "Track",
        trackNumber: 3,
        durationLabel: "2:37",
        image: "/images/contact/contact.jpg",
        priceCents: 2500,
        currency: "EUR",
        shortDescription: "Sortie plus ample et plus aerienne.",
        description:
          "Final qui ouvre davantage l'espace et garde une finition tres propre.",
        includes: ["WAV stereo premium", "Version sans tag", "Licence piste unitaire"],
        parentProductId: "nova-afterglow-kit",
        parentProductName: "Afterglow Chain",
        ctaLabel: "Acheter le titre",
      },
    ],
    editions: [
      {
        id: "nova-afterglow-chain-vinyl-preorder",
        artist: "nova",
        name: "Afterglow Chain Vinyl",
        kind: "Vinyl",
        image: "/images/contact/contact.jpg",
        priceCents: 3800,
        currency: "EUR",
        shortDescription: "Edition vinyle en precommande.",
        description:
          "Vinyle de precommande avec fabrication lancee apres cloture de la fenetre de reservation.",
        includes: ["Vinyle 12 pouces", "Pochette premium", "Numero de lot"],
        parentProductId: "nova-afterglow-kit",
        parentProductName: "Afterglow Chain",
        availability: "preorder",
        ctaLabel: "Precommander le vinyl",
        releaseLabel: "Expedition estimee: aout 2026",
      },
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

export function getProductionProductById(productId: string) {
  return productionProducts.find((product) => product.id === productId);
}

export function getProductionCatalogItems(): ProductionSellable[] {
  return productionProducts.flatMap((product) => [
    product,
    ...(product.tracks ?? []),
    ...(product.editions ?? []),
  ]);
}

export function getProductionCatalogItemById(itemId: string) {
  return getProductionCatalogItems().find((item) => item.id === itemId);
}

export function getProductionStorefrontCategoryBySlug(
  slug: ProductionStorefrontCategorySlug,
) {
  return productionStorefrontCategories.find((category) => category.slug === slug);
}

export function getProductionStorefrontItems(
  artistSlug: string,
  categorySlug: ProductionStorefrontCategorySlug,
) {
  const artistProducts = productionProducts.filter(
    (product) => product.artist === artistSlug,
  );

  switch (categorySlug) {
    case "albums":
      return artistProducts.filter((product) => product.kind === "Album");
    case "tracks":
      return artistProducts.flatMap((product) => product.tracks ?? []);
    case "templates":
      return artistProducts.filter((product) => product.kind === "Template");
    case "midi":
      return artistProducts.filter(
        (product) => product.kind === "Chord Progression Pack",
      );
    case "loops":
      return [];
    case "drum-kits":
      return [];
  }
}
