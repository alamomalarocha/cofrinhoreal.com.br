import {
  appendJsonl,
  latestStates,
  loadContext,
  normalizeAsset,
  parseArgs,
  stateEvent,
} from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
const states = latestStates(context.events);
const actionAsset = args["--approve"] || args["--reject"];
if (actionAsset) {
  const asset = normalizeAsset(actionAsset);
  const item = context.queue.itens.find((candidate) => normalizeAsset(candidate.asset_futuro) === asset);
  if (!item) throw new Error(`Asset não encontrado na fila: ${asset}`);
  if (args["--approve"]) {
    appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "aprovada", {
      revisao: "manual",
      motivo: args["--reason"] || "Aprovação humana registrada.",
    }));
    console.log(`Aprovação registrada para ${asset}.`);
  } else {
    appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "falhou", {
      revisao: "manual",
      motivo: args["--reason"] || "Rejeição humana registrada.",
    }));
    console.log(`Rejeição registrada para ${asset}.`);
  }
  process.exit(0);
}
const pending = context.queue.itens
  .map((item) => ({ item, state: states.get(normalizeAsset(item.asset_futuro)) }))
  .filter(({ state }) => state?.status === "aguardando_revisao")
  .map(({ item, state }) => ({ uid: item.uid, asset: normalizeAsset(item.asset_futuro), state }));
console.log(JSON.stringify({ pending_review: pending.length, items: pending }, null, 2));
