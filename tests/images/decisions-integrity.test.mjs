import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const data = JSON.parse(fs.readFileSync("data/decisoes-projeto.json", "utf8"));

test("decision identifiers are unique and DEC-001 through DEC-027 are preserved", () => {
  const ids = data.decisoes.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (let number = 1; number <= 27; number += 1) assert.equal(ids.includes(`DEC-${String(number).padStart(3, "0")}`), true);
});

test("DEC-017 remains intact and new decisions are present", () => {
  const dec17 = data.decisoes.find((item) => item.id === "DEC-017");
  assert.equal(dec17.titulo, "Primeira ativação restrita a uma base privada");
  assert.match(dec17.descricao, /base privada 002/u);
  const ids = data.decisoes.map((item) => item.id);
  assert.deepEqual(["DEC-025", "DEC-026", "DEC-027"].map((id) => ids.indexOf(id)), [ids.indexOf("DEC-025"), ids.indexOf("DEC-025") + 1, ids.indexOf("DEC-025") + 2]);
});

test("new public decisions contain no confidential future cash strategy", () => {
  const text = JSON.stringify(data.decisoes.filter((item) => ["DEC-025", "DEC-026", "DEC-027"].includes(item.id))).toLowerCase();
  assert.doesNotMatch(text, /troco|dinheiro real/u);
});
