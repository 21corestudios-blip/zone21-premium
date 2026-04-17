import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact/contact.jpg"
          alt="Bureau Zone 21"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_20%] opacity-90"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#121110]/20 to-[#121110]/90 mix-blend-multiply" />

      <div className="absolute bottom-10 left-0 z-30 flex w-full justify-center px-6 md:bottom-16">
        <h1 className="animate-fade-in-up whitespace-nowrap font-serif text-3xl font-light tracking-wide text-white drop-shadow-lg md:text-5xl lg:text-6xl">
          Échanger.
        </h1>
      </div>
    </section>
  );
}
