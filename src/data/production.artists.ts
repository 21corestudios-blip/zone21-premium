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
    slug: "heka",
    name: "Heka",
    role: "Beatmaker & Producteur exécutif",
    image: "/images/brands/21-production/z21-21-production-heka-grid.webp",
    heroImage: "/images/brands/21-production/z21-21-production-heka-hero.webp",
    tagline: "Grain brut, drums lourds, science du sample.",
    description:
      "Heka façonne des productions ancrées dans l’âge d’or du hip-hop, entre boucles poussiéreuses, breaks secs et présence frontale. Son univers s’adresse aux artistes qui cherchent une identité brute, crédible et intemporelle.",
    influences: ["Boom bap new-yorkais", "Hip-hop 90s", "Jazz rap brut"],
    signature: ["Drums claquants", "Samples organiques", "Groove frontal"],
  },
  {
    slug: "axion",
    name: "Axion",
    role: "Beatmaker & Producteur exécutif",
    image: "/images/brands/21-production/z21-21-production-axion-grid.webp",
    heroImage: "/images/brands/21-production/z21-21-production-axion-hero.webp",
    tagline: "R&B solaire, bounce premium, mélodies efficaces.",
    description:
      "Axion développe des productions entre R&B 90s/2000s, hip-hop radio et groove élégant. Son univers s’adresse aux artistes qui veulent des titres accessibles, chantables et immédiatement mémorables, sans perdre l’ADN street.",
    influences: ["R&B 90s/2000s", "Hip-hop radio", "New jack swing moderne"],
    signature: ["Bounce précis", "Hooks mélodiques", "Grooves lumineux"],
  },
  {
    slug: "nova",
    name: "Nova",
    role: "Beatmaker & Producteur exécutif",
    image: "/images/brands/21-production/z21-21-production-nova-grid.webp",
    heroImage: "/images/brands/21-production/z21-21-production-nova-hero.webp",
    tagline: "Soul abstraite, swing organique, textures analogiques.",
    description:
      "Nova compose des instrumentales inspirées du jazz rap, de la soul samplée et du hip-hop alternatif. Son univers s’adresse aux artistes qui recherchent une musicalité chaude, imparfaite et vivante, avec une profondeur émotionnelle forte.",
    influences: ["Jazz rap", "Soul samplée", "Hip-hop alternatif"],
    signature: ["Drums décalés", "Basslines chaudes", "Samples texturés"],
  },
];
