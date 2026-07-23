import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import worker from "../cloudflare/operational-path-guard/worker.mjs";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "cloudflare/operational-path-guard/wrangler.jsonc");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const patterns = config.routes.map((route) => route.pattern);

const routeMatches = (value, pattern) => {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/gu, "\\$&")
    .replaceAll("*", ".*");
  return new RegExp(`^${escaped}$`, "u").test(value);
};

const matchesGuard = (url) => {
  const parsed = new URL(url);
  const candidate = `${parsed.host}${parsed.pathname}${parsed.search}`;
  return patterns.some((pattern) => routeMatches(candidate, pattern));
};

const requiredHeaders = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "x-robots-tag": "noindex",
};

test("GET returns a deterministic non-cacheable 404", async () => {
  const response = await worker.fetch(new Request("https://cofrinhoreal.com.br/package.json"));
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not Found\n");
  for (const [name, value] of Object.entries(requiredHeaders)) {
    assert.equal(response.headers.get(name), value);
  }
});

test("HEAD returns the same headers without a response body", async () => {
  const response = await worker.fetch(
    new Request("https://cofrinhoreal.com.br/docs/private.md?cache-bust=1", { method: "HEAD" }),
  );
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "");
  for (const [name, value] of Object.entries(requiredHeaders)) {
    assert.equal(response.headers.get(name), value);
  }
});

test("routes cover every authorized operational path with and without query", () => {
  const paths = [
    "/package.json",
    "/package-lock.json",
    "/README.md",
    "/docs/private.md",
    "/scripts/tool.mjs",
    "/tests/check.test.mjs",
    "/data/private.json",
    "/tmp/report.txt",
    "/.env",
    "/.env.production",
    "/.git/config",
    "/wrangler.toml",
  ];
  for (const pathname of paths) {
    assert.equal(matchesGuard(`https://cofrinhoreal.com.br${pathname}`), true, pathname);
    assert.equal(matchesGuard(`https://cofrinhoreal.com.br${pathname}?cache-bust=unique`), true, pathname);
  }
});

test("encoded operational descendants stay blocked without broadening public routes", () => {
  assert.equal(matchesGuard("https://cofrinhoreal.com.br/docs/%2e%2e/package.json"), true);
  assert.equal(matchesGuard("https://cofrinhoreal.com.br/scripts/%2Fprivate.mjs"), true);
  assert.equal(matchesGuard("https://cofrinhoreal.com.br/docs%2Fprivate.md"), false);
  assert.equal(matchesGuard("https://cofrinhoreal.com.br/scripts%2Ftool.mjs"), false);
});

test("legitimate pages, assets, www and lookalike paths do not match", () => {
  const publicUrls = [
    "https://cofrinhoreal.com.br/",
    "https://cofrinhoreal.com.br/faq",
    "https://cofrinhoreal.com.br/personagens?fase=010",
    "https://cofrinhoreal.com.br/assets/characters/001-pig-principal.png",
    "https://cofrinhoreal.com.br/styles.css",
    "https://cofrinhoreal.com.br/documentos/publico",
    "https://cofrinhoreal.com.br/scripts-public/tool.mjs",
    "https://www.cofrinhoreal.com.br/README.md",
  ];
  for (const url of publicUrls) assert.equal(matchesGuard(url), false, url);
});

test("configuration is apex-only, binding-free and contains no broad route", () => {
  assert.equal(config.name, "cofrinhoreal-operational-path-guard");
  assert.equal(config.workers_dev, false);
  assert.equal(config.preview_urls, false);
  assert.equal(Object.hasOwn(config, "vars"), false);
  assert.equal(Object.keys(config).some((key) => /kv|d1|r2|durable|secret/iu.test(key)), false);
  assert.equal(patterns.includes("cofrinhoreal.com.br/*"), false);
  assert.equal(patterns.some((pattern) => pattern.includes("www.")), false);
  assert.equal(config.routes.every((route) => route.zone_name === "cofrinhoreal.com.br"), true);
});

test("Worker performs no backend, cache, storage or logging operations", () => {
  const source = fs.readFileSync(
    path.join(root, "cloudflare/operational-path-guard/worker.mjs"),
    "utf8",
  );
  assert.doesNotMatch(source, /\b(?:await|return)\s+fetch\s*\(/u);
  assert.doesNotMatch(source, /caches?\.|console\.|KV|D1|R2|DurableObject|secret/iu);
});
