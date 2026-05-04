export interface ProductionHeroData {
  title: string;
  subtitle: string;
  image: string;
}

export interface ProductionData {
  hero: ProductionHeroData;
  manifesto: string[];
}

export const productionData: ProductionData = {
  hero: {
    title: "21 Production",
    subtitle:
      "Le label et studio de ressources de ZONE 21 pour beatmakers, DJs, artistes et signatures sonores en mouvement.",
    image: "/images/brands/21-production/z21-21-production-hero.webp",
  },
  manifesto: [
    "21 Production accompagne les artistes avec une direction sonore exigeante, une identité artistique tenue et une mise en valeur éditoriale précise. Les outils accélèrent la création sans banaliser la signature.",
    "Le roster réunit des profils complémentaires: beatmakers, DJs, compositeurs et architectes du son. Chacun porte son langage, avec la même exigence de finition, d'impact et de précision.",
  ],
};
