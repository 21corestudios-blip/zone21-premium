export interface ProductionArtist {
  slug: string;
  name: string;
  role: string;
  image: string;
  heroImage: string;
  tagline: string;
  description: string;
  influences: string[];
  signature: string[];
}

export function getProductionArtistBySlug(artistSlug: string) {
  return productionArtists.find((artist) => artist.slug === artistSlug);
}

export const productionArtists: ProductionArtist[] = [
  {
    slug: "nova",
    name: "Nova",
    role: "Beatmaker & Producteur executif",
    image: "/images/brands/21-production/prod-1.jpg",
    heroImage: "/images/brands/21-production/prod-1.jpg",
    tagline: "Textures nocturnes, precision melodique, impact editorial.",
    description:
      "Nova construit des instrumentales entre tension cinematographique, low-end maitrise et lignes melodiques nettes. Son univers s'adresse aux artistes qui veulent une direction forte, contemporaine et immediate.",
    influences: ["Trap editoriale", "R&B alternatif", "Electronica sombre"],
    signature: ["Drums denses", "Atmospheres larges", "Transitions ciselees"],
  },
  {
    slug: "elya",
    name: "Elya",
    role: "DJ, Curatrice & Sound Architect",
    image: "/images/editorial/manifesto-vision.jpg",
    heroImage: "/images/editorial/manifesto-vision.jpg",
    tagline: "Club culture, elegance froide et mouvement continu.",
    description:
      "Elya developpe des selections et des outils de production penses pour la scene, le contenu et les performances immersives. Sa ligne melange pulsation, finesse et sens du crescendo.",
    influences: ["Afro house", "Electronique hybride", "Performance live"],
    signature: ["Grooves progressifs", "Edits efficaces", "Build-ups fluides"],
  },
  {
    slug: "kael",
    name: "Kael",
    role: "Compositeur, Sound Designer & Arrangeur",
    image: "/images/a_propos/en-tete.jpg",
    heroImage: "/images/a_propos/en-tete.jpg",
    tagline: "Harmonie moderne, details texturaux et narration musicale.",
    description:
      "Kael imagine des banques harmoniques, templates de production et outils de composition destines aux artistes, beatmakers et studios qui recherchent de la matiere exploitable rapidement sans perdre en identite.",
    influences: ["Neo soul", "Film scoring", "Pop experimentale"],
    signature: ["Accords premium", "Templates propres", "Design sonore subtil"],
  },
];
