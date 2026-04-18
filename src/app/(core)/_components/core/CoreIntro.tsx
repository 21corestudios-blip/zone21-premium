import { coreData } from "@/data/core.data";

export default function CoreIntro() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/42">
            21 Core Studios
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {coreData.manifesto.map((paragraph) => (
            <p
              key={paragraph}
              className="font-sans text-base font-light leading-relaxed text-[#121110]/72 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
