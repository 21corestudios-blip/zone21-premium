interface GelatoClientOptions {
  apiKey?: string;
  storeId?: string;
  baseUrl?: string;
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

export interface GelatoShippingQuoteRequest {
  productId: string;
  variantId: string;
  quantity: number;
  country: string;
  postalCode?: string;
  city?: string;
}

export class GelatoClient {
  private readonly apiKey?: string;
  private readonly storeId?: string;
  private readonly baseUrl: string;

  constructor(options: GelatoClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.GELATO_API_KEY;
    this.storeId = options.storeId || process.env.GELATO_STORE_ID;
    this.baseUrl =
      options.baseUrl ||
      process.env.GELATO_API_BASE_URL ||
      "https://api.gelato.com";
  }

  get configured() {
    return Boolean(this.apiKey && this.storeId);
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    if (!this.apiKey) {
      throw new Error("GELATO_API_KEY is not configured.");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "X-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Gelato request failed with ${response.status}.`);
    }

    return (await response.json()) as T;
  }

  async listProducts() {
    if (!this.storeId) {
      throw new Error("GELATO_STORE_ID is not configured.");
    }

    return this.request<{ products?: GelatoProduct[] }>(
      `/v4/stores/${this.storeId}/products`,
    );
  }

  async quoteShipping(payload: GelatoShippingQuoteRequest) {
    if (!this.storeId) {
      throw new Error("GELATO_STORE_ID is not configured.");
    }

    return this.request<{ amount?: number; currency?: string }>(
      `/v4/stores/${this.storeId}/shipping/quote`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }
}

export function createGelatoClient() {
  return new GelatoClient();
}
