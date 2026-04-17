import SplitShowcaseSection from "./shared/SplitShowcaseSection";

export default function Zone05About() {
  return (
    <SplitShowcaseSection
      eyebrow="À Propos"
      title="Les Origines."
      paragraphs={[
        "Zone 21 est née d’une conviction profonde : les forces les plus puissantes émergent souvent dans des lieux que l’on raconte trop vite, alors qu’ils portent déjà une discipline, une intensité et une vision rares.",
        "Pensée comme une entité tournée vers la conception, la vision et la construction d’univers durables, Zone 21 transforme ces influences premières en langage, en esthétique et en structure.",
      ]}
      imageSrc="/images/a_propos/photo_texte.jpg"
      imageAlt="L'exigence Zone 21"
      imagePosition="right"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/a-propos"
      ctaLabel="Découvrir la Vision"
      imageClassName="object-cover"
    />
  );
}
