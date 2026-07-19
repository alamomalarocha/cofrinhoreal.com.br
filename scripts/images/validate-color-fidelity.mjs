import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodePng } from "./png-lib.mjs";
import { fromRoot, parseArgs } from "./lib.mjs";

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  return max ? (max - Math.min(r, g, b)) / max : 0;
}

export function validateColorFidelity(original, output) {
  const errors = [];
  const warnings = [];
  if (original.width !== output.width || original.height !== output.height) {
    errors.push("Dimensoes da saida diferem do bruto.");
  }
  const pixels = Math.min(original.width * original.height, output.width * output.height);
  let visibleChanged = 0;
  let coreChanged = 0;
  let coreMaxDifference = 0;
  let coreDifferenceSum = 0;
  let newExtremeColors = 0;
  let abnormalSaturationIncrease = 0;
  let translucentPixels = 0;
  let compositeMaxDifference = 0;
  for (let index = 0; index < pixels; index += 1) {
    const offset = index * 4;
    const alpha = output.rgba[offset + 3];
    const differences = [0, 1, 2].map((channel) => Math.abs(
      output.rgba[offset + channel] - original.rgba[offset + channel],
    ));
    const maxDifference = Math.max(...differences);
    if (alpha > 0 && maxDifference > 0) visibleChanged += 1;
    if (alpha >= 240 && maxDifference > 0) {
      coreChanged += 1;
      coreMaxDifference = Math.max(coreMaxDifference, maxDifference);
      coreDifferenceSum += differences.reduce((sum, value) => sum + value, 0) / 3;
    }
    const beforeSaturation = saturation(...original.rgba.subarray(offset, offset + 3));
    const afterSaturation = saturation(...output.rgba.subarray(offset, offset + 3));
    if (alpha > 0 && afterSaturation - beforeSaturation > 0.2) abnormalSaturationIncrease += 1;
    const extremeAfter = afterSaturation > 0.85 && Math.max(...output.rgba.subarray(offset, offset + 3)) > 220;
    const extremeBefore = beforeSaturation > 0.85 && Math.max(...original.rgba.subarray(offset, offset + 3)) > 220;
    if (alpha > 0 && extremeAfter && !extremeBefore) newExtremeColors += 1;
    if (alpha > 0 && alpha < 240) {
      translucentPixels += 1;
      for (const background of [0, 128, 255]) {
        for (let channel = 0; channel < 3; channel += 1) {
          const fraction = alpha / 255;
          const before = original.rgba[offset + channel] * fraction + background * (1 - fraction);
          const after = output.rgba[offset + channel] * fraction + background * (1 - fraction);
          compositeMaxDifference = Math.max(compositeMaxDifference, Math.abs(after - before));
        }
      }
    }
  }
  if (coreChanged) errors.push("RGB alterado em pixels com alfa >= 240.");
  if (newExtremeColors) errors.push("Cores saturadas extremas novas foram introduzidas.");
  if (abnormalSaturationIncrease) errors.push("Aumento anormal de saturacao detectado.");
  return {
    schema_version: "1.0.0",
    valid: errors.length === 0,
    metrics: {
      visible_rgb_changed_pixels: visibleChanged,
      alpha_240_rgb_changed_pixels: coreChanged,
      core_rgb_max_difference: coreMaxDifference,
      core_rgb_mean_difference: coreChanged ? coreDifferenceSum / coreChanged : 0,
      abnormal_saturation_increase_pixels: abnormalSaturationIncrease,
      new_extreme_color_pixels: newExtremeColors,
      translucent_pixels: translucentPixels,
      composite_white_black_gray_max_rgb_difference: compositeMaxDifference,
    },
    errors,
    warnings,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  if (!args["--original"] || !args["--output"]) throw new Error("Use --original e --output.");
  const originalPath = path.resolve(fromRoot(), String(args["--original"]));
  const outputPath = path.resolve(fromRoot(), String(args["--output"]));
  const result = validateColorFidelity(decodePng(originalPath), decodePng(outputPath));
  const reportPath = path.resolve(fromRoot(), String(args["--report"] || `${outputPath}.color-fidelity.json`));
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify({ ...result, original: originalPath, output: outputPath }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...result, report: reportPath }, null, 2));
  if (!result.valid) process.exitCode = 1;
}
