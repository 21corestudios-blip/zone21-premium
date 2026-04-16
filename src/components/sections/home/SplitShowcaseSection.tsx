import Image from "next/image";
import Link from "next/link";

interface SplitShowcaseSectionProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  theme?: "dark" | "light";
  ctaHref?: string;
  ctaLabel?: string;
  imageClassName?: string;
  sectionClassName?: string;
}

const themeClasses = {
  dark: {
    section: "bg-[#121110] text-[#EAE8E3]",
    eyebrow: "text-white/38",
    heading: "text-white",
    paragraph: "text-white/68",
    button: "bg-[#EAE8E3] text-[#121110] hover:bg-white",
  },
  light: {
    section: "bg-[#F7F5F0] text-[#121110]",
    eyebrow: "text-[#121110]/38",
    heading: "text-[#121110]",
    paragraph: "text-[#121110]/72",
    button: "bg-[#121110] text-[#F7F5F0] hover:bg-[#2A2826]",
  },
} as const;

export default function SplitShowcaseSection({
  eyebrow,
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition = "right",
  theme = "dark",
  ctaHref,
  ctaLabel,
  imageClassName = "object-cover",
  sectionClassName = "",
}: SplitShowcaseSectionProps) {
  const palette = themeClasses[theme];
  const imageOrderClassName =
    imagePosition === "left" ? "lg:order-1" : "lg:order-2";
  const textOrderClassName =
    imagePosition === "left" ? "lg:order-2" : "lg:order-1";

  return (
    <section
      className={`w-full overflow-hidden ${palette.section} ${sectionClassName}`}
    >
      <div className="grid min-h-screen grid-cols-1 items-stretch lg:grid-cols-2">
        <div
          className={`order-2 relative min-h-[52vh] overflow-hidden ${imageOrderClassName} lg:min-h-screen`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={imageClassName}
          />
        </div>

        <div
          className={`order-1 flex min-h-[48vh] items-center px-6 py-20 md:px-12 md:py-24 lg:px-16 lg:py-28 xl:px-24 ${textOrderClassName}`}
        >
          <div className="flex w-full max-w-[34rem] flex-col gap-10">
            <div className="flex flex-col gap-6">
              <span
                className={`font-sans text-[0.62rem] uppercase tracking-[0.45em] ${palette.eyebrow}`}
              >
                {eyebrow}
              </span>

              <h2
                className={`text-balance font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-5xl lg:text-[4.25rem] ${palette.heading}`}
              >
                {title}
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {paragraphs.map((text) => (
                <p
                  key={`${eyebrow}-${text.slice(0, 24)}`}
                  className={`font-sans text-[0.98rem] font-light leading-[1.95] tracking-[0.01em] md:text-[1.05rem] ${palette.paragraph}`}
                >
                  {text}
                </p>
              ))}
            </div>

            {ctaHref && ctaLabel ? (
              <div className="pt-4">
                <Link
                  href={ctaHref}
                  className={`inline-flex items-center justify-center px-8 py-4 transition-colors duration-500 ${palette.button}`}
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
    </section>
  );
}
