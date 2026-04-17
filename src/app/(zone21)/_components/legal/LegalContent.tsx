import { legalInfo } from "./legal.data";

const sectionClassName = "flex flex-col gap-4 border-t border-white/10 pt-8";
const textClassName =
  "font-sans text-sm font-light leading-relaxed text-white/70";
const listClassName =
  "space-y-3 font-sans text-sm font-light leading-relaxed text-white/70";

export default function LegalContent() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
      <header className="flex max-w-3xl flex-col gap-5">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/45">
          Transparence & Rigueur
        </span>

        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl md:text-6xl">
            Mentions Légales
          </h1>

          <p className="max-w-2xl font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
            La présente page a pour objet de préciser les informations légales
            applicables à la plateforme {legalInfo.siteName}, ainsi que les
            conditions générales relatives à son exploitation, à son contenu et
            à l’utilisation de ses services.
          </p>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,760px)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav
            aria-label="Navigation des mentions légales"
            className="flex flex-col gap-3"
          >
            <a
              href="#editeur"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              01 — Éditeur
            </a>
            <a
              href="#hebergement"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              02 — Hébergement
            </a>
            <a
              href="#propriete-intellectuelle"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              03 — Propriété intellectuelle
            </a>
            <a
              href="#donnees-personnelles"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              04 — Données personnelles
            </a>
            <a
              href="#responsabilite"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              05 — Responsabilité
            </a>
            <a
              href="#droit-applicable"
              className="font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              06 — Droit applicable
            </a>
          </nav>
        </aside>

        <div className="flex flex-col gap-10">
          <section id="editeur" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              1. Éditeur de la plateforme
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                Le site {legalInfo.siteName} est édité par{" "}
                {legalInfo.companyName}, {legalInfo.legalForm} au capital de{" "}
                {legalInfo.shareCapital}, dont le siège social est situé{" "}
                {legalInfo.registeredOffice}.
              </p>

              <ul className={listClassName}>
                <li>
                  <strong className="font-medium text-white">
                    Immatriculation :
                  </strong>{" "}
                  {legalInfo.registrationCity} {legalInfo.registrationNumber}
                </li>
                <li>
                  <strong className="font-medium text-white">
                    TVA intracommunautaire :
                  </strong>{" "}
                  {legalInfo.vatNumber}
                </li>
                <li>
                  <strong className="font-medium text-white">
                    Direction de la publication :
                  </strong>{" "}
                  {legalInfo.publicationDirector}
                </li>
                <li>
                  <strong className="font-medium text-white">Contact :</strong>{" "}
                  <a
                    href={`mailto:${legalInfo.contactEmail}`}
                    className="underline underline-offset-4 transition hover:text-white"
                  >
                    {legalInfo.contactEmail}
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section id="hebergement" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              2. Hébergement
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                La plateforme est hébergée par {legalInfo.hostName}, dont le
                siège social est situé {legalInfo.hostAddress}.
              </p>

              <p className={textClassName}>
                Pour toute information complémentaire concernant l’hébergement,
                vous pouvez consulter :{" "}
                <span className="break-all text-white/85">
                  {legalInfo.hostWebsite}
                </span>
                .
              </p>
            </div>
          </section>

          <section id="propriete-intellectuelle" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              3. Propriété intellectuelle
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                L’ensemble des éléments présents sur le site{" "}
                {legalInfo.siteName}, notamment son architecture, son identité
                visuelle, ses textes, images, photographies, vidéos, éléments
                graphiques, typographies, logos, signes distinctifs, ainsi que
                tout autre contenu ou composant, est protégé par le droit de la
                propriété intellectuelle.
              </p>

              <p className={textClassName}>
                Sauf mention contraire, ces éléments demeurent la propriété
                exclusive de {legalInfo.siteName}. Toute reproduction,
                représentation, adaptation, diffusion ou exploitation, totale ou
                partielle, sur quelque support que ce soit et par quelque
                procédé que ce soit, sans autorisation écrite préalable, est
                strictement interdite.
              </p>

              <p className={textClassName}>
                Toute utilisation non autorisée du site ou de l’un de ses
                contenus pourra faire l’objet de poursuites conformément aux
                dispositions légales et réglementaires en vigueur.
              </p>
            </div>
          </section>

          <section id="donnees-personnelles" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              4. Protection des données personnelles
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                Vous pouvez consulter la plateforme {legalInfo.siteName} sans
                avoir à communiquer vos données personnelles. Toutefois,
                certaines fonctionnalités, notamment un formulaire de contact ou
                des échanges liés à une demande spécifique, peuvent nécessiter
                la collecte de certaines informations vous concernant.
              </p>

              <p className={textClassName}>
                Les données éventuellement recueillies sont traitées dans le
                respect de la réglementation applicable, notamment du Règlement
                Général sur la Protection des Données (RGPD) et de la loi
                Informatique et Libertés.
              </p>

              <p className={textClassName}>
                Vous disposez d’un droit d’accès, de rectification,
                d’effacement, de limitation, d’opposition et, le cas échéant, de
                portabilité de vos données, dans les conditions prévues par les
                textes applicables.
              </p>

              <p className={textClassName}>
                Toute demande relative à vos données personnelles peut être
                adressée à{" "}
                <a
                  href={`mailto:${legalInfo.contactEmail}`}
                  className="underline underline-offset-4 transition hover:text-white"
                >
                  {legalInfo.contactEmail}
                </a>
                .
              </p>
            </div>
          </section>

          <section id="responsabilite" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              5. Responsabilité
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                {legalInfo.siteName} s’efforce d’assurer l’exactitude et la mise
                à jour des informations diffusées sur la plateforme. Toutefois,
                aucune garantie ne peut être apportée quant à l’exhaustivité, la
                précision ou l’absence d’erreur des contenus accessibles sur le
                site.
              </p>

              <p className={textClassName}>
                {legalInfo.siteName} ne saurait être tenue responsable de tout
                dommage direct ou indirect résultant de l’accès au site, de son
                utilisation, de l’impossibilité d’y accéder, ou de l’utilisation
                d’informations qui y sont présentes.
              </p>
            </div>
          </section>

          <section id="droit-applicable" className={sectionClassName}>
            <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
              6. Droit applicable
            </h2>

            <div className="space-y-4">
              <p className={textClassName}>
                Les présentes mentions légales sont régies par le droit
                français.
              </p>

              <p className={textClassName}>
                En cas de litige et à défaut de résolution amiable, les
                juridictions françaises seront seules compétentes, sous réserve
                des dispositions légales impératives applicables.
              </p>
            </div>
          </section>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-amber-200/80">
              Vérification pré-production
            </p>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-amber-50/85">
              Pense à remplacer tous les champs entre crochets par les
              informations juridiques réelles avant mise en ligne.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
