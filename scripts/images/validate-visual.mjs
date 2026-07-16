import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromRoot, loadContext, normalizeAsset, parseArgs } from "./lib.mjs";
import { decodePng } from "./png-lib.mjs";
import { validateImageFile } from "./validate-file.mjs";
import {
  ensureReviewWorkspace,
  reportPath,
  stagePath,
  writeJsonFile,
} from "./workspace.mjs";

function colorMetrics(image) {
  const buckets = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    purple: 0,
    pink: 0,
    neutral: 0,
  };
  let considered = 0;
  const xStart = Math.floor(image.width * 0.25);
  const xEnd = Math.ceil(image.width * 0.75);
  const yStart = Math.floor(image.height * 0.28);
  const yEnd = Math.ceil(image.height * 0.68);
  for (let y = yStart; y < yEnd; y += 3) {
    for (let x = xStart; x < xEnd; x += 3) {
      const offset = (y * image.width + x) * 4;
      if (image.rgba[offset + 3] < 180) continue;
      const [r, g, b] = [image.rgba[offset], image.rgba[offset + 1], image.rgba[offset + 2]];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max - min < 28) buckets.neutral += 1;
      else if (r > 190 && g < 135 && b < 135) buckets.red += 1;
      else if (r > 190 && g >= 100 && g < 185 && b < 100) buckets.orange += 1;
      else if (r > 180 && g > 165 && b < 120) buckets.yellow += 1;
      else if (g > r * 1.08 && g > b * 1.08) buckets.green += 1;
      else if (b > r * 1.08 && b > g * 1.04) buckets.blue += 1;
      else if (r > 130 && b > 130 && g < Math.max(r, b) * 0.82) buckets.purple += 1;
      else if (r > 175 && b > 120 && g < r * 0.9) buckets.pink += 1;
      else buckets.neutral += 1;
      considered += 1;
    }
  }
  return {
    sampled_pixels: considered,
    fractions: Object.fromEntries(
      Object.entries(buckets).map(([key, value]) => [key, considered ? value / considered : 0]),
    ),
  };
}

function identitySignal(style, metrics) {
  const fractions = metrics.fractions;
  if (style === "azul") return { metric: "blue", value: fractions.blue, passes: fractions.blue >= 0.08 };
  if (style === "rosa") return { metric: "pink", value: fractions.pink, passes: fractions.pink >= 0.06 };
  if (style === "arco_iris") {
    const represented = ["red", "orange", "yellow", "green", "blue", "purple"]
      .filter((key) => fractions[key] >= 0.015);
    return { metric: "rainbow_color_count", value: represented.length, passes: represented.length >= 5 };
  }
  return { metric: "not_applicable", value: null, passes: true };
}

export function validateVisualImage({
  filePath,
  asset,
  item,
  config,
}) {
  const normalized = normalizeAsset(asset);
  const fileValidation = validateImageFile(filePath, config, {
    expectedAsset: normalized,
  });
  const colors = fileValidation.valid ? colorMetrics(decodePng(filePath)) : null;
  const signal = colors ? identitySignal(item.estilo, colors) : null;
  return {
    schema_version: "1.0.0",
    asset: normalized,
    expected_identity: item.estilo || null,
    file_validation: fileValidation,
    objective_color_metrics: colors,
    objective_identity_signal: signal,
    automatic_decision:
      fileValidation.valid && signal?.passes ? "aguardando_revisao" : "falhou",
    human_review_required: true,
    not_automatically_asserted: [
      "quantidade de personagens",
      "corpo inteiro",
      "fase de vida",
      "ausencia semantica de texto ou logo",
      "fidelidade ao Pig Principal",
    ],
  };
}

function runCli() {
  const args = parseArgs();
  const context = loadContext();
  if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
  const asset = normalizeAsset(args["--asset"]);
  const item = context.queue.itens.find(
    (candidate) => normalizeAsset(candidate.asset_futuro) === asset,
  );
  if (!item) throw new Error(`Asset nao encontrado na fila: ${asset}`);
  const root = ensureReviewWorkspace(args["--review-root"]);
  const filePath = args["--file"]
    ? path.resolve(fromRoot(), String(args["--file"]))
    : stagePath(root, "validated", asset);
  const result = validateVisualImage({
    filePath,
    asset,
    item,
    config: context.config,
  });
  const output = args["--report"]
    ? path.resolve(fromRoot(), String(args["--report"]))
    : reportPath(root, asset, "visual");
  writeJsonFile(output, result);
  console.log(JSON.stringify({ ...result, report: output }, null, 2));
  if (result.automatic_decision === "falhou") process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
