"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PreviewToolbar({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 bg-[#121110] px-5 py-3 text-[#F7F5F0] shadow-2xl">
      <span className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-white/70">
        Preview Storyblok
      </span>
      <Link
        href={`/api/storyblok/exit-preview?slug=${encodeURIComponent(pathname)}`}
        prefetch={false}
        className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-white transition-colors hover:text-[#C5B39B]"
      >
        Quitter
      </Link>
    </div>
  );
}
