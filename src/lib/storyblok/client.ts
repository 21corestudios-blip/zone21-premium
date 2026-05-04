import { storyblokInit } from "@storyblok/react/rsc";

import {
  storyblokComponents,
  UnknownBlock,
} from "@/lib/storyblok/component-registry";

let isInitialized = false;

function getRenderingToken() {
  return (
    process.env.STORYBLOK_PREVIEW_TOKEN ||
    process.env.STORYBLOK_PUBLIC_TOKEN ||
    "storyblok-local-fallback"
  );
}

export function registerStoryblokComponents() {
  if (isInitialized) {
    return;
  }

  storyblokInit({
    accessToken: getRenderingToken(),
    components: storyblokComponents,
    enableFallbackComponent: true,
    customFallbackComponent: UnknownBlock,
  });

  isInitialized = true;
}

registerStoryblokComponents();
