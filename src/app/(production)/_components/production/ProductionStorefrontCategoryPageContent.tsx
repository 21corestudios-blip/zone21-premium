import Image from "next/image";
import Link from "next/link";

import type {
  ProductionSellable,
  ProductionStorefrontCategory,
} from "@/data/production.products";

interface ProductionStorefrontCategoryPageContentProps {
  artistName: string;
  artistSlug: string;
  category: ProductionStorefrontCategory;
  items: ProductionSellable[];
}

function getItemHref(artistSlug: string, item: ProductionSellable) {
  if (item.parentProductId) {
    return `/prod/${artistSlug}/${item.parentProductId}`;
  }

  return `/prod/${artistSlug}/${item.id}`;
}

export default function ProductionStorefrontCategoryPageContent({
  artistName,
  artistSlug,
  category,
  items,
}: ProductionStorefrontCategoryPageContentProps) {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <section className="mx-auto w-full max-w-7xl px-6 pb-10 pt-28 md:px-12 md:pb-12 md:pt-36">
        <Link
          href={`/prod/${artistSlug}`}
          className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/42 transition-colors duration-300 hover:text-[#121110]"
        >
          {artistName}
        </Link>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-[#121110]/38">
              {category.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] text-[#121110] md:text-6xl">
              {category.name}
            </h1>
          </div>

          <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-[#121110]/64 md:text-base">
            {category.description}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-28">
        {items.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={getItemHref(artistSlug, item)}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#121110]/10 bg-white shadow-[0_24px_80px_rgba(18,17,16,0.06)] transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-[#EAE8E3]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                  <div>
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-[#121110]/35">
                      {item.kind}
                    </p>
                    <h2 className="mt-4 font-serif text-3xl leading-none tracking-[-0.03em] text-[#121110]">
                      {item.name}
                    </h2>
                    <p className="mt-4 font-sans text-sm font-light leading-relaxed text-[#121110]/64">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#121110]/8 pt-5">
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#121110]/42">
                      {item.parentProductName ?? artistName}
                    </span>
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#121110]">
                      Ouvrir
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[#121110]/10 bg-white px-6 py-12 shadow-[0_24px_80px_rgba(18,17,16,0.06)] md:px-8">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-[#121110]/38">
              A venir
            </p>
            <h2 className="mt-4 font-serif text-3xl text-[#121110] md:text-4xl">
              {category.name}
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-base font-light leading-relaxed text-[#121110]/66">
              {category.emptyMessage}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
