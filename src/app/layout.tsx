import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const texteFont = localFont({
  src: "./fonts/texte.woff2",
  variable: "--font-texte",
  display: "swap",
});

const titreFont = localFont({
  src: "./fonts/titre.woff2",
  variable: "--font-titre",
  display: "swap",
});

const siteUrl = "https://zone21.com";
const siteName = "ZONE 21";
const defaultTitle = "ZONE 21 | L'Exigence pour Signature";
const defaultDescription =
  "Une architecture créative dédiée à l'émergence des maisons de demain.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | ZONE 21",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "Zone 21",
    "21 Wear",
    "21 Core Studios",
    "21 Production",
    "creative house",
    "fashion",
    "music production",
    "talents",
    "branding",
    "premium lifestyle",
  ],
  authors: [{ name: "ZONE 21" }],
  creator: "ZONE 21",
  publisher: "ZONE 21",
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
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
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
        className="min-h-screen flex flex-col bg-[#121110] font-sans text-[#EAE8E3] selection:bg-[#C5B39B] selection:text-[#121110]"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only rounded-md font-medium focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#EAE8E3] focus:px-3 focus:py-2 focus:text-[#121110]"
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
