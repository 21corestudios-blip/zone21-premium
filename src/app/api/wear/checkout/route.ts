import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getWearProductById, isWearProductSize } from "@/data/wear.products";

interface CheckoutRequestBody {
  mode?: "create_intent" | "prepare_payment";
  paymentIntentClientSecret?: string;
  orderReference?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    notes?: string;
  };
  items?: Array<{
    productId?: string;
    size?: string;
    quantity?: number;
  }>;
}

type ValidatedCustomer = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  notes: string;
};

type ValidatedItem = {
  productId: string;
  size: string;
  quantity: number;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOrderReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `Z21W-${timestamp}`;
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY manquante.");
  }

  return new Stripe(secretKey);
}

function validateItems(items: CheckoutRequestBody["items"]): {
  validatedItems: ValidatedItem[];
  subtotalCents: number;
  itemCount: number;
} {
  if (!items?.length) {
    throw new Error("Le panier est vide.");
  }

  const validatedItems: ValidatedItem[] = [];
  let itemCount = 0;
  let subtotalCents = 0;

  for (const item of items) {
    if (
      !item.productId ||
      !item.size ||
      typeof item.quantity !== "number" ||
      item.quantity < 1
    ) {
      throw new Error("Une ligne du panier est invalide.");
    }

    if (!isWearProductSize(item.size)) {
      throw new Error("Une taille de produit est invalide.");
    }

    const product = getWearProductById(item.productId);

    if (!product) {
      throw new Error("Un produit de la sélection est introuvable.");
    }

    if (!product.availableSizes.includes(item.size)) {
      throw new Error("Une taille n’est plus disponible pour cette pièce.");
    }

    const quantity = Math.min(Math.floor(item.quantity), 10);

    validatedItems.push({
      productId: item.productId,
      size: item.size,
      quantity,
    });

    itemCount += quantity;
    subtotalCents += product.priceCents * quantity;
  }

  return {
    validatedItems,
    subtotalCents,
    itemCount,
  };
}

function validateCustomer(customer: CheckoutRequestBody["customer"]): ValidatedCustomer {
  if (!customer) {
    throw new Error("Les informations client sont requises.");
  }

  if (
    !customer.fullName?.trim() ||
    !customer.email?.trim() ||
    !customer.phone?.trim() ||
    !customer.city?.trim() ||
    !customer.country?.trim()
  ) {
    throw new Error("Merci de compléter tous les champs obligatoires.");
  }

  if (!isValidEmail(customer.email.trim())) {
    throw new Error("L’adresse email n’est pas valide.");
  }

  return {
    fullName: customer.fullName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    city: customer.city.trim(),
    country: customer.country.trim(),
    notes: customer.notes?.trim().slice(0, 300) ?? "",
  };
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Le contenu du checkout est invalide." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripeClient();
    const { itemCount, subtotalCents, validatedItems } = validateItems(body.items);

    if (body.mode === "create_intent") {
      const orderReference = generateOrderReference();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: subtotalCents,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          order_reference: orderReference,
          checkout_source: "zone21-wear-custom",
          item_count: String(itemCount),
          item_summary: validatedItems
            .map((item) => `${item.productId}:${item.size}:${item.quantity}`)
            .join("|")
            .slice(0, 500),
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error("Stripe n’a pas renvoyé de client secret.");
      }

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        orderReference,
      });
    }

    if (body.mode === "prepare_payment") {
      if (!body.paymentIntentClientSecret) {
        throw new Error("Le client secret du PaymentIntent est manquant.");
      }

      const customer = validateCustomer(body.customer);
      const paymentIntentId = body.paymentIntentClientSecret.split("_secret_")[0];
      const orderReference = body.orderReference?.trim() || generateOrderReference();

      const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: subtotalCents,
        receipt_email: customer.email,
        metadata: {
          order_reference: orderReference,
          checkout_source: "zone21-wear-custom",
          item_count: String(itemCount),
          item_summary: validatedItems
            .map((item) => `${item.productId}:${item.size}:${item.quantity}`)
            .join("|")
            .slice(0, 500),
          customer_name: customer.fullName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_city: customer.city,
          customer_country: customer.country,
          customer_notes: customer.notes,
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error("Stripe n’a pas renvoyé de client secret.");
      }

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        orderReference: paymentIntent.metadata.order_reference || orderReference,
      });
    }

    return NextResponse.json(
      { error: "Mode de checkout inconnu." },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de préparer le paiement.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
