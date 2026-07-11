import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type SocialImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: SocialImage | string;
  socialTitle?: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
};

function resolveImage(image: SeoInput["image"]) {
  if (!image) {
    return siteConfig.socialImage;
  }

  if (typeof image === "string") {
    return {
      url: image,
      alt: siteConfig.name,
    };
  }

  return image;
}

export function createMetadata({
  title,
  description,
  path,
  image,
  socialTitle,
  type = "website",
  robots,
}: SeoInput): Metadata {
  const resolvedImage = resolveImage(image);
  const resolvedSocialTitle = socialTitle ?? title;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedSocialTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [resolvedImage],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedSocialTitle,
      description,
      images: [
        {
          url: resolvedImage.url,
          alt: resolvedImage.alt,
        },
      ],
    },
    robots,
  };
}

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
};
