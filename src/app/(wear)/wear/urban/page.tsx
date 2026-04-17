import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Urban Collection",
  description: "Découvrez la Urban Collection de 21 Wear.",
};

export default function UrbanPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
        <Image
          src="/images/brands/21-wear/02_urban_collection.jpg"
          alt="Urban Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />
        <div className="absolute bottom-10 left-0 z-10 flex w-full justify-center px-6 md:bottom-16">
          <h1 className="font-serif text-3xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
            Urban Collection
          </h1>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-24 md:px-12">
        <div className="max-w-3xl text-center">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/40">
            21 Wear
          </span>
          <p className="mt-8 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
            La Urban Collection sera bientôt détaillée dans cette nouvelle
            boutique.
          </p>
        </div>
      </section>
    </main>
  );
}
