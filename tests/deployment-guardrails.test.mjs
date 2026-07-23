import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import redirectWorker from "../cloudflare/www-redirect/worker.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("deployment documentation enforces the dist-only boundary", () => {
  const deploy = read("DEPLOY.md");
  assert.match(deploy, /Build command: npm run build/u);
  assert.match(deploy, /Build output directory: dist/u);
  assert.match(deploy, /publicar exclusivamente `dist\/`/u);
  assert.doesNotMatch(deploy, /Build output directory:\s*\//iu);
  assert.doesNotMatch(deploy, /git add (?:\.|-A|--all)(?:\s|$)/iu);
  assert.doesNotMatch(deploy, /use a raiz do repositório/iu);
});

test("internal product documentation stays behind the dist-only boundary", () => {
  const productRoot = path.join(root, "docs", "produto");
  const documents = fs.readdirSync(productRoot).filter((file) => file.endsWith(".md"));
  assert.equal(documents.length, 12);
  for (const file of documents) {
    const source = fs.readFileSync(path.join(productRoot, file), "utf8");
    assert.doesNotMatch(source, /Build output directory:\s*\//iu, file);
    assert.doesNotMatch(source, /git add (?:\.|-A|--all)(?:\s|$)/iu, file);
    assert.doesNotMatch(source, /publicar (?:a|pela) raiz do repositório/iu, file);
  }

  const build = read("scripts/build-public.mjs");
  assert.match(build, /\(\?:docs\|scripts\|tests\|cloudflare/iu);
  assert.match(build, /output_directory: "dist"/u);
  assert.doesNotMatch(build, /copy\(["']docs\/produto/iu);
});

test("all changed CSS and JavaScript references use cache version 46", () => {
  const candidates = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
  const sources = [...candidates, "approved-avatars.js", "scripts/build-public.mjs"];
  for (const relative of sources) {
    const source = read(relative);
    assert.doesNotMatch(source, /(?:styles\.css|script\.js|approved-avatars\.js)[^"']*\?v=45/u, relative);
  }
  for (const relative of candidates.filter((file) => !["cookies.html", "direitos.html", "privacidade.html", "termos.html"].includes(file))) {
    const html = read(relative);
    assert.match(html, /styles\.css\?v=46/u, relative);
    if (relative !== "404.html") assert.match(html, /script\.js\?v=46/u, relative);
  }
});

test("versioned www Worker preserves path and query with HTTP 308", async () => {
  const response = await redirectWorker.fetch(new Request("https://www.cofrinhoreal.com.br/personagens?filtro=rosa&v=46"));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://cofrinhoreal.com.br/personagens?filtro=rosa&v=46");
  const config = read("cloudflare/www-redirect/wrangler.toml");
  assert.match(config, /www\.cofrinhoreal\.com\.br\/\*/u);
  assert.doesNotMatch(config, /account_id|token|secret/iu);
});
