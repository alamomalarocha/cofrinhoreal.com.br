import { loadContext, normalizeAsset, parseArgs, storagePlan } from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
const asset = normalizeAsset(args["--asset"]);
const item = context.queue.itens.find((candidate) => normalizeAsset(candidate.asset_futuro) === asset);
if (!item) throw new Error(`Asset não encontrado na fila: ${asset}`);
const plan = storagePlan(item, context.config);
if (!args["--dry-run"]) {
  throw new Error("Upload real está desativado. R2 só poderá ser implementado e habilitado após autorização explícita.");
}
console.log(JSON.stringify({ dry_run: true, uploaded: false, storage: plan }, null, 2));
