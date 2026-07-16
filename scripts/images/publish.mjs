import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadContext,
  normalizeAsset,
  parseArgs,
} from "./lib.mjs";
import {
  ensureReviewWorkspace,
  readJsonIfExists,
  reportPath,
  stagePath,
} from "./workspace.mjs";

export function publicationGate({
  mode,
  authorizedFlag = false,
  env = process.env,
  config,
}) {
  if (["local-review", "catalog-local"].includes(mode)) {
    return { authorized: true, local_only: true, reasons: [] };
  }
  const reasons = [];
  if (authorizedFlag !== true) reasons.push("flag --authorize-publication ausente");
  if (env.IMAGE_PUBLICATION_AUTHORIZED !== "true") {
    reasons.push("IMAGE_PUBLICATION_AUTHORIZED nao esta true");
  }
  if (config.storage?.enabled !== true) reasons.push("storage remoto desativado");
  if (config.storage?.upload_implemented !== true) reasons.push("upload remoto nao implementado");
  return { authorized: reasons.length === 0, local_only: false, reasons };
}

export function publicationPlan({
  asset,
  mode = "local-review",
  context = loadContext(),
  reviewRoot,
  authorizedFlag = false,
  env = process.env,
}) {
  const normalized = normalizeAsset(asset);
  const root = ensureReviewWorkspace(reviewRoot);
  const review = readJsonIfExists(reportPath(root, normalized, "review"));
  const approvedFile = stagePath(root, "approved", normalized);
  if (review?.decision !== "approved" || !fs.existsSync(approvedFile)) {
    throw new Error("Modo de publicacao bloqueado: aprovacao humana local ausente.");
  }
  const gate = publicationGate({
    mode,
    authorizedFlag,
    env,
    config: context.config,
  });
  const report = {
    mode,
    dry_run: true,
    asset: normalized,
    approved_file: approvedFile,
    review_report: reportPath(root, normalized, "review"),
    local_only: gate.local_only,
    authorized: gate.authorized,
    reasons: gate.reasons,
    action:
      mode === "local-review"
        ? "Manter somente na area local de revisao."
        : mode === "catalog-local"
          ? "Executar update-catalog.mjs em dry-run ou com autorizacao local separada."
          : "Publicacao remota permanece bloqueada.",
  };
  if (!gate.authorized) {
    throw new Error(`Publicacao bloqueada: ${gate.reasons.join("; ")}.`);
  }
  if (!["local-review", "catalog-local"].includes(mode)) {
    throw new Error("Publicacao remota nao e executada por este piloto.");
  }
  return report;
}

function runCli() {
  const args = parseArgs();
  if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
  const result = publicationPlan({
    asset: String(args["--asset"]),
    mode: String(args["--mode"] || "local-review"),
    reviewRoot: args["--review-root"],
    authorizedFlag: args["--authorize-publication"] === true,
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
