import type { SbBlokData } from "@storyblok/react/rsc";

export default function UnknownBlock({ blok }: { blok: SbBlokData }) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="border border-red-500/40 bg-red-950/40 p-4 font-mono text-xs text-red-100">
      Bloc Storyblok inconnu: {blok.component || "sans nom"}
    </div>
  );
}
