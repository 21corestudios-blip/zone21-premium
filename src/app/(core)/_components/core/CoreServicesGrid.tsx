import Image from "next/image";
import Link from "next/link";

import { coreServices } from "@/data/core.services";

export default function CoreServicesGrid() {
  return (
    <section
      id="studios"
      className="mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-32"
    >
      <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2 md:gap-y-28 xl:grid-cols-3">
        {coreServices.map((service) => (
          <Link
            key={service.slug}
            href={`/core-studios/${service.slug}`}
            className="group flex cursor-pointer flex-col"
            aria-label={`Découvrir ${service.name}`}
          >
            <div className="relative mb-8 aspect-[4/5] w-full overflow-hidden bg-[#EAE8E3]">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col items-center justify-center px-2 text-center">
              <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-[#121110] transition-colors duration-500 group-hover:text-[#121110]/70 md:text-base">
                {service.name}
              </h2>
              <p className="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                {service.role}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
