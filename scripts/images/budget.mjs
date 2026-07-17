import { estimateScenario } from "./estimate-cost.mjs";

const EPSILON = 1e-9;
export const PILOT_MAX_COST_USD = 0.19;

export class BudgetLockError extends Error {
  constructor(message, code = "BUDGET_LOCKED") {
    super(message);
    this.name = "BudgetLockError";
    this.code = code;
  }
}

export function estimatedAttemptCost(config) {
  return estimateScenario({
    count: 1,
    attempts: 1,
    pricing: config.pricing,
    textInputTokens: config.pricing.default_text_input_tokens_per_request,
    referenceImageTokens: config.pricing.default_reference_image_tokens_per_request,
  }).maximum_estimated_usd;
}

export function requiredExclusiveBudget(config, maxAttempts) {
  return Number((estimatedAttemptCost(config) * Number(maxAttempts)).toFixed(6));
}

export function createExclusiveBudget({
  asset,
  maxCostUsd,
  estimatedCostPerAttempt,
}) {
  const exclusiveAsset = String(asset);
  const ceiling = Number(maxCostUsd);
  const attemptCost = Number(estimatedCostPerAttempt);
  let spent = 0;

  function assertAsset(candidate) {
    if (String(candidate) !== exclusiveAsset) {
      throw new BudgetLockError(
        `Orcamento exclusivo de ${exclusiveAsset} nao pode financiar ${candidate}.`,
        "BUDGET_NOT_EXCLUSIVE",
      );
    }
  }

  return {
    beforeAttempt({ asset: candidate }) {
      assertAsset(candidate);
      if (spent + attemptCost > ceiling + EPSILON) {
        throw new BudgetLockError(
          `Orcamento insuficiente antes da proxima tentativa: ${spent.toFixed(6)} + ${attemptCost.toFixed(6)} > ${ceiling.toFixed(6)}.`,
          "BUDGET_EXCEEDED",
        );
      }
      return {
        asset: exclusiveAsset,
        estimated_attempt_cost_usd: attemptCost,
        spent_usd: Number(spent.toFixed(6)),
        remaining_usd: Number((ceiling - spent).toFixed(6)),
      };
    },
    recordAttempt({ asset: candidate, attempt, model, result }) {
      assertAsset(candidate);
      spent += attemptCost;
      return {
        asset: exclusiveAsset,
        attempt,
        model,
        estimated_attempt_cost_usd: attemptCost,
        result,
        spent_usd: Number(spent.toFixed(6)),
        remaining_usd: Number(Math.max(0, ceiling - spent).toFixed(6)),
      };
    },
    snapshot() {
      return {
        asset: exclusiveAsset,
        max_cost_usd: ceiling,
        estimated_attempt_cost_usd: attemptCost,
        spent_usd: Number(spent.toFixed(6)),
        remaining_usd: Number(Math.max(0, ceiling - spent).toFixed(6)),
      };
    },
  };
}
