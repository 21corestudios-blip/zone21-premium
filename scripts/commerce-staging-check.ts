import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

type CheckStatus = "ok" | "warning" | "blocked";

type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

const requiredEnvironment = [
  "DATABASE_URL",
  "APP_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "STORYBLOK_PUBLIC_TOKEN",
  "STORYBLOK_PREVIEW_TOKEN",
  "STORYBLOK_PREVIEW_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_CONNECT_ACCOUNT_WEAR",
  "PRINTIFY_API_TOKEN",
  "PRINTIFY_SHOP_ID",
  "GELATO_API_KEY",
  "GELATO_STORE_ID",
];

const optionalBrandAccounts = [
  "STRIPE_CONNECT_ACCOUNT_CORE",
  "STRIPE_CONNECT_ACCOUNT_PRODUCTION",
  "STRIPE_CONNECT_ACCOUNT_TALENTS",
];

async function main() {
  const results: CheckResult[] = [];

  for (const key of requiredEnvironment) {
    results.push(checkRequiredEnv(key));
  }

  for (const key of optionalBrandAccounts) {
    results.push(checkOptionalEnv(key));
  }

  results.push(checkEstimatedQuotes());
  results.push(checkSiteUrl());

  if (process.env.COMMERCE_STAGING_PUBLIC_CHECK === "true") {
    results.push(...(await checkPublicRoutes()));
  } else {
    results.push({
      name: "public-route-check",
      status: "warning",
      detail:
        "Skipped. Set COMMERCE_STAGING_PUBLIC_CHECK=true with a public HTTPS NEXT_PUBLIC_SITE_URL.",
    });
  }

  const blocked = results.filter((result) => result.status === "blocked");

  console.log(
    JSON.stringify(
      {
        status: blocked.length ? "blocked" : "ok",
        appEnv: process.env.APP_ENV || "unset",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "unset",
        results,
      },
      null,
      2,
    ),
  );

  if (blocked.length) {
    process.exit(1);
  }
}

function checkRequiredEnv(key: string): CheckResult {
  const value = process.env[key];

  if (!value) {
    return { name: key, status: "blocked", detail: "missing" };
  }

  if (isPlaceholder(value)) {
    return { name: key, status: "blocked", detail: "placeholder value" };
  }

  return { name: key, status: "ok", detail: "configured" };
}

function checkOptionalEnv(key: string): CheckResult {
  const value = process.env[key];

  if (!value) {
    return {
      name: key,
      status: "warning",
      detail: "missing; required before multi-brand transfer validation",
    };
  }

  if (isPlaceholder(value)) {
    return { name: key, status: "blocked", detail: "placeholder value" };
  }

  return { name: key, status: "ok", detail: "configured" };
}

function checkEstimatedQuotes(): CheckResult {
  if (process.env.WEAR_ALLOW_ESTIMATED_QUOTES === "true") {
    return {
      name: "WEAR_ALLOW_ESTIMATED_QUOTES",
      status: process.env.APP_ENV === "local" ? "warning" : "blocked",
      detail: "estimated quotes enabled",
    };
  }

  return {
    name: "WEAR_ALLOW_ESTIMATED_QUOTES",
    status: "ok",
    detail: "false or unset",
  };
}

function checkSiteUrl(): CheckResult {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return { name: "staging-url", status: "blocked", detail: "missing" };
  }

  if (siteUrl.startsWith("http://localhost") || siteUrl.includes("127.0.0.1")) {
    return {
      name: "staging-url",
      status: "blocked",
      detail: "local URL cannot validate public Stripe webhooks",
    };
  }

  if (!siteUrl.startsWith("https://")) {
    return {
      name: "staging-url",
      status: "blocked",
      detail: "HTTPS public URL required",
    };
  }

  return { name: "staging-url", status: "ok", detail: siteUrl };
}

async function checkPublicRoutes(): Promise<CheckResult[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [{ name: "public-routes", status: "blocked", detail: "missing URL" }];
  }

  const targets = [
    { path: "/", expected: [200] },
    { path: "/a-propos", expected: [200] },
    { path: "/ecosysteme", expected: [200] },
    { path: "/contact", expected: [200] },
    { path: "/api/commerce/webhooks/stripe", expected: [400, 405] },
  ];
  const results: CheckResult[] = [];

  for (const target of targets) {
    try {
      const response = await fetch(`${siteUrl}${target.path}`, {
        method: target.path.includes("/api/") ? "POST" : "GET",
        cache: "no-store",
      });
      results.push({
        name: `route:${target.path}`,
        status: target.expected.includes(response.status) ? "ok" : "blocked",
        detail: `HTTP ${response.status}`,
      });
    } catch (error) {
      results.push({
        name: `route:${target.path}`,
        status: "blocked",
        detail: error instanceof Error ? error.message : "request failed",
      });
    }
  }

  return results;
}

function isPlaceholder(value: string) {
  return /change-me|xxx|TODO|PLACEHOLDER|REPLACE/i.test(value);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
