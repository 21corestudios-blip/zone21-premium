import type { FulfillmentProvider } from "@/lib/commerce/types";

export interface WearDestination {
  country: string;
  postalCode?: string;
  city?: string;
  region?: string;
}

export interface WearProviderCandidate {
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  providerRegion: WearProviderRegion;
  priority: number;
  reason: string;
}

export type WearProviderRegion = "EU" | "US-CA" | "OC" | "GLOBAL";

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

const northAmericaCountries = new Set(["US", "CA"]);
const oceaniaCountries = new Set(["AU", "NZ"]);

export function getWearProviderRegion(countryCode: string): WearProviderRegion {
  const country = countryCode.toUpperCase();

  if (euCountries.has(country)) {
    return "EU";
  }

  if (northAmericaCountries.has(country)) {
    return "US-CA";
  }

  if (oceaniaCountries.has(country)) {
    return "OC";
  }

  return "GLOBAL";
}

export function getWearProviderCandidates(
  destination: WearDestination,
): WearProviderCandidate[] {
  const country = destination.country.toUpperCase();
  const providerRegion = getWearProviderRegion(country);

  if (northAmericaCountries.has(country)) {
    return [
      {
        provider: "gelato",
        providerRegion,
        priority: 1,
        reason: "Gelato North America regional mapping",
      },
      {
        provider: "printify",
        providerRegion,
        priority: 2,
        reason: "North America fallback",
      },
    ];
  }

  if (euCountries.has(country)) {
    return [
      {
        provider: "gelato",
        providerRegion,
        priority: 1,
        reason: "Gelato Europe regional mapping",
      },
      {
        provider: "printify",
        providerRegion,
        priority: 2,
        reason: "Europe fallback",
      },
    ];
  }

  if (oceaniaCountries.has(country)) {
    return [
      {
        provider: "gelato",
        providerRegion,
        priority: 1,
        reason: "Gelato Oceania regional mapping",
      },
      {
        provider: "printify",
        providerRegion,
        priority: 2,
        reason: "Oceania fallback",
      },
    ];
  }

  return [
    {
      provider: "gelato",
      providerRegion,
      priority: 1,
      reason: "Gelato global mapping",
    },
    {
      provider: "printify",
      providerRegion,
      priority: 2,
      reason: "Global fallback",
    },
  ];
}
