import {
  estimatedCost,
  generationAuthorized,
  isStopRequested,
  loadContext,
  numberOption,
  parseArgs,
  planRecord,
  selectPlan,
} from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
const dryRun = args["--dry-run"] === true || context.config.mode === "dry-run" || !generationAuthorized(context.config, args);
const items = selectPlan(context, args);
const maxCost = numberOption(args, "--max-cost-usd", context.config.limits.max_cost_usd);
const maxAttempts = numberOption(args, "--max-attempts", context.config.limits.max_attempts);
const pauseMs = numberOption(args, "--pause-ms", context.config.limits.pause_ms);
const commitBatchSize = numberOption(args, "--commit-batch-size", context.config.limits.commit_batch_size);
const records = [];
let projectedCost = 0;
for (const item of items) {
  if (isStopRequested()) break;
  const cost = estimatedCost(item, context.config);
  if (maxCost > 0 && projectedCost + cost > maxCost) break;
  projectedCost += cost;
  records.push(planRecord(item, context, { pilot: args["--pilot"] === true }));
}
if (!dryRun) {
  throw new Error("Execução paga não foi iniciada: o adaptador de geração real permanece desativado.");
}
console.log(JSON.stringify({
  mode: "dry-run",
  pilot: args["--pilot"] === true,
  paid_generation_started: false,
  items_planned: records.length,
  prompts_planned: records.length,
  estimated_cost_usd: Number(projectedCost.toFixed(4)),
  max_cost_usd: maxCost,
  max_attempts: maxAttempts,
  pause_ms: pauseMs,
  review_policy: args["--review-policy"] || context.config.review_policy,
  publish: args["--no-publish"] ? false : "planned-only",
  push: args["--no-push"] ? false : "disabled-by-pipeline",
  commit_batch_size: commitBatchSize,
  stopped: isStopRequested(),
  items: records,
}, null, 2));
