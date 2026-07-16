import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileSha256, fromRoot, loadContext, normalizeAsset, parseArgs } from "./lib.mjs";
import {
  alphaMetrics,
  checkerboardScore,
  decodePng,
  externalShadowFraction,
  perceptualHash,
  residualBackgroundFraction,
  sampleEdgeBackground,
} from "./png-lib.mjs";

function targetDimensions(config) {
  const match = /^(\d+)x(\d+)$/u.exec(config.provider?.size || "");
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

export function validateImageFile(filePath, config, options = {}) {
  const errors = [];
  const warnings = [];
  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: ["Arquivo nao encontrado."], warnings, file: filePath };
  }
  let image;
  try {
    image = decodePng(filePath);
  } catch (error) {
    return { valid: false, errors: [error.message], warnings, file: filePath };
  }
  const rules = config.validation;
  const metrics = alphaMetrics(image);
  const dimensions = options.expectedDimensions || targetDimensions(config);
  const background = options.background || sampleEdgeBackground(image);
  const checkerScore = checkerboardScore(image);
  const residual = residualBackgroundFraction(
    image,
    background,
    rules.background_color_tolerance,
  );
  const shadow = externalShadowFraction(image);

  if (image.fileBytes > rules.max_file_bytes) errors.push("Arquivo excede o tamanho maximo.");
  if (image.width < rules.min_width || image.height < rules.min_height) {
    errors.push("Dimensoes abaixo do minimo.");
  }
  if (image.width > rules.max_width || image.height > rules.max_height) {
    errors.push("Dimensoes acima do maximo.");
  }
  if (dimensions && (image.width !== dimensions.width || image.height !== dimensions.height)) {
    errors.push(`Dimensoes devem ser exatamente ${dimensions.width}x${dimensions.height}.`);
  }
  if (image.colorType !== 6) errors.push("PNG deve estar em RGBA com canal alfa real.");
  if (metrics.transparent_fraction < rules.min_transparent_fraction) {
    errors.push("Transparencia real insuficiente.");
  }
  if (metrics.edge_opaque_fraction > rules.max_edge_opaque_fraction) {
    errors.push("Bordas externas indicam fundo ou cenario embutido.");
  }
  if (checkerScore > rules.max_checkerboard_score) {
    errors.push("Possivel checkerboard de transparencia falsa.");
  }
  if (residual > rules.max_residual_background_fraction) {
    errors.push("Fundo tecnico residual acima do limite.");
  }
  if (shadow > rules.max_external_shadow_fraction) {
    errors.push("Sombra externa residual acima do limite.");
  }
  if (!metrics.bounding_box) errors.push("Imagem totalmente transparente.");

  let margins = null;
  if (metrics.bounding_box) {
    const box = metrics.bounding_box;
    margins = {
      left: box.min_x / image.width,
      right: (image.width - 1 - box.max_x) / image.width,
      top: box.min_y / image.height,
      bottom: (image.height - 1 - box.max_y) / image.height,
    };
    if (Math.min(...Object.values(margins)) < rules.min_margin_fraction) {
      errors.push("Figura sem margem segura; pode haver corte de cabeca, orelhas ou pes.");
    }
  }

  if (options.expectedAsset) {
    const expected = path.posix.basename(normalizeAsset(options.expectedAsset));
    if (path.basename(filePath) !== expected) {
      errors.push(`Nome incorreto: esperado ${expected}.`);
    }
  }

  return {
    schema_version: "1.0.0",
    valid: errors.length === 0,
    file: filePath,
    expected_asset: options.expectedAsset || null,
    sha256: fileSha256(filePath),
    perceptual_hash: perceptualHash(image),
    width: image.width,
    height: image.height,
    color_type: image.colorType,
    file_bytes: image.fileBytes,
    sampled_background: background,
    checkerboard_score: checkerScore,
    residual_background_fraction: residual,
    external_shadow_fraction: shadow,
    margins,
    metrics,
    errors,
    warnings,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  if (!args["--file"]) throw new Error("Use --file CAMINHO.");
  const context = loadContext();
  const filePath = path.resolve(fromRoot(), String(args["--file"]));
  const result = validateImageFile(filePath, context.config, {
    expectedAsset: args["--expected-asset"] || null,
  });
  const reportPath = path.resolve(fromRoot(), String(
    args["--report"]
      || path.join(
        "data/image-automation/tmp/image-pilot-review/reports",
        `${path.basename(filePath)}.validation.json`,
      ),
  ));
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...result, report: reportPath }, null, 2));
  if (!result.valid) process.exitCode = 1;
}
