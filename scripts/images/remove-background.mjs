import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromRoot, loadContext, numberOption, parseArgs } from "./lib.mjs";
import {
  alphaMetrics,
  decodePng,
  encodeRgbaPng,
  removeTechnicalBackground,
  residualBackgroundFraction,
  sampleEdgeBackground,
} from "./png-lib.mjs";

export function removeBackgroundFile(input, output, config, options = {}) {
  const original = decodePng(input);
  const before = alphaMetrics(original);
  const background = options.background || sampleEdgeBackground(original);
  const processed = removeTechnicalBackground(original, {
    background,
    tolerance: options.tolerance ?? config.validation.background_color_tolerance,
    feather: options.feather ?? config.validation.background_feather,
    shadowTolerance: options.shadowTolerance ?? config.validation.background_shadow_tolerance,
  });
  const after = alphaMetrics(processed);
  const report = {
    schema_version: "1.0.0",
    operation: "local-background-removal",
    input,
    output,
    sampled_background: processed.sampledBackground,
    removed_pixels: processed.removedPixels,
    feathered_pixels: processed.featheredPixels,
    before,
    after,
    residual_background_fraction: residualBackgroundFraction(
      processed,
      background,
      config.validation.background_color_tolerance,
    ),
    paid_service_used: false,
  };
  if (!options.dryRun) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    encodeRgbaPng(processed, output);
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  const context = loadContext();
  if (!args["--input"]) throw new Error("Use --input CAMINHO.");
  const input = path.resolve(fromRoot(), String(args["--input"]));
  const basename = path.basename(input);
  const output = path.resolve(fromRoot(), String(
    args["--output"]
      || path.join("data/image-automation/tmp/image-pilot-review/background-removed", basename),
  ));
  if (!fs.existsSync(input)) throw new Error(`Arquivo nao encontrado: ${input}`);
  const report = removeBackgroundFile(input, output, context.config, {
    tolerance: numberOption(args, "--tolerance", context.config.validation.background_color_tolerance),
    feather: numberOption(args, "--feather", context.config.validation.background_feather),
    shadowTolerance: numberOption(
      args,
      "--shadow-tolerance",
      context.config.validation.background_shadow_tolerance,
    ),
    dryRun: args["--dry-run"] === true,
  });
  const reportPath = path.resolve(fromRoot(), String(
    args["--report"]
      || path.join("data/image-automation/tmp/image-pilot-review/reports", `${basename}.background.json`),
  ));
  if (!args["--dry-run"]) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify({ ...report, report: reportPath, would_write: args["--dry-run"] !== true }, null, 2));
}
