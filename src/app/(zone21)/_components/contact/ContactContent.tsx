import Image from "next/image";

import ContactForm from "./shared/ContactForm";

export default function ContactContent() {
  return (
    <section className="w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24 xl:px-24">
          <div className="flex w-full max-w-[34rem] flex-col gap-10">
            <div className="flex flex-col gap-6">
              <span className="font-sans text-[0.62rem] uppercase tracking-[0.45em] text-[#121110]/38">
                Contact
              </span>

              <h2 className="text-balance font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-[#121110] md:text-5xl lg:text-[4.25rem]">
                Entrer dans la Zone.
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-sans text-[0.98rem] font-light leading-[1.95] tracking-[0.01em] text-[#121110]/72 md:text-[1.05rem]">
                Pour une collaboration, une création sur mesure ou une demande
                liée à nos maisons, ZONE 21 vous invite à prendre contact.
                Chaque message est reçu comme un point d’entrée sérieux : une
                intention à comprendre, un univers à cadrer, une présence à
                construire avec justesse.
              </p>

              <p className="font-sans text-[0.98rem] font-light leading-[1.95] tracking-[0.01em] text-[#121110]/72 md:text-[1.05rem]">
                Direction artistique, image, vêtement, musique, talents ou
                stratégie de marque : chaque échange ouvre un espace de travail
                où la vision, le détail et l’exécution doivent avancer avec la
                même précision.
              </p>

              <p className="font-sans text-[0.98rem] font-light leading-[1.95] tracking-[0.01em] text-[#121110]/72 md:text-[1.05rem]">
                Nous privilégions les échanges clairs, discrets et alignés avec
                la qualité que ZONE 21 porte dans chacun de ses projets. Entrer
                dans la Zone, c’est ouvrir une conversation avec une maison qui
                prend le fond autant au sérieux que la forme.
              </p>
            </div>

            <div className="flex flex-col gap-8 border-t border-[#121110]/10 pt-8">
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#121110]/40">
                  Siège / Studio
                </span>

                <address className="not-italic font-sans text-sm leading-relaxed text-[#121110] md:text-base">
                  ZONE 21
                  <br />
                  Avenue de l&apos;Exigence
                  <br />
                  75008 Paris, France
                </address>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#121110]/40">
                  Contact Direct
                </span>

                <a
                  href="mailto:contact@zone21.com"
                  className="font-sans text-sm text-[#121110] transition-colors duration-300 hover:text-[#121110]/60 md:text-base"
                >
                  contact@zone21.com
                </a>

                <a
                  href="tel:+33100000000"
                  className="font-sans text-sm text-[#121110] transition-colors duration-300 hover:text-[#121110]/60 md:text-base"
                >
                  +33 (0)1 00 00 00 00
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[52vh] grid-cols-1 lg:min-h-screen lg:grid-rows-[1fr_auto]">
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="/images/contact/contact 2.jpg"
              alt="Studio Zone 21"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>

          <div className="flex items-center bg-[#F7F5F0] px-6 py-12 md:px-12 lg:px-16 xl:px-24">
            <div className="w-full">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
