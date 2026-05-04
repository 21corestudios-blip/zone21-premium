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
      "L'agence de promotion de talents et d'influence de ZONE 21, dédiée aux profils qui construisent une présence forte sur les réseaux et au-delà.",
    image: "/images/brands/21-talents/z21-21-talents-agency-hero-1.webp",
  },
  manifesto: [
    "21 Talents Agency accompagne les talents, influenceurs et personnalités créatives dans la structuration de leur image publique, de leur présence éditoriale et de leurs opportunités de marque.",
    "L'agence intervient sur la représentation, les campagnes, les collaborations et la mise en relation avec les maisons. Les formats activables font grandir la visibilité sans banaliser la signature.",
  ],
};
