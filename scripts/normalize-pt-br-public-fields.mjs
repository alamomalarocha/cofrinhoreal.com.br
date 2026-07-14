import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_ROOTS = [
  "data/personagens",
  "data/cultura",
  "data/profissoes",
  "data/familias",
].map((directory) => path.join(ROOT, directory));

const PUBLIC_FIELDS = new Set([
  "apelido",
  "aliases",
  "apresentacao_editorial",
  "assunto",
  "categoria",
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
  "nome_completo",
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
  "personalidade",
  "politicas",
  "profissao_atual",
  "profissoes_anteriores",
  "profissao_futura_desejada",
  "regra_publicacao",
  "restricoes_culturais",
  "subtitulo",
  "titulo",
  "visual_brief",
]);

const REPLACEMENTS = new Map([
  ["acentuacao", "acentuação"],
  ["aplicavel", "aplicável"],
  ["Arco-iris", "Arco-íris"],
  ["Araujo", "Araújo"],
  ["Antonio", "Antônio"],
  ["Bebe", "Bebê"],
  ["bebe", "bebê"],
  ["Catalogo", "Catálogo"],
  ["Campeao", "Campeão"],
  ["Cassia", "Cássia"],
  ["Celia", "Célia"],
  ["Classificacao", "Classificação"],
  ["Codigo", "Código"],
  ["Colecao", "Coleção"],
  ["comercio", "comércio"],
  ["comunitaria", "comunitária"],
  ["comunitario", "comunitário"],
  ["concluida", "concluída"],
  ["Conceicao", "Conceição"],
  ["construcao", "construção"],
  ["conteudo", "conteúdo"],
  ["cooperacao", "cooperação"],
  ["Coordenacao", "Coordenação"],
  ["coordenacao", "coordenação"],
  ["Crianca", "Criança"],
  ["crianca", "criança"],
  ["Damiao", "Damião"],
  ["Debora", "Débora"],
  ["demografico", "demográfico"],
  ["Diario", "Diário"],
  ["diario", "diário"],
  ["Educacao", "Educação"],
  ["especifica", "específica"],
  ["expressao", "expressão"],
  ["Familia", "Família"],
  ["familia", "família"],
  ["Fatima", "Fátima"],
  ["Farmacia", "Farmácia"],
  ["farmacia", "farmácia"],
  ["ficticia", "fictícia"],
  ["ficticio", "fictício"],
  ["Folclorica", "Folclórica"],
  ["folclorica", "folclórica"],
  ["Gamificacao", "Gamificação"],
  ["generico", "genérico"],
  ["Geracao", "Geração"],
  ["Gracas", "Graças"],
  ["Guardiao", "Guardião"],
  ["guardiao", "guardião"],
  ["historias", "histórias"],
  ["indigenas", "indígenas"],
  ["indio", "índio"],
  ["inferencias", "inferências"],
  ["Joao", "João"],
  ["joao", "joão"],
  ["Jose", "José"],
  ["linguas", "línguas"],
  ["logistica", "logística"],
  ["Lucia", "Lúcia"],
  ["Mae", "Mãe"],
  ["mantem", "mantém"],
  ["Marcio", "Márcio"],
  ["migracao", "migração"],
  ["migracoes", "migrações"],
  ["ministerio", "ministério"],
  ["Monica", "Mônica"],
  ["municipio", "município"],
  ["nao", "não"],
  ["Noemia", "Noêmia"],
  ["noemia", "noêmia"],
  ["nucleo", "núcleo"],
  ["ocupacao", "ocupação"],
  ["orientacao", "orientação"],
  ["Otavio", "Otávio"],
  ["otavio", "otávio"],
  ["Pagina", "Página"],
  ["Padrao", "Padrão"],
  ["Patricia", "Patrícia"],
  ["patrimonio", "patrimônio"],
  ["Praca", "Praça"],
  ["praca", "praça"],
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
  ["Robotica", "Robótica"],
  ["robotica", "robótica"],
  ["Rodoviaria", "Rodoviária"],
  ["rodoviaria", "rodoviária"],
  ["Sabio", "Sábio"],
  ["Seguranca", "Segurança"],
  ["Senior", "Sênior"],
  ["senior", "sênior"],
  ["simpatica", "simpática"],
  ["simbolo", "símbolo"],
  ["sensivel", "sensível"],
  ["Solidario", "Solidário"],
  ["Sonia", "Sônia"],
  ["suposicao", "suposição"],
  ["Tania", "Tânia"],
  ["tecnica", "técnica"],
  ["tecnico", "técnico"],
  ["territorio", "território"],
  ["usuario", "usuário"],
  ["Variacao", "Variação"],
  ["variacao", "variação"],
  ["vinculo", "vínculo"],
  ["Vitoria", "Vitória"],
  ["vizinhanca", "vizinhança"],
]);

const DISPLAY_NAME_OVERRIDES = new Map([
  ["013", "Mãe Helena"],
  ["017", "Vovó Zefa"],
  ["018", "Vovô João"],
  ["019", "Vovó Lourdes"],
  ["020", "Vovô Severino"],
  ["027", "Seu Damião"],
  ["030", "Pig Sábio"],
  ["032", "Pig Guardião"],
  ["033", "Pig Solidário"],
  ["034", "Pig Campeão"],
  ["035", "Bisavó Nena"],
  ["036", "Bisavô Joaquim"],
]);

const RECORD_REPLACEMENTS = new Map([
  ["017", [["Vovo", "Vovó"]]],
  ["018", [["Vovo", "Vovô"]]],
  ["019", [["Vovo", "Vovó"]]],
  ["020", [["Vovo", "Vovô"]]],
  ["035", [["Bisavo", "Bisavó"]]],
  ["036", [["Bisavo", "Bisavô"]]],
]);

function collectJsonFiles(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectJsonFiles(absolute, output);
    else if (entry.isFile() && entry.name.endsWith(".json")) output.push(absolute);
  }
  return output;
}

function applyReplacements(value, replacements) {
  let output = value.normalize("NFC");
  for (const [source, target] of replacements) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`(?<![\\p{L}\\p{N}_/-])${escaped}(?![\\p{L}\\p{N}_/-])`, "gu"), target);
  }
  return output;
}

function replacePublicText(value, recordReplacements = []) {
  const output = applyReplacements(applyReplacements(value, REPLACEMENTS), recordReplacements);
  return output
    .replace(/[ \t]{2,}/gu, " ")
    .replace(/[ \t]+([,;:!?])/gu, "$1")
    .replace(/([!?])\1+/gu, "$1");
}

function transformPublicValue(value, recordReplacements = []) {
  if (typeof value === "string") return replacePublicText(value, recordReplacements);
  if (Array.isArray(value)) return value.map((item) => transformPublicValue(item, recordReplacements));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      transformPublicValue(item, recordReplacements),
    ]));
  }
  return value;
}

function transformRecord(value) {
  if (Array.isArray(value)) return value.map(transformRecord);
  if (!value || typeof value !== "object") return value;

  const number = String(value.numero ?? "").padStart(3, "0");
  const recordReplacements = RECORD_REPLACEMENTS.get(number) ?? [];
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    output[key] = PUBLIC_FIELDS.has(key)
      ? transformPublicValue(item, recordReplacements)
      : transformRecord(item);
  }

  const displayOverride = DISPLAY_NAME_OVERRIDES.get(number);
  if (displayOverride) {
    output.nome_exibicao = displayOverride;
    if (typeof output.nome_completo === "string" && output.nome_completo === output.nome) {
      output.nome_completo = displayOverride;
    }
  }
  return output;
}

const files = [...new Set(SOURCE_ROOTS.flatMap((directory) => collectJsonFiles(directory)))].sort();
let changedFiles = 0;
let changedRecords = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = JSON.parse(raw);
  const beforeRecords = JSON.stringify(parsed.registros ?? []);
  const transformed = transformRecord(parsed);
  const afterRecords = JSON.stringify(transformed.registros ?? []);
  if (beforeRecords === afterRecords) continue;

  changedFiles += 1;
  if (Array.isArray(parsed.registros) && Array.isArray(transformed.registros)) {
    changedRecords += parsed.registros.filter((record, index) => (
      JSON.stringify(record) !== JSON.stringify(transformed.registros[index])
    )).length;
  }
  fs.writeFileSync(file, `${JSON.stringify(transformed, null, 2)}\n`, "utf8");
}

console.log(`Fontes analisadas: ${files.length}`);
console.log(`Fontes alteradas: ${changedFiles}`);
console.log(`Registros normalizados: ${changedRecords}`);
