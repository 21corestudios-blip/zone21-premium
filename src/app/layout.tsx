import type { Metadata } from "next";
import localFont from "next/font/local";

import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { siteConfig } from "@/config/site";

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

const defaultTitle = "ARCANE | L'Exigence pour Signature";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [...siteConfig.authors],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.socialImage.url,
        alt: siteConfig.socialImage.alt,
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
        <OrganizationJsonLd />
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
