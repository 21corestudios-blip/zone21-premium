export interface TalentsHeroData {
  title: string;
  subtitle: string;
  image: string;
}

export interface TalentsData {
  hero: TalentsHeroData;
  manifesto: string[];
}

export const talentsData: TalentsData = {
  hero: {
    title: "21 Talents Agency",
    subtitle:
      "L'agence de promotion de talents et d'influence de Zone 21, dédiée aux profils qui construisent une présence forte sur les réseaux et au-delà.",
    image: "/images/contact/contact 2.jpg",
  },
  manifesto: [
    "21 Talents Agency accompagne les talents, influenceurs et personnalités créatives dans la structuration de leur image, de leur présence éditoriale et de leurs opportunités de marque.",
    "L'agence intervient sur la représentation, les campagnes, la mise en relation avec les maisons, et des formats activables pensés pour faire grandir une visibilité sans banaliser la signature.",
  ],
};
