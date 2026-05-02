import SplitShowcaseSection from "./shared/SplitShowcaseSection";

export default function Zone07Contact() {
  return (
    <SplitShowcaseSection
      eyebrow="Contact"
      title="Entrer dans la Zone."
      paragraphs={[
        "Une collaboration commence rarement par un formulaire. Elle commence par une intention claire, une idée à cadrer, une présence à construire ou un univers à faire exister avec justesse.",
        "ZONE 21 reçoit chaque prise de contact avec exigence, discrétion et attention. Demande de création sur mesure, projet éditorial, direction artistique, image, musique, talent ou développement de marque : chaque échange est traité comme un point d’entrée sérieux.",
        "Entrer dans la Zone, c’est ouvrir un espace de travail où la vision, la stratégie et la production avancent ensemble. Avec précision, avec tenue, et avec le souci de créer quelque chose qui garde sa force dans le temps.",
      ]}
      imageSrc="/images/home/z21-home-zone-7-contact-1.webp"
      imageAlt="Entrer dans la Zone 21"
      imagePosition="left"
      theme="light"
      sectionClassName="bg-white"
      ctaHref="/contact"
      ctaLabel="Entrer en contact"
      imageClassName="object-cover object-[center_10%]"
    />
  );
}
