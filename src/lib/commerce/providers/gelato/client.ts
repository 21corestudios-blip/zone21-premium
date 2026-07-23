interface GelatoClientOptions {
  apiKey?: string;
  storeId?: string;
  baseUrl?: string;
  productBaseUrl?: string;
}

export interface GelatoProductVariant {
  id: string;
  sku?: string;
  price?: number;
  currency?: string;
  available?: boolean;
}

export interface GelatoProduct {
  id: string;
  title: string;
  variants?: GelatoProductVariant[];
}

export interface GelatoCatalog {
  catalogUid: string;
  title: string;
}

export interface GelatoCatalogProduct {
  productUid: string;
  attributes: Record<string, string>;
  supportedCountries: string[];
  weight?: { value: number; measureUnit: string };
  dimensions?: Record<string, { value: number; measureUnit: string }>;
}

export interface GelatoShippingQuoteRequest {
  orderReferenceId: string;
  customerReferenceId: string;
  productUid: string;
  itemReferenceId: string;
  files: GelatoPrintFile[];
  quantity: number;
  currency: string;
  country: string;
  postalCode?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
}

export interface GelatoPrintFile {
  type: string;
  url: string;
}

export interface GelatoOrderCreateRequest extends GelatoShippingQuoteRequest {
  shipmentMethodUid?: string;
}

export interface GelatoOrderStatus {
  id?: string;
  orderId?: string;
  status?: string;
  trackingInfo?: unknown;
  shipments?: unknown;
}

export class GelatoClient {
  private readonly apiKey?: string;
  private readonly storeId?: string;
  private readonly baseUrl: string;
  private readonly productBaseUrl: string;

  constructor(options: GelatoClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.GELATO_API_KEY;
    this.storeId = options.storeId || process.env.GELATO_STORE_ID;
    this.baseUrl =
      options.baseUrl ||
      process.env.GELATO_API_BASE_URL ||
      "https://order.gelatoapis.com";
    this.productBaseUrl =
      options.productBaseUrl ||
      process.env.GELATO_PRODUCT_API_BASE_URL ||
      "https://product.gelatoapis.com";
  }

  get configured() {
    return Boolean(this.apiKey);
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
    baseUrl = this.baseUrl,
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error("GELATO_API_KEY is not configured.");
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "X-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        `Gelato request failed with ${response.status}${
          responseText ? `: ${responseText.slice(0, 300)}` : ""
        }.`,
      );
    }

    return (await response.json()) as T;
  }

  async listProducts() {
    if (!this.storeId) {
      throw new Error("GELATO_STORE_ID is not configured.");
    }

    return this.request<{ products?: GelatoProduct[] }>(
      `/v1/stores/${this.storeId}/products`,
      undefined,
      "https://ecommerce.gelatoapis.com",
    );
  }

  async getProduct(productUid: string) {
    return this.request<{
      productUid: string;
      attributes: Record<string, string>;
      supportedCountries: string[];
      notSupportedCountries: string[];
      isStockable: boolean;
      isPrintable: boolean;
    }>(
      `/v3/products/${encodeURIComponent(productUid)}`,
      undefined,
      this.productBaseUrl,
    );
  }

  async listCatalogs() {
    return this.request<GelatoCatalog[]>(
      "/v3/catalogs",
      undefined,
      this.productBaseUrl,
    );
  }

  async searchCatalogProducts({
    catalogUid,
    attributeFilters = {},
    limit = 100,
    offset = 0,
  }: {
    catalogUid: string;
    attributeFilters?: Record<string, string[]>;
    limit?: number;
    offset?: number;
  }) {
    return this.request<{
      products: GelatoCatalogProduct[];
      hits?: unknown;
    }>(
      `/v3/catalogs/${encodeURIComponent(catalogUid)}/products:search`,
      {
        method: "POST",
        body: JSON.stringify({ attributeFilters, limit, offset }),
      },
      this.productBaseUrl,
    );
  }

  async getRegionAvailability(productUids: string[]) {
    return this.request<{
      productsAvailability: Array<{
        productUid: string;
        availability: Array<{
          stockRegionUid: string;
          status:
            | "in-stock"
            | "out-of-stock-replenishable"
            | "out-of-stock"
            | "non-stockable"
            | "not-supported";
          replenishmentDate?: string | null;
        }>;
      }>;
    }>(
      "/v3/stock/region-availability",
      {
        method: "POST",
        body: JSON.stringify({ products: productUids }),
      },
      this.productBaseUrl,
    );
  }

  async quoteShipping(payload: GelatoShippingQuoteRequest) {
    return this.request<{
      quotes?: Array<{
        id: string;
        shipmentMethods?: Array<{
          name: string;
          shipmentMethodUid: string;
          price: number;
          currency: string;
        }>;
      }>;
    }>(
      "/v4/orders:quote",
      {
        method: "POST",
        body: JSON.stringify({
          orderReferenceId: payload.orderReferenceId,
          customerReferenceId: payload.customerReferenceId,
          currency: payload.currency,
          allowMultipleQuotes: false,
          recipient: {
            country: payload.country,
            firstName: payload.firstName || "ZONE",
            lastName: payload.lastName || "21",
            addressLine1: payload.addressLine1 || "Address pending",
            state: payload.state,
            city: payload.city || "City pending",
            postCode: payload.postalCode,
            email: payload.email,
            phone: payload.phone,
          },
          products: [
            {
              itemReferenceId: payload.itemReferenceId,
              productUid: payload.productUid,
              files: payload.files,
              quantity: payload.quantity,
            },
          ],
        }),
      },
    );
  }

  async createOrder(payload: GelatoOrderCreateRequest) {
    return this.request<{ id?: string; orderId?: string; message?: string }>(
      "/v4/orders",
      {
        method: "POST",
        body: JSON.stringify({
          orderType: "order",
          orderReferenceId: payload.orderReferenceId,
          customerReferenceId: payload.customerReferenceId,
          currency: payload.currency,
          shipmentMethodUid: payload.shipmentMethodUid,
          shippingAddress: {
            country: payload.country,
            firstName: payload.firstName || "ZONE",
            lastName: payload.lastName || "21",
            addressLine1: payload.addressLine1 || "Address pending",
            state: payload.state,
            city: payload.city || "City pending",
            postCode: payload.postalCode,
            email: payload.email,
            phone: payload.phone,
          },
          items: [
            {
              itemReferenceId: payload.itemReferenceId,
              productUid: payload.productUid,
              files: payload.files,
              quantity: payload.quantity,
            },
          ],
        }),
      },
    );
  }

  async getOrder(orderId: string) {
    return this.request<GelatoOrderStatus>(`/v4/orders/${orderId}`);
  }
}

export function createGelatoClient() {
  return new GelatoClient();
}
