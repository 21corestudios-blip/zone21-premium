import Image from "next/image";
import { storyblokEditable } from "@storyblok/react/rsc";

import { resolveStoryblokAsset } from "@/lib/storyblok/asset";
import type { HeroBlok } from "@/lib/storyblok/types";

export default function Hero({ blok }: { blok: HeroBlok }) {
  const desktop = resolveStoryblokAsset(
    blok.imageDesktop || blok.image,
    blok.imageDesktopSrc || blok.imageSrc,
  );
  const mobile = resolveStoryblokAsset(
    blok.imageMobile || blok.imageDesktop || blok.image,
    blok.imageMobileSrc || blok.imageDesktopSrc || blok.imageSrc,
  );
  const desktopAlt = blok.imageDesktopAlt || blok.imageAlt || desktop.alt;
  const mobileAlt = blok.imageMobileAlt || blok.imageAlt || mobile.alt;

  if (!desktop.src && !mobile.src) {
    return null;
  }

  return (
    <section
      className="relative h-dvh min-h-screen w-full overflow-hidden bg-bg"
      {...storyblokEditable(blok)}
    >
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src={desktop.src}
          alt={desktopAlt}
          fill
          priority={blok.priority ?? true}
          quality={85}
          sizes="100vw"
          className="animate-image-reveal object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src={mobile.src}
          alt={mobileAlt}
          fill
          priority={blok.priority ?? true}
          quality={100}
          sizes="100vw"
          className="animate-image-reveal object-cover object-top"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-bg/10 to-bg/80 mix-blend-multiply" />

      {blok.title ? (
        <div className="absolute bottom-10 left-0 z-30 flex w-full justify-center px-6 md:bottom-16">
          <h1
            className="animate-fade-in-up whitespace-nowrap font-serif text-2xl font-light tracking-wide text-white drop-shadow-lg sm:text-3xl md:text-5xl lg:text-6xl"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            {blok.title}
          </h1>
        </div>
      ) : null}
    </section>
  );
}
