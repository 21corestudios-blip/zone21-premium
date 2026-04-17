import Image from "next/image";

export default function AboutOrigins() {
  return (
    <section className="w-full bg-white">
      <div className="grid h-[100dvh] min-h-screen grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="flex h-full items-center overflow-y-auto px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24 xl:px-24">
          <div className="flex w-full max-w-[34rem] flex-col gap-8">
            <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-[#121110] md:text-5xl lg:text-[4.25rem]">
              Les Origines
            </h2>

            <div className="flex flex-col gap-5">
              <p className="font-sans text-[0.95rem] font-light leading-[1.85] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Zone 21 est née d’une conviction profonde. Les forces les plus
                puissantes émergent souvent dans des lieux que l’on regarde mal
                ou que l’on raconte trop vite. Là où certains ne voient que des
                marges, il existe pourtant une discipline, une fraternité, un
                respect et une intensité capables de faire naître des artistes,
                des visions et des trajectoires singulières.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.85] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Dès l’origine, cette intuition a trouvé un écho auprès de
                premières présences dont l’énergie a accompagné l’élan du
                projet. HEKA et AXION, à travers la musique, la production et
                une même exigence créative, ont participé à installer une
                première vibration. Elena Davalon y a apporté une sensibilité
                visuelle ancrée dans l’expression urbaine et le geste libre.
                Naya Delmare, par son approche du bien-être et de la pensée
                positive, a ouvert un autre espace, plus intérieur, plus
                lumineux, mais tout aussi essentiel à l’équilibre de l’ensemble.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.85] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Ces premières affinités n’ont pas simplement entouré Zone 21,
                elles ont contribué à en révéler l’attitude, le souffle et la
                direction. Chacun, à sa manière, a incarné une dimension du
                projet et participé à faire émerger un univers où la création,
                la conscience, le style et la profondeur ne s’opposent jamais.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.85] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Pensée comme une entité entièrement tournée vers la conception,
                la vision et la construction d’univers durables, Zone 21
                transforme ces influences premières en langage, en esthétique et
                en structure. Elle donne forme à des marques et à des projets
                qui cherchent plus qu’une présence immédiate, des univers
                capables de s’inscrire dans le temps avec cohérence, exigence et
                autorité naturelle.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-full min-h-[50vh] overflow-hidden">
          <Image
            src="/images/home/a_propos/photo_texte.jpg"
            alt="L'exigence Zone 21"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
