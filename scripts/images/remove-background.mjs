import fs from "node:fs";
import path from "node:path";
import { fromRoot, numberOption, parseArgs } from "./lib.mjs";
import { alphaMetrics, decodePng, encodeRgbaPng, removeEdgeBackground } from "./png-lib.mjs";

const args = parseArgs();
if (!args["--input"]) throw new Error("Use --input CAMINHO e, opcionalmente, --output CAMINHO.");
const input = path.resolve(fromRoot(), String(args["--input"]));
const output = path.resolve(fromRoot(), String(args["--output"] || args["--input"]));
if (!fs.existsSync(input)) throw new Error(`Arquivo não encontrado: ${input}`);
const original = decodePng(input);
const before = alphaMetrics(original);
const tolerance = numberOption(args, "--tolerance", 38);
const processed = before.transparent_fraction >= 0.08
  ? { ...original, colorType: 6, removedPixels: 0, sampledBackground: null }
  : removeEdgeBackground(original, tolerance);
const after = alphaMetrics(processed);
if (args["--dry-run"]) {
  console.log(JSON.stringify({ input, output, tolerance, before, after, would_write: false }, null, 2));
  process.exit(0);
}
fs.mkdirSync(path.dirname(output), { recursive: true });
encodeRgbaPng(processed, output);
console.log(JSON.stringify({ input, output, tolerance, removed_pixels: processed.removedPixels, before, after }, null, 2));
