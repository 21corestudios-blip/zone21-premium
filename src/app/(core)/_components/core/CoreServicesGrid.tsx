import Image from "next/image";
import Link from "next/link";

import { coreServices } from "@/data/core.services";

export default function CoreServicesGrid() {
  return (
    <section
      id="studios"
      className="mx-auto w-full max-w-7xl px-6 py-28 md:px-10 md:py-36 lg:px-16"
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
        {coreServices.map((service) => (
          <Link
            key={service.slug}
            href={`/core-studios/${service.slug}`}
            className="group flex cursor-pointer flex-col"
            aria-label={`Découvrir ${service.name}`}
          >
            <div className="relative mb-7 aspect-[4/5] w-full overflow-hidden bg-commerce-surface">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col items-center justify-center px-2 text-center">
              <h2 className="font-sans text-sm uppercase tracking-[0.16em] text-bg transition-colors duration-300 group-hover:text-bg/70">
                {service.name}
              </h2>
              <p className="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/40">
                {service.role}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
