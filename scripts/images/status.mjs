import fs from "node:fs";
import { fromRoot, latestStates, loadContext } from "./lib.mjs";

const context = loadContext();
const states = latestStates(context.events);
const counts = Object.fromEntries(context.queue.itens.reduce((map, item) => {
  const state = states.get(item.asset_futuro)?.status || item.status_imagem || "pendente";
  map.set(state, (map.get(state) || 0) + 1);
  return map;
}, new Map()));
console.log(JSON.stringify({
  queue_total: context.queue.total,
  ready: context.queue.prontas_para_criacao,
  blocked: context.queue.bloqueadas_revisao,
  state_events: context.events.filter((event) => event.type === "state").length,
  states: counts,
  stop_requested: fs.existsSync(fromRoot("data/image-automation/STOP")),
  provider: context.config.provider,
  storage: context.config.storage,
}, null, 2));
