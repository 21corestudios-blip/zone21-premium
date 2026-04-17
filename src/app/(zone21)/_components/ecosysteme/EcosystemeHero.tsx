import Image from "next/image";

export default function EcosystemeHero() {
  return (
    <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2071&auto=format&fit=crop"
          alt="Écosystème Zone 21"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />

      <div className="absolute bottom-10 left-0 z-30 flex w-full justify-center px-6 md:bottom-16">
        <h1 className="animate-fade-in-up whitespace-nowrap font-serif text-2xl font-light tracking-wide text-white drop-shadow-lg sm:text-3xl md:text-5xl lg:text-6xl">
          Notre Écosystème.
        </h1>
      </div>
    </section>
  );
}
