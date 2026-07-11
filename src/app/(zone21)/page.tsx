import type { Metadata } from "next";

import PreviewToolbar from "@/components/storyblok/PreviewToolbar";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import { homeStoryFallback } from "@/data/storyblok/home.story";
import { createMetadata } from "@/lib/seo/createMetadata";
import { getStoryblokStory } from "@/lib/storyblok/api";

export const metadata: Metadata = createMetadata({
  title: "Maison créative indépendante premium",
  socialTitle: "ARCANE | Maison créative indépendante premium",
  description:
    "ARCANE, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
  path: "/",
  image: {
    url: "/images/home/hero/z21-home-hero-main-01-desktop-7.webp",
    width: 2048,
    height: 1136,
    alt: "ARCANE - maison créative indépendante premium",
  },
});

export default async function HomePage() {
  const { story, version } = await getStoryblokStory("home", homeStoryFallback);

  return (
    <main className="flex min-h-screen w-full flex-col bg-paper selection:bg-bg selection:text-paper">
      <PreviewToolbar enabled={version === "draft"} />
      <StoryblokRenderer story={story} />
    </main>
  );
}
