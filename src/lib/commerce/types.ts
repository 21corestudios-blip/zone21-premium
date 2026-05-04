export const commerceBrandIds = [
  "wear",
  "core",
  "production",
  "talents",
] as const;

export type CommerceBrandId = (typeof commerceBrandIds)[number];

export type CommerceSource = "internal" | "printify" | "gelato";

export type FulfillmentProvider =
  | "internal"
  | "digital"
  | "service"
  | "printify"
  | "gelato";

export type AvailabilityStatus =
  | "in_stock"
  | "made_to_order"
  | "preorder"
  | "unavailable";

export type CurrencyCode = "EUR" | "USD";

export interface CommerceMoney {
  amountCents: number;
  currency: CurrencyCode;
}

export interface CommerceMedia {
  src: string;
  alt: string;
  role?: "primary" | "gallery" | "preview";
}

export interface CommerceShippingProfile {
  id: string;
  shipsPhysicalGoods: boolean;
  requiresAddress: boolean;
  regions?: string[];
}

export interface CommerceAvailability {
  status: AvailabilityStatus;
  availableQuantity?: number;
  preorderShipsAt?: string;
}

export interface CommerceProductVariant {
  id: string;
  sourceVariantId?: string;
  sku?: string;
  title: string;
  displayPrice: CommerceMoney;
  checkoutPrice: CommerceMoney;
  availability: CommerceAvailability;
  fulfillmentProvider: FulfillmentProvider;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface CommerceProduct {
  id: string;
  slug: string;
  brand: CommerceBrandId;
  source: CommerceSource;
  sourceProductId?: string;
  sourceVariantId?: string;
  sku?: string;
  title: string;
  descriptionShort: string;
  media: CommerceMedia[];
  editorialContentRef?: string;
  displayPrice: CommerceMoney;
  checkoutPrice: CommerceMoney;
  currency: CurrencyCode;
  availability: CommerceAvailability;
  shippingProfile: CommerceShippingProfile;
  fulfillmentProvider: FulfillmentProvider;
  sellable: boolean;
  variants: CommerceProductVariant[];
  metadata: Record<string, string | number | boolean | null>;
}

export interface CommerceLineInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CommerceCartLine {
  lineId: string;
  productId: string;
  variantId: string;
  brand: CommerceBrandId;
  source: CommerceSource;
  quantity: number;
  displayPrice: CommerceMoney;
  checkoutPrice: CommerceMoney;
  currency: CurrencyCode;
  fulfillmentProvider: FulfillmentProvider;
  metadata: Record<string, string | number | boolean | null>;
}

export interface CommerceBrandSubtotal {
  brand: CommerceBrandId;
  amountCents: number;
  currency: CurrencyCode;
}

export interface CommerceCartValidation {
  lines: CommerceCartLine[];
  brandSubtotals: CommerceBrandSubtotal[];
  total: CommerceMoney;
}

export interface CommerceCustomer {
  email: string;
  fullName?: string;
  phone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    postalCode?: string;
    city?: string;
    country: string;
  };
}

export interface CommerceBusinessError {
  code: string;
  message: string;
}
