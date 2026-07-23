export interface WearQualityRequirements {
  minimumFabricWeightGsm?: number;
  allowedMaterials?: string[];
  allowedPrintMethods?: string[];
}

export interface WearRegionalProductCandidate {
  productUid: string;
  region: string;
  supportedCountries: string[];
  available: boolean;
  fabricWeightGsm?: number;
  material?: string;
  printMethod?: string;
  productPriceCents: number;
  shippingPriceCents: number;
  maxDeliveryDays: number;
  fulfillmentCountry?: string;
}

export interface WearSelectionWeights {
  landedCost: number;
  delivery: number;
  localProduction: number;
}

const defaultWeights: WearSelectionWeights = {
  landedCost: 0.45,
  delivery: 0.35,
  localProduction: 0.2,
};

export function selectBestWearCandidate({
  candidates,
  destinationCountry,
  quality,
  weights = defaultWeights,
}: {
  candidates: WearRegionalProductCandidate[];
  destinationCountry: string;
  quality: WearQualityRequirements;
  weights?: WearSelectionWeights;
}) {
  const eligible = candidates.filter(
    (candidate) =>
      candidate.available &&
      candidate.supportedCountries.includes(destinationCountry.toUpperCase()) &&
      meetsQualityRequirements(candidate, quality),
  );

  if (!eligible.length) {
    return null;
  }

  const maximumLandedCost = Math.max(
    ...eligible.map(landedCostCents),
    1,
  );
  const maximumDeliveryDays = Math.max(
    ...eligible.map((candidate) => candidate.maxDeliveryDays),
    1,
  );

  return eligible
    .map((candidate) => {
      const costScore = 1 - landedCostCents(candidate) / maximumLandedCost;
      const deliveryScore =
        1 - candidate.maxDeliveryDays / maximumDeliveryDays;
      const localScore =
        candidate.fulfillmentCountry === destinationCountry.toUpperCase()
          ? 1
          : 0;

      return {
        candidate,
        score:
          costScore * weights.landedCost +
          deliveryScore * weights.delivery +
          localScore * weights.localProduction,
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        landedCostCents(left.candidate) - landedCostCents(right.candidate),
    )[0];
}

function meetsQualityRequirements(
  candidate: WearRegionalProductCandidate,
  requirements: WearQualityRequirements,
) {
  if (
    requirements.minimumFabricWeightGsm &&
    (!candidate.fabricWeightGsm ||
      candidate.fabricWeightGsm < requirements.minimumFabricWeightGsm)
  ) {
    return false;
  }

  if (
    requirements.allowedMaterials?.length &&
    (!candidate.material ||
      !requirements.allowedMaterials.includes(candidate.material))
  ) {
    return false;
  }

  if (
    requirements.allowedPrintMethods?.length &&
    (!candidate.printMethod ||
      !requirements.allowedPrintMethods.includes(candidate.printMethod))
  ) {
    return false;
  }

  return true;
}

function landedCostCents(candidate: WearRegionalProductCandidate) {
  return candidate.productPriceCents + candidate.shippingPriceCents;
}
