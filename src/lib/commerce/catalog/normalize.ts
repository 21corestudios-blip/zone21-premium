import type { CoreProduct } from "@/data/core.products";
import type { ProductionSellable } from "@/data/production.products";
import type { TalentsProduct } from "@/data/talents.products";
import {
  buildWearVariantId,
  wearColorLabels,
  wearLaunchColors,
  type WearProduct,
} from "@/data/wear.products";
import type {
  CommerceBrandId,
  CommerceMoney,
  CommerceProduct,
  CommerceProductVariant,
  CommerceShippingProfile,
} from "@/lib/commerce/types";
import { assertCommerceProduct } from "@/lib/commerce/products/schema";

const digitalShippingProfile: CommerceShippingProfile = {
  id: "digital-delivery",
  shipsPhysicalGoods: false,
  requiresAddress: false,
};

const serviceShippingProfile: CommerceShippingProfile = {
  id: "service-delivery",
  shipsPhysicalGoods: false,
  requiresAddress: false,
};

const wearShippingProfile: CommerceShippingProfile = {
  id: "wear-print-on-demand",
  shipsPhysicalGoods: true,
  requiresAddress: true,
  regions: ["EU", "US-CA", "OC"],
};

function eur(amountCents: number): CommerceMoney {
  return {
    amountCents,
    currency: "EUR",
  };
}

function baseVariant(
  id: string,
  title: string,
  price: CommerceMoney,
): CommerceProductVariant {
  return {
    id,
    title,
    displayPrice: price,
    checkoutPrice: price,
    availability: {
      status: "made_to_order",
    },
    fulfillmentProvider: "internal",
  };
}

export function normalizeWearProduct(product: WearProduct): CommerceProduct {
  const price = eur(product.priceCents);

  return assertCommerceProduct({
    id: product.id,
    slug: product.id,
    brand: "wear",
    source: "internal",
    sourceProductId: product.id,
    title: product.name,
    descriptionShort: product.description,
    media: [{ src: product.image, alt: product.name, role: "primary" }],
    editorialContentRef: `wear/${product.collection}/${product.id}`,
    displayPrice: price,
    checkoutPrice: price,
    currency: "EUR",
    availability: { status: "made_to_order" },
    shippingProfile: wearShippingProfile,
    fulfillmentProvider: "printify",
    sellable: true,
    variants: product.availableSizes.flatMap((size) =>
      (product.availableColors || [wearLaunchColors[0]]).map((color) => {
        const id = buildWearVariantId(size, color);

        return {
          ...baseVariant(id, `${size} · ${wearColorLabels[color]}`, price),
          sku: `${product.id}-${size}-${color}`.toUpperCase(),
          fulfillmentProvider: "gelato" as const,
          metadata: { size, color },
        };
      }),
    ),
    metadata: {
      collection: product.collection,
      commerceRole: "wear-catalog",
      launchColors: (product.availableColors || [wearLaunchColors[0]]).join(","),
    },
  });
}

export function normalizeCoreProduct(product: CoreProduct): CommerceProduct {
  const price = eur(product.priceCents);

  return assertCommerceProduct({
    id: product.id,
    slug: product.id,
    brand: "core",
    source: "internal",
    sourceProductId: product.id,
    sku: product.id.toUpperCase(),
    title: product.name,
    descriptionShort: product.shortDescription,
    media: [{ src: product.image, alt: product.name, role: "primary" }],
    editorialContentRef: `core-studios/${product.service}/${product.id}`,
    displayPrice: price,
    checkoutPrice: price,
    currency: "EUR",
    availability: { status: "in_stock" },
    shippingProfile:
      product.kind === "Cadre" ? wearShippingProfile : serviceShippingProfile,
    fulfillmentProvider: product.kind === "Cadre" ? "internal" : "service",
    sellable: true,
    variants: [baseVariant("default", product.name, price)],
    metadata: {
      service: product.service,
      kind: product.kind,
      timeline: product.timeline || null,
    },
  });
}

export function normalizeProductionProduct(
  product: ProductionSellable,
): CommerceProduct {
  const price = eur(product.priceCents);
  const isPhysical = product.kind === "Vinyl" || product.kind === "Cassette";

  return assertCommerceProduct({
    id: product.id,
    slug: product.id,
    brand: "production",
    source: "internal",
    sourceProductId: product.id,
    sku: product.id.toUpperCase(),
    title: product.name,
    descriptionShort: product.shortDescription,
    media: [{ src: product.image, alt: product.name, role: "primary" }],
    editorialContentRef: `prod/${product.artist}/${product.id}`,
    displayPrice: price,
    checkoutPrice: price,
    currency: "EUR",
    availability: {
      status: product.availability === "preorder" ? "preorder" : "in_stock",
    },
    shippingProfile: isPhysical ? wearShippingProfile : digitalShippingProfile,
    fulfillmentProvider: isPhysical ? "internal" : "digital",
    sellable: true,
    variants: [baseVariant("default", product.name, price)],
    metadata: {
      artist: product.artist,
      kind: product.kind,
      parentProductId: product.parentProductId || null,
    },
  });
}

export function normalizeTalentsProduct(
  product: TalentsProduct,
): CommerceProduct {
  const price = eur(product.priceCents);

  return assertCommerceProduct({
    id: product.id,
    slug: product.id,
    brand: "talents",
    source: "internal",
    sourceProductId: product.id,
    sku: product.id.toUpperCase(),
    title: product.name,
    descriptionShort: product.shortDescription,
    media: [{ src: product.image, alt: product.name, role: "primary" }],
    editorialContentRef: `talents-agency/${product.division}/${product.id}`,
    displayPrice: price,
    checkoutPrice: price,
    currency: "EUR",
    availability: { status: "in_stock" },
    shippingProfile: serviceShippingProfile,
    fulfillmentProvider: "service",
    sellable: true,
    variants: [baseVariant("default", product.name, price)],
    metadata: {
      division: product.division,
      kind: product.kind,
      timeline: product.timeline || null,
    },
  });
}

export function isCommerceBrandId(value: string): value is CommerceBrandId {
  return ["wear", "core", "production", "talents"].includes(value);
}
