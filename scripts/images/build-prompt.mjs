import {
  findAutomationItem,
  loadContext,
  normalizeAsset,
  parseArgs,
  planRecord,
  selectPlan,
} from "./lib.mjs";
import { pilotItemForAsset } from "./pilot-lib.mjs";

const args = parseArgs();
const context = loadContext();
let item;
if (args["--asset"]) {
  const asset = normalizeAsset(args["--asset"]);
  item = findAutomationItem(context, asset);
} else {
  item = selectPlan(context, { ...args, "--limit": 1 })[0];
}
if (!item) throw new Error("Nenhum item elegível encontrado para construir o prompt.");
const pilot = args["--pilot"] === true
  || Boolean(pilotItemForAsset(context.pilot, item.asset_futuro));
const record = planRecord(item, context, { pilot });
console.log(JSON.stringify({
  uid: item.uid,
  numero: item.numero,
  estilo: item.estilo || null,
  arquivo: normalizeAsset(item.asset_futuro),
  prompt: record.prompt,
  prompt_hash: record.prompt_hash,
  referencias: record.referencias,
  referencias_prontas: record.referencias_prontas,
}, null, 2));
