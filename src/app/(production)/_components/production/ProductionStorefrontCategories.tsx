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
    <section className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-12 md:pb-14">
      <div className="mb-8">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-[#121110]/38">
          Storefront
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-none tracking-[-0.03em] text-[#121110] md:text-5xl">
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
              className="group relative overflow-hidden rounded-[2rem] border border-[#121110]/10 bg-white p-6 shadow-[0_24px_80px_rgba(18,17,16,0.06)] transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,179,155,0.14),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.55),_rgba(255,255,255,0))]" />

              <div className="relative flex min-h-[220px] flex-col justify-between">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.28em] text-[#121110]/35">
                    {category.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] text-[#121110]">
                    {category.name}
                  </h3>
                  <p className="mt-5 max-w-sm font-sans text-sm font-light leading-relaxed text-[#121110]/64">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[#121110]/8 pt-5">
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#121110]/42">
                    {count} item{count > 1 ? "s" : ""}
                  </span>
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#121110] transition-transform duration-300 group-hover:translate-x-1">
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
