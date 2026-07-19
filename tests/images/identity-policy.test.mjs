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

test("identity prompts are isolated, preserve structure and require exact clothing", () => {
  const { styles, phaseBootstrap } = loadContext();
  const phase = phaseByKey(phaseBootstrap, "fase_bebe");
  const prompts = Object.fromEntries(styles.active_order.map((identity) => [identity,
    buildIdentityPrompt(identity, phase, phaseBootstrap, "#777777", styles)]));
  assert.match(prompts.azul, /claramente masculina/u);
  assert.match(prompts.azul, /camisa azul lisa, short azul-claro/u);
  assert.doesNotMatch(prompts.azul, /feminina|neutra/u);
  assert.match(prompts.rosa, /claramente feminina/u);
  assert.match(prompts.rosa, /camisa rosa lisa, short rosa-claro/u);
  assert.doesNotMatch(prompts.rosa, /masculina|neutra/u);
  assert.match(prompts.arco_iris, /Apresentacao neutra equilibrada/u);
  assert.match(prompts.arco_iris, /sem predominancia masculina ou feminina/u);
  assert.match(prompts.arco_iris, /vermelho, laranja, amarelo, verde, azul e roxo/u);
  assert.match(prompts.arco_iris, /short off-white/u);
  for (const prompt of Object.values(prompts)) {
    assert.match(prompt, /mesmo personagem/u);
    assert.match(prompt, /mesmo cabelo ou topete/u);
    assert.match(prompt, /mesma anatomia/u);
    assert.match(prompt, /mesmas proporcoes/u);
    assert.match(prompt, /mesma pose/u);
    assert.match(prompt, /Nao altere cabelo ou topete/u);
    assert.doesNotMatch(prompt, /short ou calca/u);
    assert.match(prompt, /Um unico personagem, corpo inteiro/u);
    assert.match(prompt, /Sem sexualizacao, exagero ou caricatura ofensiva/u);
    assert.match(prompt, /Sem maos nos bolsos, texto/u);
    assert.match(prompt, /logotipo/u);
    assert.match(prompt, /moeda/u);
    assert.match(prompt, /cenario/u);
    assert.match(prompt, /referencia incorporada/u);
    assert.match(prompt, /base tecnica visivel/u);
    assert.match(prompt, /Nao crie quarta identidade/u);
    assert.match(prompt, /roupa bege/u);
  }
});
