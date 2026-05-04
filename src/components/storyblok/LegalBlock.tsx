import { storyblokEditable } from "@storyblok/react/rsc";

import type { LegalBlockBlok } from "@/lib/storyblok/types";

export default function LegalBlock({ blok }: { blok: LegalBlockBlok }) {
  return (
    <section
      className="w-full bg-white px-6 py-16 text-[#121110] md:px-12"
      {...storyblokEditable(blok)}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {blok.title ? (
          <h2 className="font-serif text-4xl leading-[1.02] md:text-5xl">
            {blok.title}
          </h2>
        ) : null}
        <div className="flex flex-col gap-5">
          {blok.paragraphs?.map((paragraph) => (
            <p
              className="font-sans text-[0.98rem] font-light leading-[1.9] text-[#121110]/72"
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
