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

export function loadStyleSystem(
  relativePath = "data/image-automation/style-system.json",
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

export function buildPhaseBasePrompt(
  phase,
  phaseBootstrap,
  technicalBackground = "#777777",
) {
  if (phase.numero === "006") {
    return [
      "Create one wholesome, fully clothed, non-human cartoon pig mascot for a children's educational financial-literacy application. This is a friendly adolescent-stage character design, standing in a neutral pose.",
      "Design one stylized anthropomorphic pig mascot for a family-friendly, classroom-appropriate educational universe.",
      "The mascot wears an off-white shirt covering the torso, light beige trousers covering the hips and legs, and simple white sneakers on both feet.",
      "Use adolescent-stage proportions: a slightly taller and more elongated body than the preceding life stage, with youthful, friendly facial features and natural proportions consistent with the Pig Universe.",
      "Show a neutral standing pose, friendly expression, full body, and clearly visible hands and feet.",
      `Use a uniform technical background ${technicalBackground}.`,
      "Create exactly one character. Keep the composition clean, simple, educational, and suitable for children and families.",
      "Use the attached Pig Principal image as the only binary visual reference for family resemblance.",
      "Keep the reference external to the finished artwork; the result contains only the new mascot on the uniform background.",
      "Use a neutral off-white, light beige, and white technical-clothing palette, with no scenery, text, branding, symbols, handheld items, or decorative objects.",
    ].join("\n");
  }
  const sections = phase.prompt_sections || {};
  const visualAge = phase.visual_age || `${phase.name}, representando ${phase.age}`;
  const sectionLines = [
    ["Conceito", sections.concept],
    ["Anatomia obrigatoria", sections.anatomy],
    ["Expressao obrigatoria", sections.expression],
    ["Composicao obrigatoria", sections.composition],
    ["Elementos proibidos", sections.prohibited],
    ["Integridade anatomica", sections.integrity],
  ]
    .filter(([, values]) => Array.isArray(values) && values.length > 0)
    .map(([label, values]) => `${label}: ${values.join("; ")}.`);
  return [
    "Use o PNG anexado do Pig Principal como a unica referencia visual binaria da identidade do personagem.",
    `Crie uma unica base tecnica interna da fase ${visualAge}.`,
    `Pose obrigatoria: ${poseDescription(phase, phaseBootstrap)}.`,
    `Roupa: ${phase.technical_clothing}.`,
    ...sectionLines,
    `Fundo tecnico uniforme ${technicalBackground}, apropriado para remocao posterior.`,
    "Preserve a familia visual do Pig Principal, mas adapte claramente anatomia e proporcoes para a fase da vida.",
    "Nunca renderize, copie ou mostre a imagem de referencia dentro do resultado: sem miniatura, inset, moldura, painel, comparacao ou segundo personagem.",
    "Sem maos nos bolsos, objeto, texto, letra, numero, logo, moeda, medalha ou cenario.",
    "Um unico personagem, corpo inteiro, centralizado.",
  ].join("\n");
}

export function phaseBasePromptRevision(phase) {
  return phase.numero === "006" ? "phase-006-safe-v2" : "phase-base-v1";
}

export function buildIdentityPrompt(
  identity,
  phase,
  phaseBootstrap,
  technicalBackground = "#777777",
  styleSystem = loadStyleSystem(),
) {
  const policy = styleSystem.identity_policy;
  const definition = styleSystem.identities[identity];
  if (!policy?.public_identities.includes(identity) || !definition) {
    throw new Error(`Identidade publica nao reconhecida: ${identity}`);
  }
  const preserve = [
    "mesmo personagem", "mesma idade", "mesmo rosto", "mesmos olhos", "mesmo focinho",
    "mesmas orelhas", "mesma cabeca", "mesmo cabelo ou topete", "mesma anatomia",
    "mesmas proporcoes", "mesma pose", "mesma posicao dos bracos e maos",
    "mesma expressao", "mesma camera", "mesmo enquadramento", "mesma iluminacao",
    "mesmo acabamento 3D", "mesma relacao visual com a matriz privada",
  ].join(", ");
  const clothing = {
    azul: "camisa azul lisa, short azul-claro e tenis branco simples",
    rosa: "camisa rosa lisa, short rosa-claro e tenis branco simples",
    arco_iris: "camisa com seis faixas fortes claramente separadas, na ordem vermelho, laranja, amarelo, verde, azul e roxo; short off-white; tenis branco simples",
  }[identity];
  const presentation = {
    azul: "Apresentacao claramente masculina e apropriada a idade, sem acessorios.",
    rosa: "Apresentacao claramente feminina e apropriada a idade, com diferenciacao infantil sutil, sem maquiagem adulta e sem acessorios excessivos.",
    arco_iris: "Apresentacao neutra equilibrada, sem predominancia masculina ou feminina; o arco-iris e somente uma identidade visual, nao orientacao sexual.",
  }[identity];
  return [
    `Use a base tecnica aprovada anexada de ${phase.name} como a unica referencia visual binaria.`,
    `Edite o mesmo personagem somente para a identidade ${identity}.`,
    presentation,
    `Preserve exatamente: ${preserve}.`,
    "Altere somente roupa, cores e a apresentacao visual especifica autorizada.",
    `Roupa obrigatoria: ${clothing}.`,
    "Nao altere cabelo ou topete, pose, anatomia, proporcoes, rosto, expressao, bracos ou maos.",
    "Sem acessorio, gorro, bone, laco, chupeta, chocalho, macacao, jardineira, maquiagem, calca, saia, vestido, objeto nas maos, envelhecimento ou adultizacao.",
    "Nao crie quarta identidade nem use roupa bege como identidade publica.",
    identity === "arco_iris" ? "Sem simbolo, bandeira, texto ou acessorio ideologico." : "Sem acessorios.",
    "Nunca renderize, copie ou mostre a referencia dentro do resultado: sem miniatura, inset, moldura, painel ou comparacao.",
    "Um unico personagem, corpo inteiro, centralizado.",
    "Sem sexualizacao, exagero ou caricatura ofensiva.",
    "Sem maos nos bolsos, texto, letra, numero, logotipo, moeda, medalha, cenario, objeto extra, outro personagem, referencia incorporada ou base tecnica visivel.",
    `Fundo tecnico uniforme ${technicalBackground}, apropriado para remocao posterior.`,
  ].join("\n");
}

export const IDENTITY_STRUCTURAL_CHECKLIST = Object.freeze([
  "rosto_preservado", "olhos_preservados", "focinho_preservado", "orelhas_preservadas",
  "cabelo_ou_topete_preservado", "anatomia_preservada", "proporcoes_preservadas",
  "pose_preservada", "bracos_e_maos_preservados", "expressao_preservada",
  "camera_preservada", "enquadramento_preservado", "iluminacao_preservada",
  "mudanca_restrita_a_roupa_cor_e_apresentacao", "acessorios_ausentes",
  "quarta_identidade_ausente",
]);

export function identityStructuralReviewTemplate({ uid, asset, baseAsset }) {
  return {
    schema_version: "1.0.0",
    uid,
    asset,
    base_asset: baseAsset,
    automatic_decision: "aguardando_revisao",
    human_review_required: true,
    automatic_metrics_informative_only: true,
    checklist: Object.fromEntries(IDENTITY_STRUCTURAL_CHECKLIST.map((key) => [key, null])),
  };
}

export function buildPilotPrompt(item, manifest, phaseBootstrap, styleSystem = loadStyleSystem()) {
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
      styleSystem,
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
