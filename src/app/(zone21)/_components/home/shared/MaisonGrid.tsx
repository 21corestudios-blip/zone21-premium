import SplitShowcaseSection from "./SplitShowcaseSection";

export default function MaisonGrid() {
  return (
    <SplitShowcaseSection
      eyebrow="Les Maisons ARCANE"
      title="Des signatures distinctes. Une même culture."
      paragraphs={[
        "ARCANE rassemble des maisons qui ne racontent pas la même chose, mais parlent depuis les mêmes racines : la rue, l’image, le son, le vêtement, le geste juste.",
        "21 Wear travaille la silhouette. Core Studios façonne les identités. BACKSPIN porte le son et les artistes. EKKO donne corps aux présences qui incarnent l’époque.",
        "Chaque maison avance avec son langage, son rythme et son territoire. Ensemble, elles composent une marque-monde : culturelle, urbaine, précise, pensée pour durer sans perdre sa tension.",
      ]}
      imageSrc="/images/editorial/z21-home-ecosysteme-01-5.webp"
      imageAlt="Les Maisons ARCANE"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/ecosysteme"
      ctaLabel="Découvrir les Maisons"
      imageClassName="object-cover object-[center_5%]"
    />
  );
}
