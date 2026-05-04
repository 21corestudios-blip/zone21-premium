import { storyblokEditable } from "@storyblok/react/rsc";

import SplitShowcaseSection from "@/app/(zone21)/_components/home/shared/SplitShowcaseSection";
import { resolveStoryblokAsset, resolveStoryblokLink } from "@/lib/storyblok/asset";
import type { BrandIntroBlok } from "@/lib/storyblok/types";

export default function BrandIntro({ blok }: { blok: BrandIntroBlok }) {
  const image = resolveStoryblokAsset(blok.image, blok.imageSrc);

  if (!image.src) {
    return null;
  }

  return (
    <div {...storyblokEditable(blok)}>
      <SplitShowcaseSection
        eyebrow={blok.eyebrow || ""}
        title={blok.title || ""}
        paragraphs={blok.paragraphs || []}
        imageSrc={image.src}
        imageAlt={blok.imageAlt ?? image.alt}
        imagePosition={blok.imagePosition || "left"}
        theme={blok.theme || "light"}
        sectionClassName={blok.sectionClassName || "bg-white"}
        ctaHref={resolveStoryblokLink(blok.cta, blok.ctaHref)}
        ctaLabel={blok.ctaLabel}
        imageClassName={blok.imageClassName || "object-cover"}
      />
    </div>
  );
}
