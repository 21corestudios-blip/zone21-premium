export interface WearProduct {
  id: string;
  collection: string;
  name: string;
  image: string;
  price: string;
  description: string;
}

export const wearProducts: WearProduct[] = [
  {
    id: "classic-tee-01",
    collection: "classic",
    name: "Classic Tee 01",
    image: "/images/brands/21-wear/01_classic_collection.jpg",
    price: "€120",
    description:
      "T-shirt premium à coupe essentielle, pensé comme une base du vestiaire.",
  },
  {
    id: "classic-hoodie-01",
    collection: "classic",
    name: "Classic Hoodie 01",
    image: "/images/brands/21-wear/01_classic_collection.jpg",
    price: "€240",
    description:
      "Hoodie structuré aux volumes maîtrisés, dans l’esprit fondamental de la ligne.",
  },
  {
    id: "urban-jacket-01",
    collection: "urban",
    name: "Urban Jacket 01",
    image: "/images/brands/21-wear/02_urban_collection.jpg",
    price: "€320",
    description:
      "Veste à l’attitude urbaine, construite pour la présence et le mouvement.",
  },
  {
    id: "urban-pants-01",
    collection: "urban",
    name: "Urban Pants 01",
    image: "/images/brands/21-wear/02_urban_collection.jpg",
    price: "€210",
    description:
      "Pantalon fonctionnel et net, entre usage quotidien et silhouette affirmée.",
  },
  {
    id: "heritage-shirt-01",
    collection: "heritage",
    name: "Heritage Shirt 01",
    image: "/images/brands/21-wear/03_heritage_collection.jpg",
    price: "€190",
    description:
      "Chemise inspirée de lignes patrimoniales, revisitée dans une lecture contemporaine.",
  },
  {
    id: "heritage-coat-01",
    collection: "heritage",
    name: "Heritage Coat 01",
    image: "/images/brands/21-wear/03_heritage_collection.jpg",
    price: "€480",
    description:
      "Manteau signature, entre mémoire textile et rigueur de coupe.",
  },
  {
    id: "studio-layer-01",
    collection: "studio",
    name: "Studio Layer 01",
    image: "/images/brands/21-wear/03_studio_collection.jpg",
    price: "€260",
    description:
      "Pièce de superposition issue du laboratoire créatif de la maison.",
  },
  {
    id: "studio-trouser-01",
    collection: "studio",
    name: "Studio Trouser 01",
    image: "/images/brands/21-wear/03_studio_collection.jpg",
    price: "€230",
    description:
      "Pantalon de studio, pensé pour l’expérimentation des volumes et du mouvement.",
  },
];
