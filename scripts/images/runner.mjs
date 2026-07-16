import {
  estimatedCost,
  fromRoot,
  generationAuthorized,
  isStopRequested,
  loadContext,
  numberOption,
  parseArgs,
  planRecord,
  selectPlan,
} from "./lib.mjs";
import {
  loadRunnerCheckpoint,
  persistRunnerCheckpoint,
  reconcileRunnerCheckpoint,
} from "./runner-state.mjs";

const args = parseArgs();
const context = loadContext();
const dryRun = args["--dry-run"] === true
  || context.config.mode === "dry-run"
  || !generationAuthorized(context.config, args);
const items = selectPlan(context, args);
const maxCost = numberOption(args, "--max-cost-usd", context.config.limits.max_cost_usd);
const maxAttempts = numberOption(args, "--max-attempts", context.config.limits.max_attempts);
const pauseMs = numberOption(args, "--pause-ms", context.config.limits.pause_ms);
const commitBatchSize = numberOption(
  args,
  "--commit-batch-size",
  context.config.limits.commit_batch_size,
);
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
  throw new Error(
    "Execucao paga nao foi iniciada: o adaptador de geracao real permanece desativado.",
  );
}

const checkpointPath = fromRoot(context.config.runner.checkpoint);
let checkpoint = args["--resume"] === true
  ? loadRunnerCheckpoint(checkpointPath)
  : null;
const checkpointOptions = {
  mode: "dry-run",
  pilot: args["--pilot"] === true,
  resume: args["--resume"] === true,
  untilComplete: args["--until-complete"] === true,
  stopOnError: args["--stop-on-error"] !== false,
};

if (records.length === 0) {
  checkpoint = reconcileRunnerCheckpoint(checkpoint, [], checkpointOptions);
  persistRunnerCheckpoint(checkpointPath, checkpoint);
} else {
  for (const record of records) {
    checkpoint = reconcileRunnerCheckpoint(checkpoint, [record], checkpointOptions);
    persistRunnerCheckpoint(checkpointPath, checkpoint);
  }
}

console.log(JSON.stringify({
  mode: "dry-run",
  pilot: args["--pilot"] === true,
  resume: args["--resume"] === true,
  until_complete: args["--until-complete"] === true,
  stop_on_error: args["--stop-on-error"] !== false,
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
  checkpoint: {
    file: context.config.runner.checkpoint,
    current_asset: checkpoint.current_asset,
    current_step: checkpoint.current_step,
    persisted_items: checkpoint.items.length,
  },
  items: records,
}, null, 2));
