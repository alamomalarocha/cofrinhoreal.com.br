import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const pages = ["index", "comerciantes", "como-funciona", "cookies", "direitos", "educacao", "familias", "faq", "jogos", "o-que-e", "personagens", "pig-coins", "privacidade", "seguranca", "termos"];
const catalog = JSON.parse(fs.readFileSync(path.join(dist, "data/personagens/avatares/avatares-aprovados.json"), "utf8"));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

test("public output contains all real routes and a real 404", () => {
  assert.equal(fs.existsSync(path.join(dist, "404.html")), true);
  for (const page of pages) assert.equal(fs.existsSync(page === "index" ? path.join(dist, "index.html") : path.join(dist, page, "index.html")), true, page);
});
test("public output excludes repository and operational files", () => {
  for (const relative of ["package.json", "README.md", "docs", "scripts", "tests", "data/image-automation", ".env", "runtime", "tmp"]) assert.equal(fs.existsSync(path.join(dist, relative)), false, relative);
  const text = fs.readdirSync(dist, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => fs.readFileSync(path.join(entry.parentPath, entry.name), "utf8")).join("\n");
  assert.doesNotMatch(text, /OPENAI_API_KEY|req_[a-z0-9]+|[A-Z]:\\Users\\|AppData|Bearer\s+[A-Za-z0-9_-]+/iu);
});
test("official public images are byte-identical", () => {
  assert.equal(catalog.avatars.length, 27);
  assert.equal(sha(path.join(dist, "assets/characters/001-pig-principal.png")), "efc4cb94ea1f52d0b27fdf78d931672d23d62de0b0128c57ec829e050ac0acd0");
  for (const item of catalog.avatars) assert.equal(sha(path.join(dist, item.public_path)), item.sha256, item.uid);
});
test("legal pages have branding and all pages use canonical root host", () => {
  for (const page of pages) {
    const html = fs.readFileSync(page === "index" ? path.join(dist, "index.html") : path.join(dist, page, "index.html"), "utf8");
    assert.match(html, /rel="canonical" href="https:\/\/cofrinhoreal\.com\.br\//u, page);
    assert.match(html, /application\/ld\+json/u, page);
  }
  for (const page of ["cookies", "direitos", "privacidade", "termos"]) assert.match(fs.readFileSync(path.join(dist, page, "index.html"), "utf8"), /header-logo[^>]+001-pig-principal/u, page);
});
test("filters expose semantic pressed state and www redirects permanently", () => {
  const html = fs.readFileSync(path.join(dist, "personagens", "index.html"), "utf8");
  const js = fs.readFileSync(path.join(dist, "approved-avatars.js"), "utf8");
  assert.match(html, /data-avatar-filter="todos" aria-pressed="true"/u);
  assert.match(js, /setAttribute\("aria-pressed"/u);
  assert.match(fs.readFileSync(path.join(dist, "_redirects"), "utf8"), /www\.cofrinhoreal\.com\.br\/\* https:\/\/cofrinhoreal\.com\.br\/:splat 308/u);
});
