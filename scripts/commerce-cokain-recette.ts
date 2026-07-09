import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import Stripe from "stripe";

import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

type RegionCode = "EU" | "US-CA" | "AS";

type Destination = {
  label: string;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  regionCode?: RegionCode;
};

type TemplateVariant = {
  id: string;
  title: string;
  productUid: string;
  variantOptions?: Array<{ name?: string; value?: string }>;
};

type TemplateResponse = {
  id: string;
  title?: string;
  templateName?: string;
  variants?: TemplateVariant[];
};

type ProductPriceResponse = Array<{
  country: string;
  currency: string;
  productUid: string;
  quantity: number;
  pageCount: number | null;
  price: number;
  shipmentPrice?: number | null;
}>;

type StockResponse = {
  productsAvailability?: Array<{
    productUid: string;
    availability: Array<{
      stockRegionUid: string;
      status: string;
      replenishmentDate?: string | null;
    }>;
  }>;
};

type QuoteResponse = {
  quotes?: Array<{
    id: string;
    fulfillmentCountry?: string;
    productionCountry?: string;
    products?: Array<{
      itemReferenceId: string;
      productUid: string;
      quantity: number;
      price: number;
      currency: string;
    }>;
    shipmentMethods?: Array<{
      name: string;
      shipmentMethodUid: string;
      price: number | null;
      initialPrice?: number | null;
      currency: string;
      minDeliveryDays?: number;
      maxDeliveryDays?: number;
    }>;
  }>;
  errors?: unknown[];
};

type VariantRecetteResult = {
  sourceFile: string;
  templateId: string;
  templateTitle: string;
  variantId: string;
  variantTitle: string;
  size: string;
  productUid: string;
  stock: Partial<Record<RegionCode, string>>;
  destinations: Array<{
    label: string;
    country: string;
    stockRegion?: RegionCode;
    stockStatus?: string;
    productCostEUR?: number;
    retailPriceEUR?: number;
    marginBeforeShippingEUR?: number;
    shipmentMethodUid?: string;
    shippingName?: string;
    shippingPriceEUR?: number | null;
    totalCostWithKnownShippingEUR?: number | null;
    quoteStatus: "ok" | "blocked";
    quoteIssue?: string;
    decision: "ACTIVER" | "BLOQUER" | "REVOIR";
    decisionReason: string;
  }>;
};

const GELATO_SAMPLE_FILE_URL =
  "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png";

const DEFAULT_CO_KAIN_DIR = path.join(
  os.homedir(),
  "Mon Drive (21corestudios@gmail.com)",
  "ZONE 21 HOLDING",
  "05_PRODUCTS",
  "02_POD",
  "BR-CO-KAIN",
);

const destinations: Destination[] = [
  {
    label: "Europe FR",
    country: "FR",
    city: "Paris",
    postalCode: "75001",
    addressLine1: "10 Rue de Rivoli",
    regionCode: "EU",
  },
  {
    label: "US",
    country: "US",
    city: "New York",
    postalCode: "10001",
    addressLine1: "350 5th Ave",
    regionCode: "US-CA",
  },
  {
    label: "Asie SG",
    country: "SG",
    city: "Singapore",
    postalCode: "018956",
    addressLine1: "10 Bayfront Avenue",
    regionCode: "AS",
  },
  {
    label: "Reste Monde AU",
    country: "AU",
    city: "Sydney",
    postalCode: "2000",
    addressLine1: "1 Martin Place",
    regionCode: "AS",
  },
];

const wantedSizes = new Set(["S", "M", "L", "XL"]);
const userRetailOverrides = new Map<string, number>([
  [
    "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_organic_gsi_s_gco_white_gpr_4-4_inlbl_econscious_ec1000",
    35.86,
  ],
  [
    "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_organic_gsi_m_gco_white_gpr_4-4_inlbl_econscious_ec1000",
    35.86,
  ],
  [
    "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_organic_gsi_l_gco_white_gpr_4-4_inlbl_econscious_ec1000",
    35.86,
  ],
  [
    "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_organic_gsi_xl_gco_white_gpr_4-4_inlbl_econscious_ec1000",
    35.86,
  ],
]);

const args = new Set(process.argv.slice(2));
const scope = getArgValue("--scope") || "launch";
const runStripe = args.has("--stripe");
const smoke = args.has("--smoke");
const outputPath =
  getArgValue("--output") || "/private/tmp/cokain-recette-commerce.json";
const markdownPath = getArgValue("--markdown");
const csvPath = getArgValue("--csv");
const coKainDir = process.env.CO_KAIN_POD_DIR || DEFAULT_CO_KAIN_DIR;

async function main() {
  const apiKey = process.env.GELATO_API_KEY;

  if (!apiKey) {
    throw new Error("GELATO_API_KEY is required.");
  }

  const sourceRoot =
    scope === "all" ? coKainDir : path.join(coKainDir, "03_OFFRE_LANCEMENT");
  const templateRefs = await findTemplateRefs(sourceRoot);
  const selectedTemplateRefs = smoke ? templateRefs.slice(0, 2) : templateRefs;
  console.log(
    `CO-KAIN recette: ${selectedTemplateRefs.length} template(s), scope=${scope}, smoke=${smoke}`,
  );

  const templatePayloads = await mapLimit(selectedTemplateRefs, 4, async (ref) => {
    const template = await gelatoGet<TemplateResponse>(
      `https://ecommerce.gelatoapis.com/v1/templates/${ref.templateId}`,
      apiKey,
    );
    const variants = (template.variants || [])
      .map((variant) => ({
        ...variant,
        size: extractSize(variant),
      }))
      .filter(
        (variant): variant is TemplateVariant & { size: string } =>
          Boolean(variant.size && wantedSizes.has(variant.size)),
      );

    const selectedVariants = smoke
      ? variants.filter((variant) => variant.size === "M").slice(0, 2)
      : variants;

    return selectedVariants.map((variant) => ({
        sourceFile: ref.file,
        templateId: ref.templateId,
        templateTitle: template.title || template.templateName || "Untitled template",
        variantId: variant.id,
        variantTitle: variant.title,
        size: variant.size,
        productUid: variant.productUid,
      }));
  });

  const variantInputs = templatePayloads.flat();
  const selectedDestinations = smoke ? destinations.slice(0, 3) : destinations;
  const uniqueProductUids = [...new Set(variantInputs.map((variant) => variant.productUid))];
  console.log(
    `CO-KAIN recette: ${variantInputs.length} variant(s), ${selectedDestinations.length} destination(s), ${uniqueProductUids.length} productUid unique(s)`,
  );

  const stock = await getStock(uniqueProductUids, apiKey);

  const templateResults = await mapLimit(variantInputs, 6, async (variant) => {
    const stockByRegion = stock[variant.productUid] || {};
    const destinationResults = await mapLimit(selectedDestinations, 3, (destination) =>
      inspectDestination(variant.productUid, stockByRegion, destination, apiKey),
    );

    return {
      ...variant,
      stock: stockByRegion,
      destinations: destinationResults,
    };
  });

  const stripeResult = runStripe ? await runStripePaymentTest(templateResults) : null;
  const report = {
    scope,
    sourceRoot,
    smoke,
    marginRule:
      "retailPriceEUR = productCostEUR / (1 - 0.50), rounded to cents; user overrides win.",
    gelatoOrderCreated: false,
    stripePaymentTestRequested: runStripe,
    stripeResult,
    summary: summarize(templateResults),
    results: templateResults,
  };

  await writeFile(outputPath, JSON.stringify(report, null, 2));
  if (markdownPath) {
    await writeFile(markdownPath, buildMarkdownReport(report));
  }
  if (csvPath) {
    await writeFile(csvPath, buildCsv(report));
  }
  printSummary(report);
}

function getArgValue(name: string) {
  const prefix = `${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

async function findTemplateRefs(root: string) {
  const files = await walk(root);
  const refs = new Map<string, { templateId: string; file: string }>();
  const uuidPattern =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

  for (const file of files.filter((entry) => /\.(rtf|txt|md)$/i.test(entry))) {
    const text = await readFile(file, "utf8");

    for (const match of text.matchAll(uuidPattern)) {
      refs.set(match[0], { templateId: match[0], file });
    }
  }

  return [...refs.values()].sort((a, b) => a.file.localeCompare(b.file));
}

async function walk(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function gelatoGet<T>(url: string, apiKey: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const response = await fetch(url, {
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Gelato GET failed ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

async function gelatoPost<T>(url: string, apiKey: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Gelato POST failed ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

async function getProductCost(
  productUid: string,
  destination: Destination,
  apiKey: string,
) {
  const prices = await gelatoGet<ProductPriceResponse>(
    `https://product.gelatoapis.com/v3/products/${productUid}/prices?country=${destination.country}&currency=EUR`,
    apiKey,
  );

  return prices.find((price) => price.quantity === 1) || prices[0];
}

async function getStock(productUids: string[], apiKey: string) {
  const response = await gelatoPost<StockResponse>(
    "https://product.gelatoapis.com/v3/stock/region-availability",
    apiKey,
    { products: productUids },
  );
  const stock: Record<string, Partial<Record<RegionCode, string>>> = {};

  for (const product of response.productsAvailability || []) {
    stock[product.productUid] = {};

    for (const availability of product.availability) {
      if (["EU", "US-CA", "AS"].includes(availability.stockRegionUid)) {
        stock[product.productUid][availability.stockRegionUid as RegionCode] =
          availability.status;
      }
    }
  }

  return stock;
}

async function inspectDestination(
  productUid: string,
  stockByRegion: Partial<Record<RegionCode, string>>,
  destination: Destination,
  apiKey: string,
): Promise<VariantRecetteResult["destinations"][number]> {
  let price: ProductPriceResponse[number] | undefined;
  let quote: QuoteResponse | undefined;
  let quoteStatus: "ok" | "blocked" = "ok";
  let quoteIssue: string | undefined;

  try {
    price = await getProductCost(productUid, destination, apiKey);
  } catch (error) {
    quoteStatus = "blocked";
    quoteIssue = `product_cost_error:${error instanceof Error ? error.message : "unknown"}`;
  }

  try {
    quote = await quoteDestination(productUid, destination, apiKey);
  } catch (error) {
    quoteStatus = "blocked";
    quoteIssue = `quote_error:${error instanceof Error ? error.message : "unknown"}`;
  }

  const shipping = quote?.quotes?.[0]?.shipmentMethods?.[0];
  const productCostEUR = price?.price;
  const retailPriceEUR =
    typeof productCostEUR === "number"
      ? getRetailPrice(productUid, productCostEUR)
      : undefined;
  const shippingPriceEUR = shipping?.price;

  if (quote?.errors?.length) {
    quoteStatus = "blocked";
    quoteIssue = "quote_errors";
  } else if (shipping && typeof shipping.price !== "number") {
    quoteIssue = "shipping_price_null";
  } else if (!shipping) {
    quoteIssue = quoteIssue || "shipping_method_missing";
  }

  const stockStatus = destination.regionCode
    ? stockByRegion[destination.regionCode]
    : undefined;
  const decision = decideDestination({
    stockStatus,
    productCostEUR,
    shippingPriceEUR,
    quoteStatus,
    quoteIssue,
  });

  return {
    label: destination.label,
    country: destination.country,
    stockRegion: destination.regionCode,
    stockStatus,
    productCostEUR,
    retailPriceEUR,
    marginBeforeShippingEUR:
      typeof retailPriceEUR === "number" && typeof productCostEUR === "number"
        ? roundMoney(retailPriceEUR - productCostEUR)
        : undefined,
    shipmentMethodUid: shipping?.shipmentMethodUid,
    shippingName: shipping?.name,
    shippingPriceEUR,
    totalCostWithKnownShippingEUR:
      typeof productCostEUR === "number" && typeof shippingPriceEUR === "number"
        ? roundMoney(productCostEUR + shippingPriceEUR)
        : null,
    quoteStatus,
    quoteIssue,
    decision: decision.status,
    decisionReason: decision.reason,
  };
}

function decideDestination(input: {
  stockStatus?: string;
  productCostEUR?: number;
  shippingPriceEUR?: number | null;
  quoteStatus: "ok" | "blocked";
  quoteIssue?: string;
}) {
  if (input.stockStatus !== "in-stock") {
    return {
      status: "BLOQUER" as const,
      reason: input.stockStatus
        ? `stock_region_${input.stockStatus}`
        : "stock_region_unknown",
    };
  }

  if (typeof input.productCostEUR !== "number") {
    return { status: "BLOQUER" as const, reason: "product_cost_missing" };
  }

  if (input.quoteStatus === "blocked") {
    return { status: "BLOQUER" as const, reason: input.quoteIssue || "quote_blocked" };
  }

  if (typeof input.shippingPriceEUR === "number") {
    return { status: "ACTIVER" as const, reason: "stock_cost_shipping_ok" };
  }

  return {
    status: "REVOIR" as const,
    reason: input.quoteIssue || "shipping_price_missing",
  };
}

async function quoteDestination(
  productUid: string,
  destination: Destination,
  apiKey: string,
) {
  return gelatoPost<QuoteResponse>(
    "https://order.gelatoapis.com/v4/orders:quote",
    apiKey,
    {
      orderReferenceId: `CO-KAIN-RECETTE-${destination.country}-${Date.now()}`,
      customerReferenceId: "zone21-recette",
      currency: "EUR",
      allowMultipleQuotes: false,
      recipient: {
        country: destination.country,
        firstName: "ZONE",
        lastName: "21",
        addressLine1: destination.addressLine1,
        city: destination.city,
        postCode: destination.postalCode,
        email: "recette@zone21.test",
        phone: "+33100000000",
      },
      products: [
        {
          itemReferenceId: `item-${destination.country}`,
          productUid,
          files: [{ type: "default", url: GELATO_SAMPLE_FILE_URL }],
          quantity: 1,
        },
      ],
    },
  );
}

function extractSize(variant: TemplateVariant) {
  for (const option of variant.variantOptions || []) {
    if (option.value && wantedSizes.has(option.value)) {
      return option.value;
    }
  }

  const normalizedTitle = ` ${variant.title} `;

  for (const size of ["XS", "S", "M", "L", "XL", "2XL", "3XL"]) {
    if (normalizedTitle.includes(` ${size} `) || normalizedTitle.includes(`- ${size} -`)) {
      return size;
    }
  }

  const uidMatch = variant.productUid.match(/_gsi_(xs|s|m|l|xl|2xl|3xl)_/i);

  return uidMatch?.[1]?.toUpperCase();
}

function getRetailPrice(productUid: string, productCostEUR: number) {
  return userRetailOverrides.get(productUid) || roundMoney(productCostEUR / 0.5);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

async function mapLimit<T, R>(
  values: T[],
  limit: number,
  mapper: (value: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(values[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, () => worker()),
  );

  return results;
}

function buildCsv(report: { results: VariantRecetteResult[] }) {
  const rows = [
    [
      "decision",
      "reason",
      "template_title",
      "variant_title",
      "size",
      "destination",
      "country",
      "stock_region",
      "stock_status",
      "product_cost_eur",
      "retail_price_eur",
      "margin_before_shipping_eur",
      "shipping_name",
      "shipping_price_eur",
      "total_cost_known_shipping_eur",
      "template_id",
      "variant_id",
      "product_uid",
      "source_file",
    ],
  ];

  for (const result of report.results) {
    for (const destination of result.destinations) {
      rows.push([
        destination.decision,
        destination.decisionReason,
        result.templateTitle,
        result.variantTitle,
        result.size,
        destination.label,
        destination.country,
        destination.stockRegion || "",
        destination.stockStatus || "",
        moneyCell(destination.productCostEUR),
        moneyCell(destination.retailPriceEUR),
        moneyCell(destination.marginBeforeShippingEUR),
        destination.shippingName || "",
        moneyCell(destination.shippingPriceEUR),
        moneyCell(destination.totalCostWithKnownShippingEUR),
        result.templateId,
        result.variantId,
        result.productUid,
        result.sourceFile,
      ]);
    }
  }

  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function buildMarkdownReport(report: {
  scope: string;
  sourceRoot: string;
  smoke: boolean;
  marginRule: string;
  gelatoOrderCreated: boolean;
  summary: ReturnType<typeof summarize>;
  results: VariantRecetteResult[];
}) {
  const decisionCounts = countDecisions(report.results);
  const lines = [
    "# AUD-CO-POD - Matrice activation Gelato CO-KAIN",
    "",
    `- Date: ${new Date().toISOString()}`,
    `- Scope: ${report.scope}`,
    `- Source: ${report.sourceRoot}`,
    `- Mode smoke: ${report.smoke ? "oui" : "non"}`,
    `- Commande Gelato creee: ${report.gelatoOrderCreated ? "oui" : "non"}`,
    `- Regle prix public: ${report.marginRule}`,
    `- Override utilisateur: Econscious EC1000 blanc S/M/L/XL = 35.86 EUR TTC`,
    "",
    "## Synthese",
    "",
    `- Variantes analysees: ${report.summary.variants}`,
    `- Couples variante/destination: ${report.summary.destinationChecks}`,
    `- ACTIVER: ${decisionCounts.ACTIVER}`,
    `- REVOIR: ${decisionCounts.REVOIR}`,
    `- BLOQUER: ${decisionCounts.BLOQUER}`,
    `- Livraisons avec prix: ${report.summary.pricedShippingChecks}`,
    `- Livraisons null: ${report.summary.nullShippingChecks}`,
    "",
    "## Regle de decision",
    "",
    "- ACTIVER: stock regional `in-stock`, cout produit present, prix de livraison chiffre.",
    "- REVOIR: stock et cout presents, mais livraison sans prix chiffre ou methode absente.",
    "- BLOQUER: stock regional indisponible/inconnu, cout produit absent ou quote bloquee.",
    "",
    "## Matrice",
    "",
    "| Decision | Produit | Variante | Taille | Destination | Stock | Cout produit EUR | Prix vente EUR | Livraison EUR | Marge avant livraison EUR | Total cout connu EUR | Raison |",
    "|---|---|---|---:|---|---|---:|---:|---:|---:|---:|---|",
  ];

  for (const result of report.results) {
    for (const destination of result.destinations) {
      lines.push(
        [
          `| ${destination.decision}`,
          markdownCell(result.templateTitle),
          markdownCell(result.variantTitle),
          result.size,
          markdownCell(`${destination.label} (${destination.country})`),
          markdownCell(`${destination.stockRegion || "?"}:${destination.stockStatus || "?"}`),
          moneyCell(destination.productCostEUR),
          moneyCell(destination.retailPriceEUR),
          moneyCell(destination.shippingPriceEUR),
          moneyCell(destination.marginBeforeShippingEUR),
          moneyCell(destination.totalCostWithKnownShippingEUR),
          markdownCell(destination.decisionReason),
        ].join(" | ") + " |",
      );
    }
  }

  return lines.join("\n") + "\n";
}

function countDecisions(results: VariantRecetteResult[]) {
  const counts = { ACTIVER: 0, BLOQUER: 0, REVOIR: 0 };

  for (const result of results) {
    for (const destination of result.destinations) {
      counts[destination.decision] += 1;
    }
  }

  return counts;
}

function moneyCell(value: number | null | undefined) {
  return typeof value === "number" ? value.toFixed(2) : "";
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function markdownCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function runStripePaymentTest(results: VariantRecetteResult[]) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return { status: "skipped", reason: "STRIPE_SECRET_KEY missing" };
  }

  if (!secretKey.startsWith("sk_test_")) {
    return { status: "blocked", reason: "Stripe key is not a test key" };
  }

  const firstPrice = results
    .flatMap((result) => result.destinations)
    .find((destination) => typeof destination.retailPriceEUR === "number");

  if (!firstPrice?.retailPriceEUR) {
    return { status: "skipped", reason: "No retail price available" };
  }

  const stripe = new Stripe(secretKey);
  const amount = Math.round(firstPrice.retailPriceEUR * 100);
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    payment_method: "pm_card_visa",
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    metadata: {
      checkout_source: "zone21-cokain-recette",
      gelato_order_created: "false",
      margin_rule: "cost_x2_for_50_percent_margin",
    },
  });

  return {
    status: intent.status,
    paymentIntentId: intent.id,
    amountCents: intent.amount,
    currency: intent.currency,
    livemode: intent.livemode,
  };
}

function summarize(results: VariantRecetteResult[]) {
  const destinations = results.flatMap((result) => result.destinations);

  return {
    variants: results.length,
    destinationChecks: destinations.length,
    inStockChecks: destinations.filter((destination) => destination.stockStatus === "in-stock")
      .length,
    unavailableChecks: destinations.filter(
      (destination) => destination.stockStatus === "unavailable",
    ).length,
    pricedShippingChecks: destinations.filter(
      (destination) => typeof destination.shippingPriceEUR === "number",
    ).length,
    nullShippingChecks: destinations.filter(
      (destination) => destination.shippingPriceEUR === null,
    ).length,
  };
}

function printSummary(report: {
  scope: string;
  sourceRoot: string;
  gelatoOrderCreated: boolean;
  stripeResult: unknown;
  summary: ReturnType<typeof summarize>;
  results: VariantRecetteResult[];
}) {
  console.log(
    JSON.stringify(
      {
        scope: report.scope,
        sourceRoot: report.sourceRoot,
        smoke: "smoke" in report ? report.smoke : undefined,
        gelatoOrderCreated: report.gelatoOrderCreated,
        stripeResult: report.stripeResult,
        summary: report.summary,
        firstResults: report.results.slice(0, 5).map((result) => ({
          templateTitle: result.templateTitle,
          variantTitle: result.variantTitle,
          productUid: result.productUid,
          stock: result.stock,
          destinations: result.destinations,
        })),
        outputPath,
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
