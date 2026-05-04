import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";

import { resolveStoryblokLink } from "@/lib/storyblok/asset";
import type { CtaBlok } from "@/lib/storyblok/types";

export default function Cta({ blok }: { blok: CtaBlok }) {
  const href = resolveStoryblokLink(blok.link, blok.href);

  if (!href || !blok.label) {
    return null;
  }

  return (
    <div className="bg-white px-6 py-8 text-center" {...storyblokEditable(blok)}>
      <Link
        href={href}
        className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-500 hover:bg-[#2A2826]"
      >
        <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
          {blok.label}
        </span>
      </Link>
    </div>
  );
}
