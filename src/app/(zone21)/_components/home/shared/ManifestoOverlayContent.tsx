import Image from "next/image";
import Link from "next/link";

interface ManifestoOverlayContentProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function ManifestoOverlayContent({
  eyebrow,
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  ctaHref,
  ctaLabel,
}: ManifestoOverlayContentProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg text-white">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/86 via-black/56 to-black/18" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/72" />

      <div className="relative z-10 flex min-h-screen w-full items-center px-6 py-24 md:px-12 md:py-28 lg:px-16 xl:px-24">
        <div className="flex w-full max-w-[43rem] flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-5 md:gap-6">
            <span className="font-sans text-[0.62rem] uppercase tracking-[0.45em] text-white/58">
            {eyebrow}
            </span>

            <h2 className="text-balance font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-white drop-shadow-xl md:text-5xl lg:text-[4.25rem]">
              {title}
            </h2>
          </div>

          <div className="flex max-w-[38rem] flex-col gap-4 md:gap-5">
            {paragraphs.map((text) => (
              <p
                key={`${eyebrow}-${text.slice(0, 24)}`}
                className="font-sans text-[0.94rem] font-light leading-[1.72] tracking-[0.01em] text-white/78 drop-shadow md:text-[1.02rem] md:leading-[1.85]"
              >
                {text}
              </p>
            ))}
          </div>

          {ctaHref && ctaLabel ? (
            <div className="pt-2">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center bg-white px-8 py-4 text-bg transition-colors duration-500 hover:bg-paper"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
                  {ctaLabel}
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
