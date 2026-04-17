import SplitShowcaseSection from "./SplitShowcaseSection";

export default function MaisonGrid() {
  return (
    <SplitShowcaseSection
      eyebrow="Les Maisons Zone 21"
      title="Notre Écosystème."
      paragraphs={[
        "Zone 21 n’est pas une entité figée. C’est un écosystème vivant, pensé comme un territoire d’expression, de création et d’influence.",
        "Chaque Maison y déploie sa vision, son langage, son rythme. Mode, expérience, culture et présence physique prolongent une même ambition.",
        "Au cœur de cet ensemble, une ligne demeure invariable : l’exigence absolue, la maîtrise du détail, et le refus de tout compromis.",
        "Zone 21 réunit des univers distincts, mais guidés par une même volonté : concevoir avec justesse, élever les standards, et inscrire chaque geste dans une vision plus large.",
      ]}
      imageSrc="/images/editorial/Ecosysteme.jpg"
      imageAlt="L'Écosystème Zone 21"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/ecosysteme"
      ctaLabel="Découvrir les Maisons"
      imageClassName="object-cover"
    />
  );
}
