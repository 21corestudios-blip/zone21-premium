import { storyblokEditable } from "@storyblok/react/rsc";

import ManifestoOverlayContent from "@/app/(zone21)/_components/home/shared/ManifestoOverlayContent";
import { resolveStoryblokAsset, resolveStoryblokLink } from "@/lib/storyblok/asset";
import type { ManifestoBlockBlok } from "@/lib/storyblok/types";

export default function ManifestoBlock({ blok }: { blok: ManifestoBlockBlok }) {
  const image = resolveStoryblokAsset(blok.image, blok.imageSrc);

  if (!image.src) {
    return null;
  }

  return (
    <div
      className="w-full overflow-hidden bg-bg"
      {...storyblokEditable(blok)}
    >
      <ManifestoOverlayContent
        eyebrow={blok.eyebrow || "Le Manifeste"}
        title={blok.title || ""}
        paragraphs={blok.paragraphs || []}
        imageSrc={image.src}
        imageAlt={blok.imageAlt ?? image.alt}
        ctaHref={resolveStoryblokLink(blok.cta, blok.ctaHref)}
        ctaLabel={blok.ctaLabel}
      />
    </div>
  );
}
