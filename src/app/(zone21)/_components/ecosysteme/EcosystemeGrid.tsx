import Image from "next/image";
import Link from "next/link";

import { homeData } from "@/data/home.data";

const extraMaison = {
  id: "talents",
  name: "21 TALENTS AGENCY",
  category: "Promotion de Talents",
  image: {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
    alt: "Agence créative 21 Talents Agency",
  },
  href: "/contact",
};

export default function EcosystemeGrid() {
  const maisons = [...homeData.maisons, extraMaison];

  return (
    <section className="w-full bg-[#121110] px-6 py-6 md:px-12 md:py-8">
      <div className="flex h-[100dvh] min-h-screen gap-4 overflow-x-auto snap-x snap-mandatory md:gap-6">
        {maisons.map((maison) => (
          <Link
            key={maison.id}
            href={maison.href}
            aria-label={`Découvrir ${maison.name}`}
            className="group relative h-full min-w-[78vw] snap-center overflow-hidden bg-[#1a1918] md:min-w-[48vw] xl:min-w-0 xl:flex-1"
          >
            <Image
              src={maison.image.src}
              alt={maison.image.alt}
              fill
              sizes="(max-width: 768px) 78vw, (max-width: 1279px) 48vw, 25vw"
              className="object-cover opacity-90 transition-transform duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/90 via-[#121110]/20 to-transparent opacity-80" />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
              <span className="mb-2 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-white/60">
                {maison.category}
              </span>
              <h2 className="font-serif text-2xl tracking-wide text-white md:text-[2rem]">
                {maison.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
