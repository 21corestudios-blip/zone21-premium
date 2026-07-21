import type { Metadata } from "next";

import PreviewToolbar from "@/components/storyblok/PreviewToolbar";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import { homeData } from "@/data/home.data";
import { homeStoryFallback } from "@/data/storyblok/home.story";
import { getStoryblokStory } from "@/lib/storyblok/api";

export const metadata: Metadata = {
  title: "Maison créative indépendante premium",
  description:
    "ARCANE, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
  openGraph: {
    title: "ARCANE | Maison créative indépendante premium",
    description:
      "ARCANE, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
    url: "/",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: homeData.hero.seoImage.src,
        width: 2048,
        height: 1136,
        alt: homeData.hero.seoImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCANE | Maison créative indépendante premium",
    description:
      "ARCANE, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
    images: [
      {
        url: homeData.hero.seoImage.src,
        alt: homeData.hero.seoImage.alt,
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const { story, version } = await getStoryblokStory("home", homeStoryFallback);

  return (
    <main className="flex min-h-screen w-full flex-col bg-paper selection:bg-bg selection:text-paper">
      <PreviewToolbar enabled={version === "draft"} />
      <StoryblokRenderer story={story} />
    </main>
  );
}
