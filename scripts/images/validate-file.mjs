import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileSha256, fromRoot, loadContext, parseArgs } from "./lib.mjs";
import { alphaMetrics, decodePng, looksLikeEmbeddedCheckerboard } from "./png-lib.mjs";

export function validateImageFile(filePath, config) {
  const errors = [];
  const warnings = [];
  if (!fs.existsSync(filePath)) return { valid: false, errors: ["Arquivo não encontrado."], warnings, file: filePath };
  let image;
  try { image = decodePng(filePath); } catch (error) {
    return { valid: false, errors: [error.message], warnings, file: filePath };
  }
  const metrics = alphaMetrics(image);
  const rules = config.validation;
  if (image.fileBytes > rules.max_file_bytes) errors.push("Arquivo excede o tamanho máximo.");
  if (image.width < rules.min_width || image.height < rules.min_height) errors.push("Dimensões abaixo do mínimo.");
  if (image.width > rules.max_width || image.height > rules.max_height) errors.push("Dimensões acima do máximo.");
  if (image.colorType !== 6 && image.colorType !== 4) errors.push("PNG não possui canal alfa no formato de origem.");
  if (metrics.transparent_fraction < rules.min_transparent_fraction) errors.push("Transparência real insuficiente.");
  if (metrics.edge_opaque_fraction > rules.max_edge_opaque_fraction) errors.push("Bordas externas indicam fundo ou cenário embutido.");
  if (looksLikeEmbeddedCheckerboard(image)) errors.push("Possível checkerboard de transparência embutido.");
  if (!metrics.bounding_box) errors.push("Imagem totalmente transparente.");
  if (metrics.bounding_box) {
    const box = metrics.bounding_box;
    const marginX = Math.min(box.min_x, image.width - 1 - box.max_x) / image.width;
    const marginY = Math.min(box.min_y, image.height - 1 - box.max_y) / image.height;
    if (marginX < 0.01 || marginY < 0.01) warnings.push("Figura muito próxima da borda; revisar cortes de cabeça, orelhas ou pés.");
  }
  return {
    valid: errors.length === 0,
    file: filePath,
    sha256: fileSha256(filePath),
    width: image.width,
    height: image.height,
    color_type: image.colorType,
    file_bytes: image.fileBytes,
    metrics,
    errors,
    warnings,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  if (!args["--file"]) throw new Error("Use --file CAMINHO.");
  const context = loadContext();
  const result = validateImageFile(path.resolve(fromRoot(), String(args["--file"])), context.config);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 1;
}
