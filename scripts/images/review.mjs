import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendJsonl,
  findAutomationItem,
  loadContext,
  normalizeAsset,
  parseArgs,
  ROOT,
  stateEvent,
} from "./lib.mjs";
import {
  copyPreservingSource,
  ensureReviewWorkspace,
  newestCandidate,
  readJsonIfExists,
  reportPath,
  resolveReviewRoot,
  stagePath,
  writeJsonFile,
} from "./workspace.mjs";

function findReviewItem(context, asset) {
  const normalized = normalizeAsset(asset);
  const item = findAutomationItem(context, normalized);
  if (!item) throw new Error(`Asset nao encontrado na fila: ${normalized}`);
  return item;
}

export function perceptualHashDistance(left, right) {
  if (!/^[a-f0-9]{16}$/iu.test(left || "") || !/^[a-f0-9]{16}$/iu.test(right || "")) {
    return Number.POSITIVE_INFINITY;
  }
  let difference = BigInt(`0x${left}`) ^ BigInt(`0x${right}`);
  let distance = 0;
  while (difference > 0n) {
    distance += Number(difference & 1n);
    difference >>= 1n;
  }
  return distance;
}

function reviewReports(root) {
  const directory = path.join(resolveReviewRoot(root), "reports");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".review.json"))
    .map((name) => readJsonIfExists(path.join(directory, name)))
    .filter(Boolean);
}

function officialSiblingIdentity(context, currentItem, priorItem, asset, priorReport) {
  const official = context.styles?.identity_policy?.public_identities
    || ["azul", "rosa", "arco_iris"];
  const currentKind = currentItem.kind || "character";
  const priorKind = priorItem?.kind || "character";
  return Boolean(
    priorItem
    && currentKind === "character"
    && priorKind === "character"
    && String(currentItem.numero) === String(priorItem.numero)
    && String(currentItem.slug || currentItem.nome) === String(priorItem.slug || priorItem.nome)
    && currentItem.estilo !== priorItem.estilo
    && official.includes(currentItem.estilo)
    && official.includes(priorItem.estilo)
    && currentItem.estilo !== "padrao"
    && priorItem.estilo !== "padrao"
    && asset !== priorReport.asset
  );
}

function assertNotDuplicate(root, asset, item, validation, maxDistance, context) {
  let perceptualSimilarityAllowed = false;
  for (const report of reviewReports(root)) {
    if (report.decision !== "approved" || report.asset === asset) continue;
    if (report.sha256 && report.sha256 === validation.sha256) {
      throw new Error(`Duplicata exata de ${report.asset}; aprovacao bloqueada.`);
    }
    const distance = perceptualHashDistance(
      report.perceptual_hash,
      validation.perceptual_hash,
    );
    if (distance <= maxDistance) {
      const priorItem = findAutomationItem(context, report.asset);
      if (officialSiblingIdentity(context, item, priorItem, asset, report)) {
        perceptualSimilarityAllowed = true;
        continue;
      }
      throw new Error(
        `Possivel duplicata visual de ${report.asset} (distancia pHash ${distance}); aprovacao bloqueada.`,
      );
    }
  }
  return perceptualSimilarityAllowed;
}

function appendState(options, event) {
  if (options.stateFile) {
    fs.mkdirSync(path.dirname(options.stateFile), { recursive: true });
    fs.appendFileSync(options.stateFile, `${JSON.stringify(event)}\n`, "utf8");
    return;
  }
  appendJsonl("data/image-automation/state.jsonl", event);
}

export function reviewAsset({
  action,
  asset,
  reviewer,
  reason,
  context = loadContext(),
  reviewRoot,
  stateFile,
  projectRoot = ROOT,
  now = new Date(),
}) {
  if (!["approve", "reject"].includes(action)) {
    throw new Error("Acao de revisao deve ser approve ou reject.");
  }
  if (!String(reviewer || "").trim()) throw new Error("Informe --reviewer.");
  if (!String(reason || "").trim()) throw new Error("Informe --reason.");

  const root = ensureReviewWorkspace(reviewRoot);
  const normalized = normalizeAsset(asset);
  const item = findReviewItem(context, normalized);
  const validationFile = reportPath(root, normalized, "validation");
  const visualFile = reportPath(root, normalized, "visual");
  const reviewFile = reportPath(root, normalized, "review");
  const priorReview = readJsonIfExists(reviewFile);

  if (priorReview?.decision === "approved" && action === "approve") {
    return { idempotent: true, ...priorReview };
  }

  const candidate = newestCandidate(root, normalized);
  if (!candidate) throw new Error("Nenhum candidato local encontrado para revisao.");
  const validation = readJsonIfExists(validationFile);
  const visual = readJsonIfExists(visualFile);
  if (!validation?.valid) {
    throw new Error("A revisao exige relatorio tecnico valido.");
  }
  if (
    visual?.automatic_decision !== "aguardando_revisao"
    || visual?.human_review_required !== true
  ) {
    throw new Error("A revisao exige relatorio visual apto e revisao humana obrigatoria.");
  }

  let perceptualSimilarityAllowed = false;
  if (action === "approve") {
    const maxDistance = Number(context.config.validation?.duplicate_phash_distance_max ?? 4);
    perceptualSimilarityAllowed = assertNotDuplicate(
      root, normalized, item, validation, maxDistance, context,
    );
  }

  const decision = action === "approve" ? "approved" : "rejected";
  const destination = stagePath(root, decision, normalized);
  copyPreservingSource(candidate.file, destination);
  const report = {
    schema_version: "1.0.0",
    asset: normalized,
    uid: item.uid,
    numero: item.numero,
    estilo: item.estilo || null,
    decision,
    reviewer: String(reviewer).trim(),
    reason: String(reason).trim(),
    reviewed_at: now.toISOString(),
    source_stage: candidate.stage,
    source_file: candidate.file,
    preserved_file: destination,
    validation_report: validationFile,
    visual_report: visualFile,
    sha256: validation.sha256,
    perceptual_hash: validation.perceptual_hash,
    kind: item.kind || "character",
    catalog_updated: false,
    published: false,
  };
  if (perceptualSimilarityAllowed) {
    report.perceptual_similarity_allowed = true;
    report.perceptual_similarity_reason = "official_sibling_identities_same_character";
  }
  if (action === "approve" && item.kind === "phase_base") {
    const internalTarget = path.join(projectRoot, ...normalized.split("/"));
    copyPreservingSource(destination, internalTarget);
    report.internal_phase_base_installed = true;
    report.internal_phase_base_file = internalTarget;
  }
  writeJsonFile(reviewFile, report);
  appendState(
    { stateFile },
    stateEvent(item, action === "approve" ? "aprovada" : "falhou", {
      revisao: "manual",
      revisor: report.reviewer,
      motivo: report.reason,
      review_report: reviewFile,
    }),
  );
  return report;
}

export function reviewStatus({ context = loadContext(), reviewRoot } = {}) {
  const root = ensureReviewWorkspace(reviewRoot);
  const bases = context.phaseBootstrap.phases
    .map((phase) => findAutomationItem(context, phase.base_asset))
    .filter(Boolean);
  return [...bases, ...context.queue.itens].map((item) => {
    const asset = normalizeAsset(item.asset_futuro);
    const review = readJsonIfExists(reportPath(root, asset, "review"));
    return {
      numero: item.numero,
      nome: item.nome,
      estilo: item.estilo || null,
      asset,
      raw: fs.existsSync(stagePath(root, "raw", asset)),
      background_removed: fs.existsSync(stagePath(root, "background-removed", asset)),
      validated: fs.existsSync(stagePath(root, "validated", asset)),
      decision: review?.decision || "pending",
      reviewer: review?.reviewer || null,
    };
  }).filter((item) => item.raw || item.background_removed || item.validated || item.decision !== "pending");
}

function runCli() {
  const args = parseArgs();
  const action = String(
    args._[0] || (args["--approve"] ? "approve" : args["--reject"] ? "reject" : "list"),
  );
  const reviewRoot = args["--review-root"];
  const asset = args["--asset"] || args["--approve"] || args["--reject"];
  if (action === "list") {
    const items = reviewStatus({ reviewRoot });
    console.log(JSON.stringify({ count: items.length, items }, null, 2));
    return;
  }
  if (action === "show") {
    if (!asset) throw new Error("Use show --asset CAMINHO.");
    const root = ensureReviewWorkspace(reviewRoot);
    const result = {
      asset: normalizeAsset(asset),
      validation: readJsonIfExists(reportPath(root, asset, "validation")),
      visual: readJsonIfExists(reportPath(root, asset, "visual")),
      review: readJsonIfExists(reportPath(root, asset, "review")),
    };
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (!asset) throw new Error(`Use ${action} --asset CAMINHO.`);
  const result = reviewAsset({
    action,
    asset,
    reviewer: args["--reviewer"],
    reason: args["--reason"],
    reviewRoot,
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
