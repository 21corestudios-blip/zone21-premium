import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";

import type { PageBlok } from "@/lib/storyblok/types";

export default function Page({ blok }: { blok: PageBlok }) {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
