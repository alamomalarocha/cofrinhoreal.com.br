import fs from "node:fs";
import {
  appendJsonl,
  fromRoot,
  latestStates,
  loadContext,
  normalizeAsset,
  parseArgs,
  stateEvent,
  storagePlan,
} from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
const asset = normalizeAsset(args["--asset"]);
const item = context.queue.itens.find((candidate) => normalizeAsset(candidate.asset_futuro) === asset);
if (!item) throw new Error(`Asset não encontrado na fila: ${asset}`);
const last = latestStates(context.events).get(asset);
const report = {
  asset,
  file_exists: fs.existsSync(fromRoot(asset)),
  current_state: last?.status || "pendente",
  required_state: "aprovada",
  storage: storagePlan(item, context.config),
  no_push: args["--no-push"] !== false,
};
if (args["--dry-run"] || args["--no-publish"] || context.config.storage.enabled !== true) {
  console.log(JSON.stringify({ dry_run: true, published: false, report }, null, 2));
  process.exit(0);
}
if (!report.file_exists || last?.status !== "aprovada") throw new Error("Publicação bloqueada: arquivo ausente ou item não aprovado.");
throw new Error("Publicação real permanece desativada até configuração e autorização explícitas de armazenamento.");
