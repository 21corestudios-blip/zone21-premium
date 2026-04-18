export interface TalentDivision {
  slug: string;
  name: string;
  role: string;
  image: string;
  heroImage: string;
  tagline: string;
  description: string;
  focus: string[];
  signature: string[];
}

export function getTalentDivisionBySlug(divisionSlug: string) {
  return talentDivisions.find((division) => division.slug === divisionSlug);
}

export const talentDivisions: TalentDivision[] = [
  {
    slug: "fashion-luxury",
    name: "Fashion & Luxury",
    role: "Talents mode, beauté et image premium",
    image: "/images/contact/contact.jpg",
    heroImage: "/images/contact/contact.jpg",
    tagline: "Présences éditoriales, maisons de mode et collaborations désirables.",
    description:
      "Le pôle Fashion & Luxury développe les profils qui évoluent dans les univers mode, beauté et image premium. L'accompagnement porte autant sur le positionnement que sur la qualité des collaborations et la cohérence de présence.",
    focus: [
      "Mode & beauté",
      "Campagnes premium",
      "Image éditoriale",
    ],
    signature: [
      "Présence raffinée",
      "Sélection exigeante",
      "Alignement marque-profil",
    ],
  },
  {
    slug: "lifestyle-hospitality",
    name: "Lifestyle & Hospitality",
    role: "Talents lifestyle, food, travel et hôtellerie",
    image: "/images/editorial/manifesto-vision.jpg",
    heroImage: "/images/editorial/manifesto-vision.jpg",
    tagline: "Récits de vie, destinations, lieux et expériences à forte désirabilité.",
    description:
      "Le pôle Lifestyle & Hospitality accompagne les profils qui incarnent des expériences, des lieux et des styles de vie. L'objectif est de créer une présence crédible, aspirante et stable dans le temps.",
    focus: [
      "Travel & hospitality",
      "Food & lifestyle",
      "Brand storytelling",
    ],
    signature: [
      "Récits immersifs",
      "Présence douce mais forte",
      "Curation de partenariats",
    ],
  },
  {
    slug: "sport-performance",
    name: "Sport & Performance",
    role: "Athlètes, coachs et profils orientés discipline & performance",
    image: "/images/home/hero/campaign-spring-26-hero.jpg",
    heroImage: "/images/home/hero/campaign-spring-26-hero.jpg",
    tagline: "Visibilité maîtrisée, partenariats cohérents et narration de parcours.",
    description:
      "Le pôle Sport & Performance structure les profils liés au mouvement, à la discipline, au dépassement et à la pédagogie. L'accompagnement vise à transformer l'audience en positionnement durable.",
    focus: [
      "Athlètes & coachs",
      "Partenariats de performance",
      "Narration de parcours",
    ],
    signature: [
      "Présence crédible",
      "Tonalité maîtrisée",
      "Activation ciblée",
    ],
  },
  {
    slug: "culture-digital",
    name: "Culture & Digital",
    role: "Créateurs, streamers, entertainers et profils culture web",
    image: "/images/brands/21-production/prod-1.jpg",
    heroImage: "/images/brands/21-production/prod-1.jpg",
    tagline: "Audience, formats, collaborations et activation culturelle.",
    description:
      "Le pôle Culture & Digital accompagne les talents qui vivent dans les formats sociaux, la vidéo, le divertissement et les nouvelles cultures créatives. L'approche cherche l'impact sans dilution de personnalité.",
    focus: [
      "Créateurs & entertainers",
      "Formats sociaux",
      "Partenariats culturels",
    ],
    signature: [
      "Lecture des usages",
      "Signature forte",
      "Rythme éditorial",
    ],
  },
];
