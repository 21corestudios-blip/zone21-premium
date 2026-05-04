import type {
  ISbStoryData,
  SbBlokData,
  StoryblokRichTextNode,
} from "@storyblok/react/rsc";
import type { ReactElement } from "react";

export type StoryblokVersion = "draft" | "published";

export type StoryblokSource = "storyblok" | "local-fallback";

export interface StoryblokAsset {
  filename?: string;
  alt?: string;
  name?: string;
  focus?: string;
}

export interface StoryblokLink {
  cached_url?: string;
  url?: string;
  linktype?: string;
  target?: string;
}

export type Z21Blok<ComponentName extends string, Fields = object> =
  SbBlokData & {
    _uid: string;
    component: ComponentName;
  } & Fields;

export interface StoryblokStoryResult<Content = PageBlok> {
  story: ISbStoryData<Content>;
  source: StoryblokSource;
  version: StoryblokVersion;
}

export type PageBlok = Z21Blok<
  "page",
  {
    body?: SbBlokData[];
  }
>;

export type SectionBlok = Z21Blok<
  "section",
  {
    body?: SbBlokData[];
    sectionId?: string;
    ariaLabel?: string;
    className?: string;
  }
>;

export type HeroBlok = Z21Blok<
  "hero",
  {
    title?: string;
    image?: StoryblokAsset;
    imageDesktop?: StoryblokAsset;
    imageMobile?: StoryblokAsset;
    imageSrc?: string;
    imageDesktopSrc?: string;
    imageMobileSrc?: string;
    imageAlt?: string;
    imageDesktopAlt?: string;
    imageMobileAlt?: string;
    priority?: boolean;
    variant?: "home" | "brand" | "editorial";
  }
>;

export type ParagraphBlok = Z21Blok<
  "paragraph",
  {
    eyebrow?: string;
    title?: string;
    text?: string;
    paragraphs?: string[];
    theme?: "light" | "dark";
  }
>;

export type RichTextBlok = Z21Blok<
  "richText",
  {
    body?: StoryblokRichTextNode<ReactElement>;
  }
>;

export type ImageBlockBlok = Z21Blok<
  "imageBlock",
  {
    image?: StoryblokAsset;
    src?: string;
    alt?: string;
    layout?: "immersive" | "contained";
    imageClassName?: string;
    overlayClassName?: string;
    backgroundClassName?: string;
  }
>;

export type GalleryBlok = Z21Blok<
  "gallery",
  {
    images?: StoryblokAsset[];
    columns?: 2 | 3 | 4;
  }
>;

export type AudioBlockBlok = Z21Blok<
  "audioBlock",
  {
    title?: string;
    audio?: StoryblokAsset;
    src?: string;
    caption?: string;
  }
>;

export type CtaBlok = Z21Blok<
  "cta",
  {
    label?: string;
    href?: string;
    link?: StoryblokLink;
  }
>;

export type ManifestoBlockBlok = Z21Blok<
  "manifestoBlock",
  SplitEditorialFields
>;

export type BrandIntroBlok = Z21Blok<"brandIntro", SplitEditorialFields>;

export type ProductEditorialBlok = Z21Blok<
  "productEditorial",
  SplitEditorialFields & {
    productReference?: string;
  }
>;

export type LegalBlockBlok = Z21Blok<
  "legalBlock",
  {
    title?: string;
    paragraphs?: string[];
  }
>;

export interface SplitEditorialFields {
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  image?: StoryblokAsset;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  theme?: "light" | "dark";
  ctaHref?: string;
  ctaLabel?: string;
  cta?: StoryblokLink;
  imageClassName?: string;
  sectionClassName?: string;
}
