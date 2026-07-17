import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContext, numberOption, parseArgs } from "./lib.mjs";
import { resolveImageModel } from "./model-config.mjs";

export function estimateScenario({
  count,
  attempts,
  pricing,
  textInputTokens,
  referenceImageTokens
}) {
  const textInput = textInputTokens * pricing.text_input_usd_per_million_tokens / 1_000_000;
  const referenceInput = referenceImageTokens * pricing.image_input_usd_per_million_tokens / 1_000_000;
  const output = pricing.image_output_usd_per_image;
  const perAttempt = textInput + referenceInput + output;
  const subtotal = perAttempt * attempts * count;
  const margin = subtotal * pricing.safety_margin_fraction;
  return {
    images: count,
    attempts_per_image: attempts,
    text_input_tokens_per_attempt: textInputTokens,
    reference_image_tokens_per_attempt: referenceImageTokens,
    text_input_usd: Number((textInput * attempts * count).toFixed(6)),
    reference_image_input_usd: Number((referenceInput * attempts * count).toFixed(6)),
    image_output_usd: Number((output * attempts * count).toFixed(6)),
    subtotal_usd: Number(subtotal.toFixed(6)),
    safety_margin_usd: Number(margin.toFixed(6)),
    maximum_estimated_usd: Number((subtotal + margin).toFixed(6))
  };
}

export function buildCostReport({
  pricing,
  model = "gpt-image-2-2026-04-21",
  quality = "medium",
  size = "1024x1536",
  attempts = 1,
  textInputTokens = pricing.default_text_input_tokens_per_request,
  referenceImageTokens = pricing.default_reference_image_tokens_per_request,
  scenarios = [1, 3, 10, 100],
  maxCostUsd = null
} = {}) {
  const modelInfo = resolveImageModel(model);
  const estimates = scenarios.map((count) => estimateScenario({
    count,
    attempts,
    pricing,
    textInputTokens,
    referenceImageTokens
  }));
  const pilot = estimates.find((estimate) => estimate.images === 3) || estimates[0];
  return {
    mode: "estimate-only",
    paid_generation_started: false,
    pricing_source: pricing.source,
    pricing_checked_at: pricing.checked_at,
    requested_model: modelInfo.requested_model,
    pricing_base_model: modelInfo.pricing_base_model,
    model_kind: modelInfo.kind,
    pricing_source: pricing.source,
    pricing_checked_at: pricing.checked_at,
    model: modelInfo.requested_model,
    quality,
    size,
    assumptions: {
      attempts_per_image: attempts,
      text_input_tokens_per_attempt: textInputTokens,
      reference_image_tokens_per_attempt: referenceImageTokens,
      safety_margin_fraction: pricing.safety_margin_fraction,
      note: "Token counts are conservative planning assumptions; actual API usage may differ."
    },
    scenarios: estimates,
    pilot_within_max_cost: maxCostUsd === null ? null : pilot.maximum_estimated_usd <= maxCostUsd,
    max_cost_usd: maxCostUsd
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs();
  const { config } = loadContext();
  const attempts = numberOption(args, "--max-attempts", 1);
  const textInputTokens = numberOption(
    args,
    "--text-input-tokens",
    config.pricing.default_text_input_tokens_per_request
  );
  const referenceImageTokens = numberOption(
    args,
    "--reference-image-tokens",
    config.pricing.default_reference_image_tokens_per_request
  );
  const maxCostUsd = args["--max-cost-usd"] === undefined
    ? null
    : numberOption(args, "--max-cost-usd", null);
  const report = buildCostReport({
    pricing: config.pricing,
    model: config.provider.primary_model || config.provider.model,
    quality: config.provider.quality,
    size: config.provider.size,
    attempts,
    textInputTokens,
    referenceImageTokens,
    maxCostUsd
  });
  console.log(JSON.stringify(report, null, 2));
  if (maxCostUsd !== null && report.pilot_within_max_cost === false) process.exitCode = 2;
}
