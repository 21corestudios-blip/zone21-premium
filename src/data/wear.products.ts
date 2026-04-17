export const wearStandardSizes = ["XS", "S", "M", "L", "XL"] as const;

export type WearProductSize = (typeof wearStandardSizes)[number];

export interface WearProduct {
  id: string;
  collection: string;
  name: string;
  image: string;
  priceCents: number;
  currency: "EUR";
  availableSizes: WearProductSize[];
  description: string;
}

export function isWearProductSize(value: string): value is WearProductSize {
  return wearStandardSizes.includes(value as WearProductSize);
}

export function formatWearPrice(
  priceCents: number,
  currency: WearProduct["currency"] = "EUR",
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function getWearProductById(productId: string) {
  return wearProducts.find((product) => product.id === productId);
}

export const wearProducts: WearProduct[] = [
  {
    id: "classic-tee-01",
    collection: "classic",
    name: "Classic Tee 01",
    image: "/images/brands/21-wear/01_classic_collection.jpg",
    priceCents: 12000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "T-shirt premium à coupe essentielle, pensé comme une base du vestiaire.",
  },
  {
    id: "classic-hoodie-01",
    collection: "classic",
    name: "Classic Hoodie 01",
    image: "/images/brands/21-wear/01_classic_collection.jpg",
    priceCents: 24000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Hoodie structuré aux volumes maîtrisés, dans l’esprit fondamental de la ligne.",
  },
  {
    id: "urban-jacket-01",
    collection: "urban",
    name: "Urban Jacket 01",
    image: "/images/brands/21-wear/02_urban_collection.jpg",
    priceCents: 32000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Veste à l’attitude urbaine, construite pour la présence et le mouvement.",
  },
  {
    id: "urban-pants-01",
    collection: "urban",
    name: "Urban Pants 01",
    image: "/images/brands/21-wear/02_urban_collection.jpg",
    priceCents: 21000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Pantalon fonctionnel et net, entre usage quotidien et silhouette affirmée.",
  },
  {
    id: "heritage-shirt-01",
    collection: "heritage",
    name: "Heritage Shirt 01",
    image: "/images/brands/21-wear/03_heritage_collection.jpg",
    priceCents: 19000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Chemise inspirée de lignes patrimoniales, revisitée dans une lecture contemporaine.",
  },
  {
    id: "heritage-coat-01",
    collection: "heritage",
    name: "Heritage Coat 01",
    image: "/images/brands/21-wear/03_heritage_collection.jpg",
    priceCents: 48000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Manteau signature, entre mémoire textile et rigueur de coupe.",
  },
  {
    id: "studio-layer-01",
    collection: "studio",
    name: "Studio Layer 01",
    image: "/images/brands/21-wear/03_studio_collection.jpg",
    priceCents: 26000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Pièce de superposition issue du laboratoire créatif de la maison.",
  },
  {
    id: "studio-trouser-01",
    collection: "studio",
    name: "Studio Trouser 01",
    image: "/images/brands/21-wear/03_studio_collection.jpg",
    priceCents: 23000,
    currency: "EUR",
    availableSizes: [...wearStandardSizes],
    description:
      "Pantalon de studio, pensé pour l’expérimentation des volumes et du mouvement.",
  },
];
