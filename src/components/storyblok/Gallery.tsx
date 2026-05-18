import Image from "next/image";
import { storyblokEditable } from "@storyblok/react/rsc";

import { resolveStoryblokAsset } from "@/lib/storyblok/asset";
import type { GalleryBlok } from "@/lib/storyblok/types";

export default function Gallery({ blok }: { blok: GalleryBlok }) {
  const images = blok.images || [];
  const columns = blok.columns || 3;

  if (!images.length) {
    return null;
  }

  return (
    <section className="w-full bg-white px-6 py-16 md:px-12" {...storyblokEditable(blok)}>
      <div
        className={`grid gap-4 ${
          columns === 4
            ? "md:grid-cols-4"
            : columns === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
        }`}
      >
        {images.map((asset) => {
          const image = resolveStoryblokAsset(asset);

          return (
            <div
              className="relative aspect-[4/5] overflow-hidden bg-bg"
              key={image.src}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
