import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeAsset(value = "") {
  return String(value).trim().replaceAll("\\", "/").replace(/^\.\//u, "");
}

function readJson(relativePath, root = ROOT) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

export function loadPilotManifest(
  relativePath = "data/image-automation/pilot-002-three-identities.json",
  root = ROOT,
) {
  return readJson(relativePath, root);
}

export function loadPhaseBootstrap(
  relativePath = "data/image-automation/phase-bootstrap.json",
  root = ROOT,
) {
  return readJson(relativePath, root);
}

export function phaseByKey(phaseBootstrap, key) {
  return phaseBootstrap.phases.find((phase) => phase.key === key) || null;
}

export function phaseBaseForAsset(phaseBootstrap, asset) {
  const normalized = normalizeAsset(asset);
  return phaseBootstrap.phases.find(
    (phase) => normalizeAsset(phase.base_asset) === normalized,
  ) || null;
}

export function phaseBaseItemForPhase(phase) {
  return {
    uid: `PHASE-${phase.numero}-BASE`,
    kind: "phase_base",
    ordem: 0,
    numero: phase.numero,
    nome: `Base tecnica ${phase.name}`,
    slug: `${phase.slug}-base`,
    fase_vida: phase.key,
    estilo: "base_tecnica",
    asset_futuro: normalizeAsset(phase.base_asset),
    status_imagem: "pendente",
    situacao_fila: "pronta_para_criacao",
    publicavel: false,
    visual_brief: `${phase.name}, ${phase.age}`,
    roupa: phase.technical_clothing,
  };
}

export function phaseBaseItem(manifest, phaseBootstrap) {
  const phase = phaseByKey(phaseBootstrap, manifest.phase_key);
  if (!phase) throw new Error(`Fase do piloto nao declarada: ${manifest.phase_key}`);
  return {
    ...phaseBaseItemForPhase(phase),
    uid: manifest.base.uid,
    nome: manifest.base.nome,
    slug: manifest.base.slug,
    estilo: manifest.base.estilo,
  };
}

export function pilotItemForAsset(manifest, asset) {
  const normalized = normalizeAsset(asset);
  if (normalizeAsset(manifest.base.asset) === normalized) return manifest.base;
  return manifest.items.find((item) => normalizeAsset(item.asset) === normalized) || null;
}

function poseDescription(phase, phaseBootstrap) {
  const pose = phaseBootstrap.global_pose[phase.pose];
  if (!pose) throw new Error(`Pose global nao declarada: ${phase.pose}`);
  return [
    pose.position,
    pose.body,
    pose.arms,
    pose.ears,
    pose.camera,
    pose.expression,
  ].join("; ");
}

function identityClothing(identity) {
  if (identity === "azul") {
    return "roupa simples azul, lisa, sem marca ou simbolo";
  }
  if (identity === "rosa") {
    return "roupa simples rosa, lisa, sem marca ou simbolo";
  }
  if (identity === "arco_iris") {
    return "camisa com faixas horizontais fortes de arco-iris em vermelho, laranja, amarelo, verde, azul e roxo; parte inferior off-white";
  }
  throw new Error(`Identidade do piloto nao reconhecida: ${identity}`);
}

export function buildPhaseBasePrompt(
  phase,
  phaseBootstrap,
  technicalBackground = "#777777",
) {
  return [
    "Use o PNG anexado do Pig Principal como a unica referencia visual binaria da identidade do personagem.",
    `Crie uma unica base tecnica interna da fase ${phase.name}, representando ${phase.age}.`,
    `Pose obrigatoria: ${poseDescription(phase, phaseBootstrap)}.`,
    `Roupa: ${phase.technical_clothing}.`,
    `Fundo tecnico uniforme ${technicalBackground}, apropriado para remocao posterior.`,
    "Preserve a familia visual do Pig Principal, mas adapte claramente anatomia e proporcoes para a fase da vida.",
    "Nunca renderize, copie ou mostre a imagem de referencia dentro do resultado: sem miniatura, inset, moldura, painel, comparacao ou segundo personagem.",
    "Sem maos nos bolsos, objeto, texto, letra, numero, logo, moeda, medalha ou cenario.",
    "Um unico personagem, corpo inteiro, centralizado.",
  ].join("\n");
}

export function buildIdentityPrompt(
  identity,
  phase,
  phaseBootstrap,
  technicalBackground = "#777777",
) {
  const preserve = phaseBootstrap.identity_derivation.preserve.join(", ");
  const mayChange = phaseBootstrap.identity_derivation.may_change.join(", ");
  return [
    `Use a base tecnica aprovada anexada de ${phase.name} como a unica referencia visual binaria.`,
    `Edite o mesmo personagem para a identidade ${identity}.`,
    `Preserve exatamente: ${preserve}.`,
    `Altere somente: ${mayChange}.`,
    `Roupa: ${identityClothing(identity)}.`,
    "Nunca renderize, copie ou mostre a referencia dentro do resultado: sem miniatura, inset, moldura, painel ou comparacao.",
    "Sem maos nos bolsos, texto, letra, numero, logo, moeda, medalha, cenario, objeto extra ou outro personagem.",
    `Fundo tecnico uniforme ${technicalBackground}, apropriado para remocao posterior.`,
  ].join("\n");
}

export function buildPilotPrompt(item, manifest, phaseBootstrap) {
  const pilotItem = pilotItemForAsset(manifest, item.asset_futuro);
  if (!pilotItem) {
    throw new Error(`Item fora do piloto automatico: ${normalizeAsset(item.asset_futuro)}`);
  }
  const phase = phaseByKey(phaseBootstrap, manifest.phase_key);
  if (!phase) throw new Error(`Fase do piloto nao declarada: ${manifest.phase_key}`);
  return pilotItem.kind === "phase_base"
    ? buildPhaseBasePrompt(phase, phaseBootstrap, manifest.technical_background)
    : buildIdentityPrompt(
      pilotItem.identity,
      phase,
      phaseBootstrap,
      manifest.technical_background,
    );
}

function requiredStateMatches(definition, asset, states) {
  if (!definition.required_state) return true;
  const latest = states.get(normalizeAsset(asset));
  return latest?.status === definition.required_state
    || (definition.required_state === "aprovada" && latest?.status === "publicada");
}

export function pilotReferencePlan(
  item,
  manifest,
  { root = ROOT, states = new Map() } = {},
) {
  const pilotItem = pilotItemForAsset(manifest, item.asset_futuro);
  if (!pilotItem) return [];
  return pilotItem.reference_keys.map((key) => {
    const definition = manifest.references[key];
    if (!definition) {
      return {
        key,
        required: true,
        available: false,
        error: "reference-key-not-declared",
        asset: null,
      };
    }
    const asset = normalizeAsset(definition.asset);
    const absolute = asset ? path.join(root, asset) : null;
    const fileAvailable = Boolean(absolute && fs.existsSync(absolute));
    const actualHash = fileAvailable ? sha256(fs.readFileSync(absolute)) : null;
    const hashMatches = !definition.sha256 || definition.sha256 === actualHash;
    const stateMatches = requiredStateMatches(definition, asset, states);
    let error = null;
    if (!fileAvailable) error = "missing-reference";
    else if (!hashMatches) error = "reference-hash-mismatch";
    else if (!stateMatches) error = "reference-not-approved";
    return {
      key,
      role: definition.role,
      required: definition.required === true,
      available: fileAvailable && hashMatches && stateMatches,
      asset,
      sha256: actualHash,
      expected_sha256: definition.sha256 || null,
      required_state: definition.required_state || null,
      state_matches: stateMatches,
      error,
    };
  });
}

export function pilotReferenceReadiness(item, manifest, options = {}) {
  const references = pilotReferencePlan(item, manifest, options);
  const blocking = references.filter((reference) => reference.required && !reference.available);
  return {
    ready: blocking.length === 0,
    blocking,
    references,
  };
}

export function assertPilotReferencesReady(item, manifest, options = {}) {
  const readiness = pilotReferenceReadiness(item, manifest, options);
  if (!readiness.ready) {
    const details = readiness.blocking
      .map((reference) => `${reference.asset || reference.key}:${reference.error}`)
      .join(", ");
    throw new Error(`Piloto bloqueado por referencia obrigatoria ausente ou invalida: ${details}`);
  }
  return readiness;
}

function completedStatus(status) {
  return ["aprovada", "publicada"].includes(status);
}

export function phaseWorkflowItems({
  phaseBootstrap,
  queueItems,
  states = new Map(),
  resume = false,
}) {
  const selected = [];
  const scheduledBases = new Set();
  for (const item of queueItems) {
    const phase = phaseByKey(phaseBootstrap, item.fase_vida);
    if (!phase) {
      selected.push(item);
      continue;
    }
    const base = phaseBaseItemForPhase(phase);
    const baseAsset = normalizeAsset(base.asset_futuro);
    const baseState = states.get(baseAsset);
    if (!completedStatus(baseState?.status)) {
      if (
        !scheduledBases.has(baseAsset)
        && (!baseState || ["pendente", "falhou"].includes(baseState.status))
      ) {
        selected.push(base);
        scheduledBases.add(baseAsset);
      }
      continue;
    }
    const itemState = states.get(normalizeAsset(item.asset_futuro));
    if (
      resume
      && itemState
      && ["gerando", "gerada", "fundo_removido", "validada", "aguardando_revisao"].includes(
        itemState.status,
      )
    ) {
      continue;
    }
    selected.push(item);
  }
  return selected;
}

export function pilotWorkflowItems({
  manifest,
  phaseBootstrap,
  queueItems,
  states = new Map(),
  resume = false,
}) {
  const base = phaseBaseItem(manifest, phaseBootstrap);
  const baseState = states.get(normalizeAsset(base.asset_futuro));
  if (!completedStatus(baseState?.status)) {
    if (baseState && !["pendente", "falhou"].includes(baseState.status)) {
      return [];
    }
    return [base];
  }

  const queueByAsset = new Map(
    queueItems.map((item) => [normalizeAsset(item.asset_futuro), item]),
  );
  return manifest.items
    .map((pilotItem) => {
      const item = queueByAsset.get(normalizeAsset(pilotItem.asset));
      if (!item) throw new Error(`Item do piloto ausente na fila: ${pilotItem.asset}`);
      return item;
    })
    .filter((item) => {
      const last = states.get(normalizeAsset(item.asset_futuro));
      if (completedStatus(last?.status)) return false;
      return !resume || !last || !["gerando", "gerada", "fundo_removido", "validada", "aguardando_revisao"].includes(last.status);
    });
}
