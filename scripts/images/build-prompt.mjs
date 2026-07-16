import { buildVisualPrompt, loadContext, normalizeAsset, parseArgs, selectPlan, sha256 } from "./lib.mjs";
import { buildPilotPrompt, pilotItemForAsset } from "./pilot-lib.mjs";

const args = parseArgs();
const context = loadContext();
let item;
if (args["--asset"]) {
  const asset = normalizeAsset(args["--asset"]);
  item = context.queue.itens.find((candidate) => normalizeAsset(candidate.asset_futuro) === asset);
} else {
  item = selectPlan(context, { ...args, "--limit": 1 })[0];
}
if (!item) throw new Error("Nenhum item elegível encontrado para construir o prompt.");
const pilot = args["--pilot"] === true
  || Boolean(pilotItemForAsset(context.pilot, item.asset_futuro));
const prompt = pilot ? buildPilotPrompt(item, context.pilot) : buildVisualPrompt(item);
console.log(JSON.stringify({
  uid: item.uid,
  numero: item.numero,
  estilo: item.estilo || null,
  arquivo: normalizeAsset(item.asset_futuro),
  prompt,
  prompt_hash: sha256(prompt),
}, null, 2));
