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
    <section className="mx-auto w-full max-w-7xl px-6 py-28 md:px-10 md:py-36 lg:px-16">
      <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/prod/${artistSlug}/${product.id}`}
            aria-label={`Découvrir ${product.name}`}
            className="group flex cursor-pointer flex-col"
          >
            <div className="relative mb-7 aspect-[4/5] w-full overflow-hidden bg-[#F4F4F4]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-[#121110]/38">
                    {product.kind}
                  </p>
                  <h2 className="mt-3 font-sans text-sm uppercase tracking-[0.16em] text-[#121110]">
                    {product.name}
                  </h2>
                </div>

                <span className="font-sans text-sm uppercase tracking-[0.12em] text-[#121110]/55">
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
