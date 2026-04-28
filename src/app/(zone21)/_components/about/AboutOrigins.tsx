import Image from "next/image";

export default function AboutOrigins() {
  return (
    <section className="w-full bg-white">
      <div className="grid h-[100dvh] min-h-screen grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="flex h-full items-center overflow-y-auto px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24 xl:px-24">
          <div className="flex w-full max-w-[40rem] flex-col gap-8">
            <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-[#121110] md:text-5xl lg:text-[4.25rem]">
              Les Origines
            </h2>

            <div className="flex flex-col gap-5">
              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                ZONE 21 ne naît pas d’un simple projet de marque. Son origine
                vient d’un monde à construire, d’une culture à organiser et de
                figures capables d’en porter les premières lignes. Avant les
                maisons, avant les collections, avant les images, il y a une
                idée : créer un territoire où le vêtement, le son, la présence
                et le récit parlent le même langage.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Les personnages fondateurs donnent corps à cette vision. Elena
                Davalon incarne l’image, la tenue, la précision du regard et la
                construction d’une identité forte. Elle représente cette part de
                ZONE 21 qui observe, cadre, compose et transforme une intuition
                en présence visuelle durable.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Naya Delmare porte une autre énergie : celle de la silhouette,
                de l’allure, de la voix et du mouvement. Elle relie la mode, la
                culture urbaine et l’élégance contemporaine. À travers elle,
                ZONE 21 affirme que le style n’est pas seulement une apparence,
                mais une manière d’entrer dans le monde, de tenir sa place et de
                laisser une trace.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Heka ouvre le territoire du son. Il porte l’héritage hip-hop, le
                grain des productions old school, la mémoire des studios et
                cette science du rythme qui donne de la profondeur aux images.
                Avec lui, la musique n’est pas un décor. Elle devient une
                structure, une pulsation, une manière de donner du relief aux
                univers de la maison.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                Ensemble, ces figures ne forment pas une fiction décorative.
                Elles installent les fondations de ZONE 21 : l’image, le
                vêtement, la musique, les talents, les récits et les codes
                culturels qui traversent les générations. Elles donnent à la
                maison une mémoire, une attitude et une façon de créer sans se
                disperser.
              </p>

              <p className="font-sans text-[0.95rem] font-light leading-[1.82] tracking-[0.01em] text-[#121110]/72 md:text-[1rem]">
                De cette origine naît une maison créative pensée comme un
                territoire complet. Chaque ligne peut évoluer, chaque projet
                peut prendre sa forme, mais le centre reste le même : une
                signature sobre, une force calme, une culture assumée et le goût
                des choses capables de durer.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-full min-h-[50vh] overflow-hidden">
          <Image
            src="/images/a_propos/photo_texte.jpg"
            alt="Figures fondatrices de ZONE 21"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
