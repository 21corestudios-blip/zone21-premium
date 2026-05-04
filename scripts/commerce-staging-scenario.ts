import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

const requiredEnvironment = [
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CONNECT_ACCOUNT_WEAR",
  "PRINTIFY_API_TOKEN",
  "PRINTIFY_SHOP_ID",
  "GELATO_API_KEY",
  "GELATO_STORE_ID",
];

async function main() {
  const missing = requiredEnvironment.filter((key) => !process.env[key]);

  if (process.env.APP_ENV === "production") {
    throw new Error("Run the staging scenario outside production.");
  }

  if (process.env.WEAR_ALLOW_ESTIMATED_QUOTES === "true") {
    throw new Error("WEAR_ALLOW_ESTIMATED_QUOTES must be false for staging.");
  }

  if (missing.length) {
    console.error(
      JSON.stringify(
        {
          status: "blocked",
          reason: "missing required environment",
          missing,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  if (process.env.COMMERCE_STAGING_SCENARIO_RUN !== "true") {
    console.log(
      JSON.stringify(
        {
          status: "armed",
          next: "Set COMMERCE_STAGING_SCENARIO_RUN=true to create a real Stripe test Checkout Session.",
        },
        null,
        2,
      ),
    );
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/commerce/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          productId:
            process.env.COMMERCE_STAGING_WEAR_PRODUCT_ID || "classic-tee-01",
          variantId: process.env.COMMERCE_STAGING_WEAR_VARIANT_ID || "M",
          quantity: 1,
        },
        {
          productId:
            process.env.COMMERCE_STAGING_SECOND_PRODUCT_ID ||
            "brand-signature-system",
          variantId: process.env.COMMERCE_STAGING_SECOND_VARIANT_ID || "default",
          quantity: 1,
        },
      ],
      customer: {
        email:
          process.env.COMMERCE_STAGING_CUSTOMER_EMAIL || "staging@zone21.test",
        fullName: "ZONE 21 Staging",
        shippingAddress: {
          line1: process.env.COMMERCE_STAGING_ADDRESS_LINE1 || "1 rue de test",
          postalCode: process.env.COMMERCE_STAGING_POSTAL_CODE || "75001",
          city: process.env.COMMERCE_STAGING_CITY || "Paris",
          country: process.env.COMMERCE_STAGING_COUNTRY || "FR",
        },
      },
      successUrl: `${baseUrl}/wear/checkout/success?scenario=lot5`,
      cancelUrl: `${baseUrl}/wear/checkout?scenario=lot5-cancel`,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    console.error(
      JSON.stringify(
        {
          status: "checkout_failed",
          httpStatus: response.status,
          body,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        status: "checkout_created",
        orderId: body.orderId,
        checkoutSessionId: body.checkoutSessionId,
        checkoutUrl: body.url,
        next: [
          "Pay with a Stripe test card.",
          "Confirm checkout.session.completed is received by /api/commerce/webhooks/stripe.",
          "Run npm run commerce:webhooks:replay -- --event=<event_id> --force to verify idempotence.",
          "Run npm run commerce:provider-orders:refresh to refresh provider status.",
        ],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
