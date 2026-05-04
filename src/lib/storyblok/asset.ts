import type { StoryblokAsset, StoryblokLink } from "./types";

export function resolveStoryblokAsset(
  asset?: StoryblokAsset,
  fallbackSrc = "",
): { src: string; alt: string } {
  return {
    src: asset?.filename || fallbackSrc,
    alt: asset?.alt || asset?.name || "",
  };
}

export function resolveStoryblokLink(link?: StoryblokLink, fallbackHref = "") {
  if (link?.url) {
    return link.url;
  }

  if (link?.cached_url) {
    return link.cached_url.startsWith("/")
      ? link.cached_url
      : `/${link.cached_url}`;
  }

  return fallbackHref;
}
