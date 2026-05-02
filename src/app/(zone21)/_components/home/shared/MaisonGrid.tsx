import SplitShowcaseSection from "./SplitShowcaseSection";

export default function MaisonGrid() {
  return (
    <SplitShowcaseSection
      eyebrow="Les Maisons Zone 21"
      title="Des signatures distinctes. Une même culture."
      paragraphs={[
        "ZONE 21 rassemble des maisons qui ne racontent pas la même chose, mais parlent depuis les mêmes racines : la rue, l’image, le son, le vêtement, le geste juste.",
        "21 WEAR travaille la silhouette. 21 CORE STUDIOS façonne les identités. 21 PRODUCTION porte le son et les artistes. 21 TALENTS AGENCY donne corps aux présences qui incarnent l’époque.",
        "Chaque maison avance avec son langage, son rythme et son territoire. Ensemble, elles composent une marque-monde : culturelle, urbaine, précise, pensée pour durer sans perdre sa tension.",
      ]}
      imageSrc="/images/editorial/z21-home-ecosysteme-01-5.webp"
      imageAlt="Les Maisons Zone 21"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/ecosysteme"
      ctaLabel="Découvrir les Maisons"
      imageClassName="object-cover object-[center_5%]"
    />
  );
}
