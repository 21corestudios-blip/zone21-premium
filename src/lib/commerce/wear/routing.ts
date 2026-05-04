import type { FulfillmentProvider } from "@/lib/commerce/types";

export interface WearDestination {
  country: string;
  postalCode?: string;
  city?: string;
  region?: string;
}

export interface WearProviderCandidate {
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  priority: number;
  reason: string;
}

const euCountries = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
]);

export function getWearProviderCandidates(
  destination: WearDestination,
): WearProviderCandidate[] {
  const country = destination.country.toUpperCase();

  if (country === "US") {
    return [
      { provider: "printify", priority: 1, reason: "US destination" },
      { provider: "gelato", priority: 2, reason: "US fallback" },
    ];
  }

  if (euCountries.has(country)) {
    return [
      { provider: "gelato", priority: 1, reason: "EU destination" },
      { provider: "printify", priority: 2, reason: "EU fallback" },
    ];
  }

  return [
    { provider: "gelato", priority: 1, reason: "international default" },
    { provider: "printify", priority: 2, reason: "international fallback" },
  ];
}
