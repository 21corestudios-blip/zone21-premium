import {
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";

import type { RichTextBlok } from "@/lib/storyblok/types";

export default function RichText({ blok }: { blok: RichTextBlok }) {
  if (!blok.body) {
    return null;
  }

  return (
    <section
      className="w-full bg-white px-6 py-20 text-bg md:px-12 md:py-24"
      {...storyblokEditable(blok)}
    >
      <div className="mx-auto max-w-3xl font-sans text-base font-light leading-[1.9] text-bg/72">
        <StoryblokServerRichText doc={blok.body} />
      </div>
    </section>
  );
}
