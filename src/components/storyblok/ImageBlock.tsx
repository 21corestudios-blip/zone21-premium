import Image from "next/image";
import { storyblokEditable } from "@storyblok/react/rsc";

import { resolveStoryblokAsset } from "@/lib/storyblok/asset";
import type { ImageBlockBlok } from "@/lib/storyblok/types";

export default function ImageBlock({ blok }: { blok: ImageBlockBlok }) {
  const image = resolveStoryblokAsset(blok.image, blok.src);
  const alt = blok.alt ?? image.alt;

  if (!image.src) {
    return null;
  }

  if (blok.layout === "contained") {
    return (
      <section className="w-full bg-white px-6 py-16 md:px-12" {...storyblokEditable(blok)}>
        <div className="relative mx-auto aspect-[4/5] max-w-5xl overflow-hidden md:aspect-[16/9]">
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className={blok.imageClassName || "object-cover object-center"}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative h-dvh min-h-screen w-full overflow-hidden ${
        blok.backgroundClassName || "bg-white"
      }`}
      aria-hidden={alt === "" ? "true" : undefined}
      {...storyblokEditable(blok)}
    >
      <Image
        src={image.src}
        alt={alt}
        fill
        className={blok.imageClassName || "object-cover object-center"}
        sizes="100vw"
      />
      {blok.overlayClassName ? (
        <div
          className={`pointer-events-none absolute inset-0 ${blok.overlayClassName}`}
        />
      ) : null}
    </section>
  );
}
