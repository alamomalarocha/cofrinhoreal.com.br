import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function fromRoot(...parts) {
  return path.join(projectRoot, ...parts);
}

export function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(fromRoot(relativePath), "utf8"));
}

export function writeJson(relativePath, value) {
  const target = fromRoot(relativePath);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function writeText(relativePath, value) {
  const target = fromRoot(relativePath);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function csvEscape(value) {
  const text = value == null
    ? ""
    : Array.isArray(value)
      ? value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).join("|")
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function writeCsv(relativePath, rows, columns) {
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of rows) lines.push(columns.map((column) => csvEscape(row[column])).join(","));
  writeText(relativePath, `${lines.join("\n")}\n`);
}

export function numericPersonSort(a, b) {
  return Number(a.numero) - Number(b.numero) || String(a.uid).localeCompare(String(b.uid), "pt-BR");
}

export function splitIntoBatches(items, batchSize = 100) {
  const batches = [];
  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize));
  }
  return batches;
}

export function uniqueBy(items, key) {
  const seen = new Set();
  const duplicates = [];
  for (const item of items) {
    const value = item?.[key];
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  return duplicates;
}

export function formatPersonNumber(number) {
  return String(number).padStart(3, "0");
}

export function sourceRecord({ title, institution, url, subject, accessed = "2026-07-12" }) {
  return {
    titulo: title,
    instituicao: institution,
    url,
    data_consulta: accessed,
    assunto: subject,
  };
}
