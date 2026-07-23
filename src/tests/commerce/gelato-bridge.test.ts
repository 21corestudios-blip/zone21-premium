import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWearVariantId,
  parseWearVariantId,
} from "@/data/wear.products";
import { resolveGelatoPrintFiles } from "@/lib/commerce/providers/gelato/print-files";
import {
  getWearProviderCandidates,
  getWearProviderRegion,
} from "@/lib/commerce/wear/routing";
import { selectBestWearCandidate } from "@/lib/commerce/wear/product-selection";

test("maps launch destinations to Gelato regions", () => {
  assert.equal(getWearProviderRegion("FR"), "EU");
  assert.equal(getWearProviderRegion("US"), "US-CA");
  assert.equal(getWearProviderRegion("CA"), "US-CA");
  assert.equal(getWearProviderRegion("AU"), "OC");
  assert.equal(getWearProviderRegion("NZ"), "OC");
  assert.equal(getWearProviderCandidates({ country: "AU" })[0]?.provider, "gelato");
});

test("builds an unambiguous size and color variant id", () => {
  const variantId = buildWearVariantId("M", "heather-grey");
  assert.equal(variantId, "M:heather-grey");
  assert.deepEqual(parseWearVariantId(variantId), {
    size: "M",
    color: "heather-grey",
  });
  assert.equal(parseWearVariantId("M"), null);
});

test("supports Gelato v4 multi-area print files and legacy fallback", () => {
  assert.deepEqual(
    resolveGelatoPrintFiles({
      printFiles: [
        { type: "front", url: "https://assets.example/front.svg" },
        { type: "back", url: "https://assets.example/back.svg" },
      ],
    }),
    [
      { type: "front", url: "https://assets.example/front.svg" },
      { type: "back", url: "https://assets.example/back.svg" },
    ],
  );
  assert.deepEqual(
    resolveGelatoPrintFiles({ fileUrl: "https://assets.example/legacy.svg" }),
    [{ type: "default", url: "https://assets.example/legacy.svg" }],
  );
});

test("rejects lower-quality products before optimizing cost and delivery", () => {
  const selection = selectBestWearCandidate({
    destinationCountry: "FR",
    quality: {
      minimumFabricWeightGsm: 180,
      allowedMaterials: ["organic-cotton"],
      allowedPrintMethods: ["dtg"],
    },
    candidates: [
      {
        productUid: "cheap-low-quality",
        region: "EU",
        supportedCountries: ["FR"],
        available: true,
        fabricWeightGsm: 150,
        material: "cotton",
        printMethod: "dtg",
        productPriceCents: 800,
        shippingPriceCents: 400,
        maxDeliveryDays: 4,
        fulfillmentCountry: "FR",
      },
      {
        productUid: "premium-local",
        region: "EU",
        supportedCountries: ["FR"],
        available: true,
        fabricWeightGsm: 200,
        material: "organic-cotton",
        printMethod: "dtg",
        productPriceCents: 1500,
        shippingPriceCents: 500,
        maxDeliveryDays: 5,
        fulfillmentCountry: "FR",
      },
    ],
  });

  assert.equal(selection?.candidate.productUid, "premium-local");
});
