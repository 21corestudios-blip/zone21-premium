import type { Metadata } from "next";

import PreviewToolbar from "@/components/storyblok/PreviewToolbar";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import { homeStoryFallback } from "@/data/storyblok/home.story";
import { getStoryblokStory } from "@/lib/storyblok/api";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "ZONE 21 trace une direction hors tendance, entre maison créative, vêtement premium, image, musique, production, talents et narration.",
  openGraph: {
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "Une maison créative indépendante pour des univers cohérents entre culture street, image, vêtement, musique, production et narration.",
    url: "/",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "Un territoire hors tendance, dans la bonne direction, entre culture street, image, vêtement, musique, production et narration.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const { story, version } = await getStoryblokStory("home", homeStoryFallback);

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#F7F5F0] selection:bg-[#121110] selection:text-[#F7F5F0]">
      <PreviewToolbar enabled={version === "draft"} />
      <StoryblokRenderer story={story} />
    </main>
  );
}
