import fs from "node:fs";
import { fromRoot, loadContext, normalizeAsset, parseArgs } from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
const asset = normalizeAsset(args["--asset"]);
const queueItem = context.queue.itens.find((item) => normalizeAsset(item.asset_futuro) === asset);
if (!queueItem) throw new Error(`Asset não encontrado na fila: ${asset}`);
const person = context.catalog.find((item) => item.numero === queueItem.numero && item.slug === queueItem.slug);
if (!person) throw new Error(`Personagem não encontrado: ${queueItem.numero}/${queueItem.slug}`);
const exists = fs.existsSync(fromRoot(asset));
const planned = {
  numero: person.numero,
  slug: person.slug,
  estilo: queueItem.estilo || null,
  asset,
  file_exists: exists,
  changes: queueItem.estilo
    ? { [`status_variacoes.${queueItem.estilo}`]: "criada", append_variacoes_criadas: queueItem.estilo }
    : { status_imagem: "criada" },
};
if (!args["--apply"]) {
  console.log(JSON.stringify({ dry_run: true, planned }, null, 2));
  process.exit(0);
}
throw new Error("Aplicação direta está bloqueada neste adaptador; use os builders oficiais após aprovação e validação.");
