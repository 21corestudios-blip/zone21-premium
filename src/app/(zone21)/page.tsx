import type { Metadata } from "next";

import PreviewToolbar from "@/components/storyblok/PreviewToolbar";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import { homeStoryFallback } from "@/data/storyblok/home.story";
import { getStoryblokStory } from "@/lib/storyblok/api";

export const metadata: Metadata = {
  title: "Maison créative indépendante premium",
  description:
    "ZONE 21, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
  openGraph: {
    title: "ZONE 21 | Maison créative indépendante premium",
    description:
      "ZONE 21, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
    url: "/",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/home/hero/z21-home-hero-main-01-desktop-7.webp",
        width: 2048,
        height: 1136,
        alt: "ZONE 21 - maison créative indépendante premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 21 | Maison créative indépendante premium",
    description:
      "ZONE 21, maison créative indépendante, relie vêtement premium, image, musique, production et talents dans un écosystème culturel exigeant et cohérent.",
    images: [
      {
        url: "/images/home/hero/z21-home-hero-main-01-desktop-7.webp",
        alt: "ZONE 21 - maison créative indépendante premium",
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
    <main className="flex min-h-screen w-full flex-col bg-[#F7F5F0] selection:bg-[#121110] selection:text-[#F7F5F0]">
      <PreviewToolbar enabled={version === "draft"} />
      <StoryblokRenderer story={story} />
    </main>
  );
}
