import Image from "next/image";
import Link from "next/link";

import { formatWearPrice, type WearProduct } from "@/data/wear.products";

interface WearProductsGridProps {
  collection: string;
  products: WearProduct[];
}

export default function WearProductsGrid({
  collection,
  products,
}: WearProductsGridProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-28 md:px-10 md:py-36 lg:px-16">
      <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/wear/${collection}/${product.id}`}
            aria-label={`Découvrir ${product.name}`}
            className="group flex cursor-pointer flex-col"
          >
            <div className="relative mb-7 aspect-[4/5] w-full overflow-hidden bg-commerce-surface">
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
                <h2 className="font-sans text-sm uppercase tracking-[0.16em] text-bg">
                  {product.name}
                </h2>
                <span className="font-sans text-sm uppercase tracking-[0.12em] text-bg/55">
                  {formatWearPrice(product.priceCents, product.currency)}
                </span>
              </div>

              <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-bg/65 md:text-base">
                {product.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
