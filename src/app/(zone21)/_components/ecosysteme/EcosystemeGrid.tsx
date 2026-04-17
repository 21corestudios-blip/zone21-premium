import Image from "next/image";
import Link from "next/link";

import { homeData } from "@/data/home.data";

export default function EcosystemeGrid() {
  const { maisons } = homeData;

  return (
    <section className="w-full bg-[#121110] px-6 py-10 md:px-12 md:py-12">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {maisons.map((maison) => (
          <Link
            key={maison.id}
            href={maison.href}
            aria-label={`Découvrir ${maison.name}`}
            className="group relative block min-h-[28rem] overflow-hidden bg-[#1a1918] md:min-h-0"
          >
            <Image
              src={maison.image.src}
              alt={maison.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-90 transition-transform duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/90 via-[#121110]/20 to-transparent opacity-80" />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
              <span className="mb-2 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-white/60">
                {maison.category}
              </span>
              <h2 className="font-serif text-2xl tracking-wide text-white md:text-3xl">
                {maison.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
