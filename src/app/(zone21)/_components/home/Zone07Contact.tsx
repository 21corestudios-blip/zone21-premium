import SplitShowcaseSection from "./shared/SplitShowcaseSection";

export default function Zone07Contact() {
  return (
    <SplitShowcaseSection
      eyebrow="Contact"
      title="Entrer dans la Zone."
      paragraphs={[
        "Pour une collaboration, une demande de création sur mesure ou toute question concernant nos univers, Zone 21 reçoit chaque prise de contact avec exigence, discrétion et attention.",
        "Chaque échange ouvre un espace de travail où la direction artistique, la stratégie et la production avancent avec une même précision.",
      ]}
      imageSrc="/images/contact/contact 2.jpg"
      imageAlt="Studio Zone 21"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/contact"
      ctaLabel="Nous Contacter"
      imageClassName="object-cover"
    />
  );
}
