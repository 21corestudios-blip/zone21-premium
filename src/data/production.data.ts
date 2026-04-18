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
      "Le label et studio de ressources de Zone 21 pour beatmakers, DJs et artistes en mouvement.",
    image: "/images/brands/21-production/prod-1.jpg",
  },
  manifesto: [
    "21 Production accompagne les artistes avec une direction sonore exigeante, une mise en valeur editoriale et des outils pensés pour accélérer la création sans banaliser la signature.",
    "Le roster réunit des profils complémentaires: beatmakers, DJs, compositeurs et architectes du son, chacun avec son propre langage mais une même exigence de finition, de précision et d'impact.",
  ],
};
