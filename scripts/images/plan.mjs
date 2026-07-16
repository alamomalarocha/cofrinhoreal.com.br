import { loadContext, parseArgs, planRecord, selectPlan } from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
const items = selectPlan(context, args);
const plan = items.map((item) => planRecord(item, context, { pilot: args["--pilot"] === true }));
const totalCost = plan.reduce((sum, item) => sum + item.custo_estimado_usd, 0);

console.log(JSON.stringify({
  mode: "plan-only",
  dry_run: true,
  paid_generation_started: false,
  total: plan.length,
  estimated_cost_usd: Number(totalCost.toFixed(4)),
  provider_enabled: context.config.provider.enabled,
  storage_enabled: context.config.storage.enabled,
  items: plan,
}, null, 2));
