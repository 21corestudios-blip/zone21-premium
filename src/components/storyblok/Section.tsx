import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";

import type { SectionBlok } from "@/lib/storyblok/types";

export default function Section({ blok }: { blok: SectionBlok }) {
  return (
    <section
      id={blok.sectionId}
      aria-label={blok.ariaLabel}
      className={blok.className}
      {...storyblokEditable(blok)}
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </section>
  );
}
