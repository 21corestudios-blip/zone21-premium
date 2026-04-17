const valueCardClassName = "flex flex-col gap-4";
const valueTextClassName =
  "font-sans text-sm font-light leading-relaxed text-white/70";

export default function AboutValues() {
  return (
    <section className="flex min-h-screen w-full items-center bg-[#121110] px-6 py-24 text-[#EAE8E3] md:px-12 md:py-32">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8 md:text-left">
        <article className={valueCardClassName}>
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
            01
          </span>
          <h3 className="font-serif text-2xl tracking-wide">L&apos;Exigence</h3>
          <p className={valueTextClassName}>
            Tout commence par une sélection rigoureuse. Les matières, les
            talents et les mots sont choisis avec précision pour donner
            naissance à des univers capables de durer.
          </p>
        </article>

        <article className={valueCardClassName}>
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
            02
          </span>
          <h3 className="font-serif text-2xl tracking-wide">La Vision</h3>
          <p className={valueTextClassName}>
            Regarder devant sans rompre avec l’essentiel. Zone 21 imagine des
            projets ancrés dans leur temps, mais guidés par des codes qui ne
            s’effacent pas.
          </p>
        </article>

        <article className={valueCardClassName}>
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
            03
          </span>
          <h3 className="font-serif text-2xl tracking-wide">L&apos;Autorité</h3>
          <p className={valueTextClassName}>
            Créer une présence qui s’impose sans bruit. Des univers désirables,
            cohérents et maîtrisés, portés par une force calme et une évidence
            durable.
          </p>
        </article>
      </div>
    </section>
  );
}
