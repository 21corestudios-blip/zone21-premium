import Link from "next/link";

import {
  getProductionStorefrontItems,
  productionStorefrontCategories,
} from "@/data/production.products";

interface ProductionStorefrontCategoriesProps {
  artistSlug: string;
}

export default function ProductionStorefrontCategories({
  artistSlug,
}: ProductionStorefrontCategoriesProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-12 md:px-10 md:pb-16 lg:px-16">
      <div className="mb-8">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-bg/38">
          Storefront
        </p>
        <h2 className="mt-4 font-serif text-4xl uppercase leading-none text-bg md:text-5xl">
          Explorer par categorie
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {productionStorefrontCategories.map((category) => {
          const count = getProductionStorefrontItems(
            artistSlug,
            category.slug,
          ).length;

          return (
            <Link
              key={category.slug}
              href={`/prod/${artistSlug}/${category.slug}`}
              className="group relative overflow-hidden border border-bg/10 bg-white p-6 shadow-none transition-colors duration-300 hover:border-bg/24"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-heritage opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex min-h-[220px] flex-col justify-between">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.28em] text-bg/35">
                    {category.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-4xl uppercase leading-none text-bg">
                    {category.name}
                  </h3>
                  <p className="mt-5 max-w-sm font-sans text-sm font-light leading-relaxed text-bg/64">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-bg/8 pt-5">
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-bg/42">
                    {count} item{count > 1 ? "s" : ""}
                  </span>
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-bg transition-transform duration-300 group-hover:translate-x-1">
                    Ouvrir
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
