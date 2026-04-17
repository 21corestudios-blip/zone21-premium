import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/a_propos/en-tete.jpg"
          alt="Architecture Zone 21"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />

      <div className="absolute bottom-10 left-0 z-30 flex w-full justify-center px-6 md:bottom-16">
        <h1 className="animate-fade-in-up whitespace-nowrap font-serif text-2xl font-light tracking-wide text-white drop-shadow-lg sm:text-3xl md:text-5xl lg:text-6xl">
          Notre Vision.
        </h1>
      </div>
    </section>
  );
}
