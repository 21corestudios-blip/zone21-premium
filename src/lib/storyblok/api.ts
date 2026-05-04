import { draftMode } from "next/headers";

import type {
  PageBlok,
  StoryblokStoryResult,
  StoryblokVersion,
} from "@/lib/storyblok/types";

const DEFAULT_STORYBLOK_API_BASE_URL = "https://api.storyblok.com";

function hasStoryblokToken() {
  return Boolean(
    process.env.STORYBLOK_PUBLIC_TOKEN || process.env.STORYBLOK_PREVIEW_TOKEN,
  );
}

function getAccessToken(version: StoryblokVersion) {
  if (version === "draft") {
    return (
      process.env.STORYBLOK_PREVIEW_TOKEN || process.env.STORYBLOK_PUBLIC_TOKEN
    );
  }

  return process.env.STORYBLOK_PUBLIC_TOKEN;
}

function normalizeStorySlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, "") || "home";
}

export function isStoryblokConfigured() {
  return hasStoryblokToken();
}

export async function getStoryblokVersion(): Promise<StoryblokVersion> {
  if (!hasStoryblokToken()) {
    return "published";
  }

  const { isEnabled } = await draftMode();
  return isEnabled ? "draft" : "published";
}

export async function getStoryblokStory<Content = PageBlok>(
  slug: string,
  fallbackStory: StoryblokStoryResult<Content>["story"],
): Promise<StoryblokStoryResult<Content>> {
  const version = await getStoryblokVersion();
  const token = getAccessToken(version);

  if (!token) {
    return {
      story: fallbackStory,
      source: "local-fallback",
      version,
    };
  }

  try {
    const storySlug = normalizeStorySlug(slug)
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const url = new URL(
      `/v2/cdn/stories/${storySlug}`,
      process.env.STORYBLOK_API_BASE_URL || DEFAULT_STORYBLOK_API_BASE_URL,
    );

    url.searchParams.set("version", version);
    url.searchParams.set("token", token);
    url.searchParams.set("resolve_links", "url");

    const response = await fetch(url, {
      cache: version === "draft" ? "no-store" : "force-cache",
      next: version === "published" ? { revalidate: 300 } : undefined,
    });

    if (!response.ok) {
      throw new Error(`Storyblok responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      story?: StoryblokStoryResult<Content>["story"];
    };

    if (!payload.story?.content) {
      throw new Error("Storyblok story payload is empty");
    }

    return {
      story: payload.story,
      source: "storyblok",
      version,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[storyblok] Falling back to local content for "${slug}":`,
        error,
      );
    }

    return {
      story: fallbackStory,
      source: "local-fallback",
      version,
    };
  }
}
