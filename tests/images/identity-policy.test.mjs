import assert from "node:assert/strict";
import test from "node:test";
import { loadContext } from "../../scripts/images/lib.mjs";
import { buildIdentityPrompt, phaseByKey } from "../../scripts/images/pilot-lib.mjs";

test("authoritative policy exposes exactly the three ordered public identities", () => {
  const { styles, phaseBootstrap, pilot } = loadContext();
  const policy = styles.identity_policy;
  assert.equal(policy.exactly_three_public_identities, true);
  assert.deepEqual(policy.public_identities, ["azul", "rosa", "arco_iris"]);
  assert.deepEqual(styles.active_order, policy.public_identities);
  assert.deepEqual(policy.discontinued_identities, ["padrao"]);
  assert.deepEqual(styles.discontinued, ["padrao"]);
  assert.equal(policy.pig_principal_is_identity, false);
  assert.equal(policy.pig_principal_is_immutable, true);
  assert.equal(policy.pig_principal_is_derivable, false);
  assert.equal(styles.official_reference, "assets/characters/001-pig-principal.png");
  assert.equal(policy.private_base_is_public_identity, false);
  assert.equal(policy.private_base_is_neutral_identity, false);
  assert.equal(policy.same_character_across_identities, true);
  assert.equal(phaseBootstrap.storage.public, false);
  assert.equal(phaseBootstrap.storage.cataloged, false);
  assert.deepEqual(pilot.items.map((item) => item.identity), policy.public_identities);
  assert.ok(pilot.items.every((item) => item.reference_keys[0] === "phase_base"));
  assert.ok(pilot.items.every((item) => item.identity !== "padrao"));
});

test("identity prompts consume the authoritative semantic definitions", () => {
  const { styles, phaseBootstrap } = loadContext();
  const phase = phaseByKey(phaseBootstrap, "fase_bebe");
  const prompts = Object.fromEntries(styles.active_order.map((identity) => [identity,
    buildIdentityPrompt(identity, phase, phaseBootstrap, "#777777", styles)]));
  assert.match(prompts.azul, /papel menino_masculino/u);
  assert.match(prompts.azul, /inequivocamente menino ou masculino conforme a idade/u);
  assert.match(prompts.rosa, /papel menina_feminina/u);
  assert.match(prompts.rosa, /inequivocamente menina ou feminina conforme a idade/u);
  assert.match(prompts.arco_iris, /papel neutro/u);
  assert.match(prompts.arco_iris, /sem predominancia masculina ou feminina/u);
  assert.match(prompts.arco_iris, /nao equivale automaticamente a classificacao LGBT/u);
  for (const prompt of Object.values(prompts)) {
    assert.match(prompt, /mesmo personagem/u);
    assert.match(prompt, /idade/u);
    assert.match(prompt, /anatomia essencial/u);
    assert.match(prompt, /profissao ou funcao/u);
    assert.match(prompt, /origem regional/u);
    assert.match(prompt, /deficiencia/u);
    assert.match(prompt, /Um unico personagem, corpo inteiro/u);
    assert.match(prompt, /Sem sexualizacao, exagero ou caricatura ofensiva/u);
    assert.match(prompt, /Sem maos nos bolsos, texto/u);
    assert.match(prompt, /logotipo/u);
    assert.match(prompt, /moeda/u);
    assert.match(prompt, /cenario/u);
    assert.match(prompt, /referencia incorporada/u);
    assert.match(prompt, /base tecnica visivel/u);
    assert.match(prompt, /o Pig Principal nao pode aparecer no resultado/u);
    assert.doesNotMatch(prompt, /identidade padrao/u);
  }
});
