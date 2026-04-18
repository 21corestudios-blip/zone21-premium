import Image from "next/image";

import { coreData } from "@/data/core.data";

export default function CoreHero() {
  return (
    <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
      <div className="absolute inset-0 z-0">
        <Image
          src={coreData.hero.image}
          alt="Campagne 21 Core Studios"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />

      <div className="absolute bottom-10 left-0 z-30 flex w-full justify-center px-6 md:bottom-16">
        <h1 className="font-serif text-2xl font-light tracking-wide text-white drop-shadow-lg sm:text-3xl md:text-5xl lg:text-6xl">
          {coreData.hero.title}
        </h1>
      </div>
    </section>
  );
}
