import { storyblokEditable } from "@storyblok/react/rsc";

import { resolveStoryblokAsset } from "@/lib/storyblok/asset";
import type { AudioBlockBlok } from "@/lib/storyblok/types";

export default function AudioBlock({ blok }: { blok: AudioBlockBlok }) {
  const audio = resolveStoryblokAsset(blok.audio, blok.src);

  if (!audio.src) {
    return null;
  }

  return (
    <section
      className="w-full bg-bg px-6 py-16 text-text md:px-12"
      {...storyblokEditable(blok)}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {blok.title ? (
          <h2 className="font-serif text-4xl leading-[1.02]">{blok.title}</h2>
        ) : null}
        <audio controls className="w-full" src={audio.src}>
          <track kind="captions" />
        </audio>
        {blok.caption ? (
          <p className="font-sans text-sm font-light text-white/58">
            {blok.caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
