import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const characters = fs.readFileSync(path.join(root, "personagens.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/personagens/personagens-principais.json"), "utf8"));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

test("Brasileirinho is an independent approved main character", () => {
  assert.equal(manifest.official_image_count, 29);
  assert.equal(manifest.main_character_count, 2);
  assert.equal(manifest.approved_avatar_count, 27);
  const brasileiro = manifest.characters.find((item) => item.uid === "MAIN-002-BRA");
  assert.ok(brasileiro);
  assert.equal(brasileiro.public_path, "assets/characters/002-brasileirinho.png");
  assert.equal(sha(path.join(root, brasileiro.public_path)), brasileiro.sha256);
  assert.doesNotMatch(JSON.stringify(brasileiro), /azul|rosa|arco-iris|avatar/iu);
});

test("desktop foundation is semantic, inert and explanatory", () => {
  assert.match(home, /class="desktop-shell"/u);
  assert.match(home, /aria-controls="desktop-sidebar"/u);
  assert.match(home, /data-desktop-menu/u);
  assert.match(home, /Cofrinho Labs/u);
  assert.match(home, /Em desenvolvimento/u);
  assert.match(home, /Conheça o Brasileirinho/u);
  assert.match(home, /Uma regra só faz sentido/u);
  assert.doesNotMatch(home, /<form|contenteditable|data-open-login/iu);
  assert.doesNotMatch(script, /innerHTML\s*=/u);
});

test("characters and visual system preserve role separation", () => {
  assert.match(characters, /Pig Principal/u);
  assert.match(characters, /Brasileirinho/u);
  assert.match(characters, /Vantajinho/u);
  assert.match(characters, /002-brasileirinho\.png/u);
  assert.match(styles, /@media \(max-width: 860px\)/u);
  assert.match(styles, /focus-visible/u);
});
