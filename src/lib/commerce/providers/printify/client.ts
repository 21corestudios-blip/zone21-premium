interface PrintifyClientOptions {
  token?: string;
  shopId?: string;
  baseUrl?: string;
}

export interface PrintifyProductVariant {
  id: number;
  sku?: string;
  price?: number;
  is_enabled?: boolean;
  is_available?: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  variants?: PrintifyProductVariant[];
}

export interface PrintifyShippingQuoteRequest {
  blueprint_id?: number;
  print_provider_id?: number;
  variant_id: number;
  quantity: number;
  address_to: {
    country: string;
    region?: string;
    city?: string;
    zip?: string;
  };
}

export interface PrintifyOrderCreateRequest {
  external_id: string;
  line_items: Array<{
    product_id: string;
    variant_id: number;
    quantity: number;
  }>;
  shipping_method?: number;
  send_shipping_notification?: boolean;
  address_to: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    country: string;
    region?: string;
    address1: string;
    address2?: string;
    city: string;
    zip?: string;
  };
}

export class PrintifyClient {
  private readonly token?: string;
  private readonly shopId?: string;
  private readonly baseUrl: string;

  constructor(options: PrintifyClientOptions = {}) {
    this.token = options.token || process.env.PRINTIFY_API_TOKEN;
    this.shopId = options.shopId || process.env.PRINTIFY_SHOP_ID;
    this.baseUrl =
      options.baseUrl ||
      process.env.PRINTIFY_API_BASE_URL ||
      "https://api.printify.com/v1";
  }

  get configured() {
    return Boolean(this.token && this.shopId);
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    if (!this.token) {
      throw new Error("PRINTIFY_API_TOKEN is not configured.");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Printify request failed with ${response.status}.`);
    }

    return (await response.json()) as T;
  }

  async listProducts() {
    if (!this.shopId) {
      throw new Error("PRINTIFY_SHOP_ID is not configured.");
    }

    return this.request<{ data?: PrintifyProduct[] }>(
      `/shops/${this.shopId}/products.json`,
    );
  }

  async getProduct(productId: string) {
    if (!this.shopId) {
      throw new Error("PRINTIFY_SHOP_ID is not configured.");
    }

    return this.request<PrintifyProduct>(
      `/shops/${this.shopId}/products/${productId}.json`,
    );
  }

  async quoteShipping(payload: PrintifyShippingQuoteRequest) {
    if (!this.shopId) {
      throw new Error("PRINTIFY_SHOP_ID is not configured.");
    }

    return this.request<{ standard?: number; express?: number }>(
      `/shops/${this.shopId}/orders/shipping.json`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  async createOrder(payload: PrintifyOrderCreateRequest) {
    if (!this.shopId) {
      throw new Error("PRINTIFY_SHOP_ID is not configured.");
    }

    return this.request<{ id?: string; status?: string }>(
      `/shops/${this.shopId}/orders.json`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }
}

export function createPrintifyClient() {
  return new PrintifyClient();
}
