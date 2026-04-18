import Image from "next/image";
import Link from "next/link";

import {
  formatProductionPrice,
  type ProductionProduct,
} from "@/data/production.products";

interface ProductionProductsGridProps {
  artistSlug: string;
  products: ProductionProduct[];
}

export default function ProductionProductsGrid({
  artistSlug,
  products,
}: ProductionProductsGridProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-32">
      <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/prod/${artistSlug}/${product.id}`}
            aria-label={`Découvrir ${product.name}`}
            className="group flex cursor-pointer flex-col"
          >
            <div className="relative mb-8 aspect-[4/5] w-full overflow-hidden bg-[#EAE8E3]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-[#121110]/38">
                    {product.kind}
                  </p>
                  <h2 className="mt-3 font-sans text-sm uppercase tracking-[0.2em] text-[#121110] md:text-base">
                    {product.name}
                  </h2>
                </div>

                <span className="font-sans text-sm uppercase tracking-[0.12em] text-[#121110]/60">
                  {formatProductionPrice(product.priceCents, product.currency)}
                </span>
              </div>

              <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-[#121110]/65 md:text-base">
                {product.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
