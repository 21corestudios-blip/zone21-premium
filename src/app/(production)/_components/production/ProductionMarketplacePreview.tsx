import Image from "next/image";
import Link from "next/link";

import { productionArtists } from "@/data/production.artists";
import {
  formatProductionPrice,
  productionProducts,
} from "@/data/production.products";

export default function ProductionMarketplacePreview() {
  return (
    <section
      id="marketplace"
      className="bg-[#121110] px-6 py-20 text-[#EAE8E3] md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-white/42">
              Artist stores
            </p>
            <h2 className="mt-4 font-serif text-4xl text-white md:text-5xl">
              Boutique par artiste
            </h2>
          </div>

          <p className="max-w-2xl font-sans text-sm font-light leading-relaxed text-white/58 md:text-base">
            Beats exclusifs, templates, chaines de plug-ins et progressions
            d’accords, organisés par univers pour garder une lecture claire du
            label.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {productionProducts.slice(0, 6).map((product) => {
            const artist = productionArtists.find(
              (entry) => entry.slug === product.artist,
            );

            if (!artist) {
              return null;
            }

            return (
              <Link
                key={product.id}
                href={`/prod/${artist.slug}/${product.id}`}
                className="group block border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                aria-label={`Découvrir ${product.name}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-white/38">
                        {artist.name} • {product.kind}
                      </p>
                      <h3 className="mt-3 font-serif text-2xl text-white">
                        {product.name}
                      </h3>
                    </div>
                    <span className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#D5C4AE]">
                      {formatProductionPrice(product.priceCents, product.currency)}
                    </span>
                  </div>

                  <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/58">
                    {product.shortDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
