import { StoryblokStory } from "@storyblok/react/rsc";
import type { ISbStoryData } from "@storyblok/react/rsc";

import { registerStoryblokComponents } from "@/lib/storyblok/client";

export default function StoryblokRenderer({
  story,
}: {
  story: ISbStoryData;
}) {
  registerStoryblokComponents();

  return <StoryblokStory story={story} />;
}
