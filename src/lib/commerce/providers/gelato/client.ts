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
  orderReferenceId: string;
  customerReferenceId: string;
  productUid: string;
  itemReferenceId: string;
  fileUrl: string;
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

export interface GelatoOrderCreateRequest extends GelatoShippingQuoteRequest {
  shipmentMethodUid?: string;
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
      "https://order.gelatoapis.com";
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
              fileUrl: payload.fileUrl,
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
              fileUrl: payload.fileUrl,
              quantity: payload.quantity,
            },
          ],
        }),
      },
    );
  }
}

export function createGelatoClient() {
  return new GelatoClient();
}
