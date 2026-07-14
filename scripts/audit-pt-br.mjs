import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ALLOWED_EXTENSIONS = new Set([".html", ".js", ".mjs", ".md", ".json", ".csv"]);
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "personagens-publicos"]);
const IGNORED_FILES = new Set(["scripts/audit-pt-br.mjs"]);
const PUBLIC_JAVASCRIPT_FILES = new Set(["script.js", "personagens.js"]);

const PUBLIC_JSON_FIELDS = new Set([
  "apresentacao_editorial",
  "assunto",
  "composicao",
  "descricao",
  "descricao_curta",
  "historia",
  "ideia_visual",
  "instituicao",
  "lacunas",
  "marcadores_visuais",
  "mensagem",
  "meta_financeira_educativa",
  "motivo",
  "motivo_prioridade",
  "nome_exibicao",
  "nome_regiao",
  "nome_uf",
  "observacoes",
  "objetivo",
  "observacao_cobertura",
  "orientacao_representacao",
  "papel",
  "papel_educativo",
  "papel_na_vila",
  "politicas",
  "regra_publicacao",
  "restricoes_culturais",
  "subtitulo",
  "titulo",
  "visual_brief",
  "criterio",
  "principio",
]);

const PUBLIC_CSV_COLUMNS = new Set([
  "apresentacao_editorial",
  "descricao_curta",
  "historia",
  "marcadores_visuais",
  "motivo_prioridade",
  "nome_exibicao",
  "objetivo",
  "papel",
  "papel_educativo",
  "papel_na_vila",
  "visual_brief",
]);

const FILE_SPECIFIC_PUBLIC_JSON_FIELDS = new Map([
  ["data/fases-vida.json", new Set(["nome"])],
  ["data/geracoes.json", new Set(["nome"])],
  ["data/ufs-brasil.json", new Set(["nome"])],
]);

const PUBLIC_TERMS = [
  ["acentuacao", "acentuação"],
  ["aplicavel", "aplicável"],
  ["Arco-iris", "Arco-íris"],
  ["Bebe", "Bebê"],
  ["Catalogo", "Catálogo"],
  ["Classificacao", "Classificação"],
  ["Codigo", "Código"],
  ["Colecao", "Coleção"],
  ["comercio", "comércio"],
  ["comunitaria", "comunitária"],
  ["comunitario", "comunitário"],
  ["concluida", "concluída"],
  ["construcao", "construção"],
  ["conteudo", "conteúdo"],
  ["cooperacao", "cooperação"],
  ["Crianca", "Criança"],
  ["demografico", "demográfico"],
  ["Educacao", "Educação"],
  ["especifica", "específica"],
  ["expressao", "expressão"],
  ["Familia", "Família"],
  ["ficticia", "fictícia"],
  ["ficticio", "fictício"],
  ["folclorica", "folclórica"],
  ["Gamificacao", "Gamificação"],
  ["generico", "genérico"],
  ["Geracao", "Geração"],
  ["historias", "histórias"],
  ["indigenas", "indígenas"],
  ["indio", "índio"],
  ["inferencias", "inferências"],
  ["linguas", "línguas"],
  ["logistica", "logística"],
  ["mantem", "mantém"],
  ["migracao", "migração"],
  ["migracoes", "migrações"],
  ["ministerio", "ministério"],
  ["municipio", "município"],
  ["nao", "não"],
  ["nucleo", "núcleo"],
  ["ocupacao", "ocupação"],
  ["orientacao", "orientação"],
  ["Pagina", "Página"],
  ["Padrao", "Padrão"],
  ["patrimonio", "patrimônio"],
  ["Pre-Adolescente", "Pré-Adolescente"],
  ["pressao", "pressão"],
  ["pratica", "prática"],
  ["Profissao", "Profissão"],
  ["Prototipo", "Protótipo"],
  ["publica", "pública"],
  ["publico", "público"],
  ["referencia", "referência"],
  ["Regiao", "Região"],
  ["relacao", "relação"],
  ["revisao", "revisão"],
  ["robotica", "robótica"],
  ["Seguranca", "Segurança"],
  ["Senior", "Sênior"],
  ["simbolo", "símbolo"],
  ["sensivel", "sensível"],
  ["suposicao", "suposição"],
  ["tecnica", "técnica"],
  ["tecnico", "técnico"],
  ["territorio", "território"],
  ["usuario", "usuário"],
  ["variacao", "variação"],
  ["vinculo", "vínculo"],
  ["vizinhanca", "vizinhança"],
];

function relative(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function collectFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(absolute, files);
    else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

function withoutMarkdownCode(source) {
  return source
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/`[^`\n]+`/g, "\n")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "\n")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*\|.*\|\s*$/gm, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/https?:\/\/\S+/g, "\n")
    .replace(/^\s{0,3}(?:#{1,6}|[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s*>\s?/gm, "");
}

function htmlEditorialText(source) {
  const attributes = [...source.matchAll(/\b(?:content|alt|aria-label|title|placeholder)=["']([^"']+)["']/giu)]
    .map((match) => match[1]);
  const visible = source
    .replace(/<script\b[\s\S]*?<\/script>/giu, "\n")
    .replace(/<style\b[\s\S]*?<\/style>/giu, "\n")
    .replace(/<[^>]+>/g, "\n");
  return `${visible}\n${attributes.join("\n")}`
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function javascriptEditorialText(source, rel) {
  if (!PUBLIC_JAVASCRIPT_FILES.has(rel)) return "";
  return [...source.matchAll(/(?:"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|`(?:\\.|[^`\\])*`)/gu)]
    .map((match) => match[0].slice(1, -1).trim())
    .filter((value) => value && !/^[a-z0-9_./?#=&-]+$/u.test(value))
    .map((value) => value.replace(/<[^>]+>/g, " "))
    .join("\n");
}

function collectStrings(value, output) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
}

function jsonEditorialText(source, rel) {
  const parsed = JSON.parse(source);
  const output = [];
  const fileFields = FILE_SPECIFIC_PUBLIC_JSON_FIELDS.get(rel) ?? new Set();

  function visit(value) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if (PUBLIC_JSON_FIELDS.has(key) || fileFields.has(key)) collectStrings(item, output);
      else visit(item);
    }
  }

  visit(parsed);
  return output.join("\n");
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/u, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/u, ""));
    rows.push(row);
  }
  return rows;
}

function csvEditorialText(source, rel) {
  const rows = parseCsv(source);
  if (!rows.length) return "";
  const headers = rows[0];
  const selected = headers
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => PUBLIC_CSV_COLUMNS.has(header) || (rel === "data/fila-imagens-personagens.csv" && header === "nome"));
  return rows.slice(1)
    .flatMap((row) => selected.map(({ index }) => row[index] ?? ""))
    .filter(Boolean)
    .join("\n");
}

function editorialText(raw, extension, rel) {
  if (extension === ".md") return withoutMarkdownCode(raw);
  if (extension === ".html") return htmlEditorialText(raw);
  if (extension === ".js") return javascriptEditorialText(raw, rel);
  if (extension === ".mjs") return "";
  if (extension === ".json") return jsonEditorialText(raw, rel);
  if (extension === ".csv") return csvEditorialText(raw, rel);
  return "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function addMatches(findings, source, regex, kind, severity, suggestion = "") {
  for (const match of source.matchAll(regex)) {
    findings.push({
      kind,
      severity,
      line: lineNumber(source, match.index ?? 0),
      value: match[0].replace(/\s+/g, " ").slice(0, 80),
      suggestion,
    });
  }
}

function auditFile(file) {
  const rel = relative(file);
  if (IGNORED_FILES.has(rel)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const extension = path.extname(file).toLowerCase();
  const findings = [];
  let source = "";

  try {
    source = editorialText(raw, extension, rel);
  } catch (error) {
    findings.push({ kind: "estrutura-invalida", severity: "erro", line: 1, value: error.message, suggestion: "Corrigir o arquivo estruturado." });
  }

  const punctuationSource = [".html", ".md"].includes(extension) ? source : "";
  addMatches(findings, raw, /(?:Ãƒ[\u0080-\u00BF]|Ã‚[\u0080-\u00BF]|Ã¢(?:â‚¬|â‚¬â„¢|â‚¬Å“|â‚¬Â|â‚¬â€œ|â‚¬â€|â€ )|\uFFFD)/gu, "codificacao", "erro", "Regravar em UTF-8 e restaurar o caractere correto.");
  addMatches(findings, punctuationSource, /[ \t]+[,;:!?]/g, "espaco-antes-pontuacao", "aviso", "Remover o espaço anterior.");
  addMatches(findings, punctuationSource, /([!?])\1+/g, "pontuacao-repetida", "aviso", "Usar um único sinal, salvo intenção editorial documentada.");

  if (extension === ".html") {
    if (!/<html[^>]+lang=["']pt-BR["']/i.test(raw)) {
      findings.push({ kind: "html-lang", severity: "erro", line: 1, value: "lang ausente", suggestion: 'Usar lang="pt-BR".' });
    }
    if (!/<meta[^>]+charset=["']?utf-8["']?/i.test(raw)) {
      findings.push({ kind: "html-charset", severity: "erro", line: 1, value: "charset ausente", suggestion: 'Usar <meta charset="UTF-8">.' });
    }
  }

  for (const [term, preferred] of PUBLIC_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\p{L}\\p{N}_/-])${escaped}(?![\\p{L}\\p{N}_/-])`, "giu");
    addMatches(findings, source, regex, "termo-sem-acentuacao", "aviso", `Preferir “${preferred}” em texto público.`);
  }

  return findings.map((finding) => ({ file: rel, ...finding }));
}

const files = collectFiles(ROOT).sort();
const findings = files.flatMap(auditFile);
const errors = findings.filter((finding) => finding.severity === "erro");
const grouped = new Map();
for (const finding of findings) {
  if (!grouped.has(finding.file)) grouped.set(finding.file, []);
  grouped.get(finding.file).push(finding);
}

console.log(`Arquivos analisados: ${files.length}`);
console.log(`Ocorrências: ${findings.length}`);
console.log(`Erros: ${errors.length}`);
console.log(`Avisos: ${findings.length - errors.length}`);

for (const [file, fileFindings] of grouped) {
  console.log(`\n${file}`);
  for (const finding of fileFindings) {
    console.log(`  L${finding.line} [${finding.severity}] ${finding.kind}: ${finding.value}`);
  }
}

if (errors.length || findings.length) process.exitCode = 1;
