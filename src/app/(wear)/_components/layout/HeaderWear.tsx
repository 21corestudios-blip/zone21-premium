"use client";

import Image from "next/image";
import Link from "next/link";

import { useScrolledHeader } from "@/components/shared/useScrolledHeader";
import { useCartStore } from "@/lib/cart-store";

import CartDrawer from "./CartDrawer";

const linkClassName =
  "text-[0.65rem] uppercase tracking-[0.25em] text-white/70 transition-colors duration-500 hover:text-white";

const collectionLinkClassName =
  "text-[0.6rem] uppercase tracking-[0.2em] text-white/55 transition-colors duration-500 hover:text-white";

export default function HeaderWear() {
  const isScrolled = useScrolledHeader();
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isScrolled
            ? "border-b border-white/5 bg-[#121110]/90 py-4 shadow-sm backdrop-blur-md"
            : "border-transparent bg-transparent py-8"
        }`}
      >
        <div className="flex w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-10 lg:gap-14">
            <Link
              href="/wear"
              aria-label="Retour à l’accueil 21 Wear"
              className="flex-shrink-0 transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/21_wear_logo_blanc.svg"
                alt="ZONE 21"
                width={140}
                height={40}
                priority
                className="h-14 w-auto md:h-20"
              />
            </Link>

            <nav
              className="hidden items-center gap-5 lg:flex"
              aria-label="Collections 21 Wear"
            >
              <Link href="/wear/classic" className={collectionLinkClassName}>
                Classic
              </Link>
              <Link href="/wear/urban" className={collectionLinkClassName}>
                Urban
              </Link>
              <Link href="/wear/heritage" className={collectionLinkClassName}>
                Heritage
              </Link>
              <Link href="/wear/studio" className={collectionLinkClassName}>
                Studio
              </Link>
            </nav>
          </div>

          <nav
            className="hidden items-center gap-6 md:flex lg:gap-8"
            aria-label="Navigation 21 Wear"
          >
            <Link href="/" className={linkClassName}>
              Zone 21
            </Link>

            <Link href="/contact" className={linkClassName}>
              Contact
            </Link>

            <button type="button" onClick={openCart} className={linkClassName}>
              Panier{itemsCount > 0 ? ` (${itemsCount})` : ""}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
