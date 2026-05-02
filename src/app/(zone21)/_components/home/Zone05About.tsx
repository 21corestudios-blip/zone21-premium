import SplitShowcaseSection from "./shared/SplitShowcaseSection";

export default function Zone05About() {
  return (
    <SplitShowcaseSection
      eyebrow="À Propos"
      title="Les Origines."
      paragraphs={[
        "ZONE 21 prend forme autour de figures fondatrices. Elena Davalon, Naya Delmare et Heka ne sont pas de simples personnages : ils incarnent les premières forces de la maison. L’image, la silhouette, le son, la présence et le récit.",
        "À travers eux, ZONE 21 installe ses racines : une culture urbaine assumée, un héritage hip-hop et RnB, une attention au vêtement, au rythme, au détail et aux signes capables de durer.",
        "De cette base naît un territoire créatif plus large. Une maison pensée pour relier les univers sans les confondre, construire des lignes fortes et donner à chaque projet une présence reconnaissable.",
      ]}
      imageSrc="/images/home/z21-home-zone-5-about-6.webp"
      imageAlt="Figures fondatrices de ZONE 21"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/a-propos"
      ctaLabel="Découvrir les origines"
      imageClassName="object-cover object-[center_5%]"
    />
  );
}
