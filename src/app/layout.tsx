import type { Metadata } from "next";
import localFont from "next/font/local";

import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

import "./globals.css";

const texteFont = localFont({
  src: "../../public/fonts/Satoshi-Regular.otf",
  variable: "--font-texte",
  weight: "400",
  style: "normal",
  display: "swap",
});

const titreFont = localFont({
  src: "../../public/fonts/Coolvetica Rg Cond.otf",
  variable: "--font-titre",
  weight: "400",
  style: "normal",
  display: "swap",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://zone-21.fr")
  .replace(/\/$/, "");
const siteName = "ARCANE";
const defaultTitle = "ARCANE | L'Exigence pour Signature";
const defaultDescription =
  "ARCANE est une maison créative indépendante dédiée aux univers premium entre vêtement, image, musique, production, talents et culture street.";
const defaultOgImage = {
  url: "/images/home/hero/Image_hero_0003_16_9.webp",
  width: 2048,
  height: 1136,
  alt: "ARCANE - maison créative indépendante",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | ARCANE",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "ARCANE",
    "maison créative",
    "maison créative indépendante",
    "studio créatif",
    "direction artistique",
    "culture street",
    "vêtement premium",
    "image de marque",
    "production musicale",
    "talents créatifs",
    "univers créatif",
    "narration de marque",
    "CO-KAIN",
    "CYPHER",
    "CORE STUDIOS",
    "BACKSPIN",
    "creative house",
    "creative studio",
    "fashion",
    "premium clothing",
    "music production",
    "talents",
    "branding",
    "premium lifestyle",
  ],
  authors: [{ name: "ARCANE" }],
  creator: "ARCANE",
  publisher: "ARCANE",
  category: "creative business",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage.url,
        alt: defaultOgImage.alt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${texteFont.variable} ${titreFont.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-bg font-sans text-text selection:bg-accent selection:text-bg"
        suppressHydrationWarning
      >
        <OrganizationJsonLd siteUrl={siteUrl} />
        <a
          href="#main-content"
          className="sr-only rounded-md font-medium focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-text focus:px-3 focus:py-2 focus:text-bg"
        >
          Aller au contenu principal
        </a>

        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
