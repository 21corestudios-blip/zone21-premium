const values = [
  {
    number: "01",
    title: "L’Exigence",
    text: "Rien n’entre dans ZONE 21 par hasard. Une matière, une image, une voix, un mot ou une silhouette doivent porter une intention claire. La sélection est stricte, non pour fermer les portes, mais pour construire des univers solides, précis et capables de traverser le temps.",
  },
  {
    number: "02",
    title: "La Vision",
    text: "ZONE 21 regarde devant sans effacer ce qui l’a fondée. Chaque projet avance avec son époque, mais reste attaché à des codes profonds : la culture, le rythme, la présence, le détail, la mémoire urbaine et le sens du récit.",
  },
  {
    number: "03",
    title: "L’Autorité",
    text: "La force d’une maison ne se mesure pas au bruit qu’elle produit. Elle se reconnaît à sa cohérence, à sa tenue, à sa capacité à imposer une présence sans forcer. ZONE 21 construit des signes durables, des univers lisibles et une identité qui tient.",
  },
];

export default function AboutValues() {
  return (
    <section className="w-full bg-[#121110] px-6 py-20 text-white md:px-12 md:py-28 lg:px-16 xl:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.28em] text-white/45">
              Principes fondateurs
            </p>

            <h2 className="font-serif text-4xl leading-[1.03] tracking-[-0.02em] text-white md:text-5xl lg:text-[4.4rem]">
              Une ligne claire.
              <br />
              Une présence tenue.
            </h2>
          </div>

          <p className="max-w-2xl font-sans text-[0.98rem] font-light leading-[1.85] tracking-[0.01em] text-white/62 md:text-[1.05rem]">
            ZONE 21 repose sur une méthode simple : choisir avec précision,
            construire avec cohérence, tenir une signature sans la diluer. Les
            maisons du groupe peuvent parler des langages différents, mais elles
            avancent depuis le même socle.
          </p>
        </div>

        <div className="grid border-t border-white/12 lg:grid-cols-3">
          {values.map((item) => (
            <article
              key={item.number}
              className="flex min-h-[22rem] flex-col justify-between border-b border-white/12 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:last:border-r-0"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-5xl leading-none tracking-[-0.04em] text-white/18 md:text-6xl">
                  {item.number}
                </span>

                <div className="h-px flex-1 bg-white/12" />
              </div>

              <div className="mt-16 flex flex-col gap-5">
                <h3 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-white md:text-4xl">
                  {item.title}
                </h3>

                <p className="font-sans text-[0.95rem] font-light leading-[1.85] tracking-[0.01em] text-white/64">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
