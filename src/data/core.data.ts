export interface CoreHeroData {
  title: string;
  subtitle: string;
  image: string;
}

export interface CoreData {
  hero: CoreHeroData;
  manifesto: string[];
}

export const coreData: CoreData = {
  hero: {
    title: "La Structure de la Marque",
    subtitle:
      "Le studio créatif de ARCANE pour les identités, les interfaces, la direction artistique et les systèmes de marque.",
    image: "/images/brands/21-core/z21-21-core-studios-hero.webp",
  },
  manifesto: [
    "CS73 conçoit des identités visuelles, des interfaces et des systèmes digitaux pour les marques qui veulent une présence forte, précise et durable. Direction artistique, design web, code et graphisme y parlent le même langage.",
    "Le studio produit des cadres, des assets, des kits activables, des templates et des dispositifs de marque prêts à tenir. Chaque objet sert une direction claire, sans dégrader le niveau de finition.",
  ],
};
