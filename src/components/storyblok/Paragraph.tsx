import { storyblokEditable } from "@storyblok/react/rsc";

import type { ParagraphBlok } from "@/lib/storyblok/types";

const themeClasses = {
  dark: {
    section: "bg-[#121110] text-[#EAE8E3]",
    eyebrow: "text-white/38",
    heading: "text-white",
    paragraph: "text-white/68",
  },
  light: {
    section: "bg-white text-[#121110]",
    eyebrow: "text-[#121110]/38",
    heading: "text-[#121110]",
    paragraph: "text-[#121110]/72",
  },
} as const;

export default function Paragraph({ blok }: { blok: ParagraphBlok }) {
  const palette = themeClasses[blok.theme || "light"];
  const paragraphs = blok.paragraphs?.length
    ? blok.paragraphs
    : blok.text
      ? [blok.text]
      : [];

  return (
    <section
      className={`w-full px-6 py-20 md:px-12 md:py-24 ${palette.section}`}
      {...storyblokEditable(blok)}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {blok.eyebrow ? (
          <span
            className={`font-sans text-[0.62rem] uppercase tracking-[0.45em] ${palette.eyebrow}`}
          >
            {blok.eyebrow}
          </span>
        ) : null}

        {blok.title ? (
          <h2
            className={`text-balance font-serif text-4xl leading-[1.02] md:text-5xl ${palette.heading}`}
          >
            {blok.title}
          </h2>
        ) : null}

        <div className="flex flex-col gap-6">
          {paragraphs.map((paragraph) => (
            <p
              className={`font-sans text-[0.98rem] font-light leading-[1.95] tracking-[0.01em] md:text-[1.05rem] ${palette.paragraph}`}
              key={paragraph.slice(0, 32)}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
