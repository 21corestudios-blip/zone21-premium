import Image from "next/image";
import Link from "next/link";

import { homeData } from "@/data/home.data";

export default function EcosystemeGrid() {
  const { maisons } = homeData;

  return (
    <section className="w-full bg-bg px-6 py-6 md:px-12 md:py-8">
      <div className="flex h-dvh min-h-screen gap-4 overflow-x-auto snap-x snap-mandatory md:gap-6">
        {maisons.map((maison) => (
          <Link
            key={maison.id}
            href={maison.href}
            aria-label={`Découvrir ${maison.name}`}
            className="group relative block h-full shrink-0 min-w-[78vw] snap-center overflow-hidden bg-surface md:min-w-[48vw] xl:min-w-0 xl:flex-1"
          >
            <Image
              src={maison.image.src}
              alt={maison.image.alt}
              fill
              sizes="(max-width: 768px) 78vw, (max-width: 1279px) 48vw, 20vw"
              className="object-cover opacity-90 transition-transform duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-80" />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
              <span className="mb-2 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-white/60">
                {maison.section} · {maison.category}
              </span>
              <h2 aria-label={maison.name}>
                <Image
                  src={maison.logo.src}
                  alt=""
                  width={500}
                  height={500}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"
                />
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
