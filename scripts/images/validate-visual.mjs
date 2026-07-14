import fs from "node:fs";
import path from "node:path";
import { fromRoot, loadContext, normalizeAsset, parseArgs } from "./lib.mjs";
import { validateImageFile } from "./validate-file.mjs";

const args = parseArgs();
const context = loadContext();
if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
const asset = normalizeAsset(args["--asset"]);
const item = context.queue.itens.find((candidate) => normalizeAsset(candidate.asset_futuro) === asset);
if (!item) throw new Error(`Asset não encontrado na fila: ${asset}`);
const filePath = fromRoot(asset);
const fileValidation = validateImageFile(filePath, context.config);
const checks = {
  expected_identity: item.estilo || null,
  expected_phase: item.fase_vida || null,
  expected_clothing: item.roupa || null,
  one_character: "requires-human-or-vision-provider",
  full_body: "requires-human-or-vision-provider",
  no_text_or_logo: "requires-human-or-vision-provider",
  identity_legible: "requires-human-or-vision-provider",
};
const result = {
  asset,
  exists: fs.existsSync(filePath),
  file_validation: fileValidation,
  visual_checks: checks,
  automatic_decision: fileValidation.valid ? "aguardando_revisao" : "falhou",
  note: "A validação local não afirma conteúdo sem um provedor visual; itens sensíveis nunca são aprovados automaticamente.",
};
console.log(JSON.stringify(result, null, 2));
if (!fileValidation.valid) process.exitCode = 1;
