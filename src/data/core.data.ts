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
    title: "21 Core Studios",
    subtitle:
      "L'agence design et développement de Zone 21 pour les identités, les interfaces et les objets de marque.",
    image: "/images/brands/21-core/z21-21-core-studios-hero.webp",
  },
  manifesto: [
    "21 Core Studios conçoit des systèmes visuels et digitaux pour les marques qui veulent une présence forte, précise et durable. Direction artistique, design web, codage et graphisme y sont pensés comme un seul langage.",
    "Le studio intervient autant sur des prestations sur mesure que sur des objets prêts à activer: cadres, assets, kits marketing, templates et dispositifs pensés pour accélérer l'exécution sans dégrader le niveau de finition.",
  ],
};
