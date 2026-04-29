import { homeData } from "@/data/home.data";
import SplitShowcaseSection from "./SplitShowcaseSection";

export default function EditorialManifesto() {
  const { tagline, paragraphs, image } = homeData.manifesto;

  return (
    <SplitShowcaseSection
      eyebrow="Le Manifeste"
      title={tagline}
      paragraphs={paragraphs}
      imageSrc={image.src}
      imageAlt={image.alt}
      imagePosition="right"
      theme="light"
      sectionClassName="bg-white"
      imageClassName="object-contain bg-white p-8"
    />
  );
}
