import { productionData } from "@/data/production.data";

export default function ProductionIntro() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/42">
            21 Production
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {productionData.manifesto.map((paragraph) => (
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
