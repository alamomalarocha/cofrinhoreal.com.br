import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "labs.html"), "utf8");
const script = fs.readFileSync(path.join(root, "labs.js"), "utf8");
const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
const build = fs.readFileSync(path.join(root, "scripts/build-public.mjs"), "utf8");

test("Labs is a public, local-only educational route", () => {
  assert.match(build, /"labs"/u);
  assert.match(build, /"labs\.js"/u);
  assert.match(html, /protótipo público educativo sem backend/iu);
  assert.match(html, /Piloto local — esta proposta ainda não foi enviada/iu);
  assert.doesNotMatch(html, /<form\b/iu);
  assert.doesNotMatch(html, /data-open-login|type=["']password/iu);
});

test("preview iframe is restrictive and user JavaScript is unavailable", () => {
  assert.match(html, /<iframe[^>]+sandbox=""/iu);
  assert.match(html, /referrerpolicy="no-referrer"/iu);
  assert.match(script, /default-src 'none'/u);
  assert.match(script, /script, form, iframe, object, embed/iu);
  assert.match(script, /connect-src 'none'|img-src 'none'/u);
  assert.doesNotMatch(script, /eval\s*\(|new Function|document\.write|\.innerHTML\s*=/u);
  assert.doesNotMatch(script, /fetch\s*\(|XMLHttpRequest|WebSocket|EventSource/iu);
});

test("XSS vectors are filtered and CSP denies external communication", () => {
  for (const pattern of [/\^on/iu, /srcset/iu, /formaction/iu, /javascript:/iu, /data:/iu, /https\?:/iu, /url\\s\*\\\(/iu]) assert.match(script, pattern);
  assert.match(headers, /\/labs\*/u);
  assert.match(headers, /connect-src 'none'/u);
  assert.match(headers, /object-src 'none'/u);
  assert.match(headers, /form-action 'none'/u);
  assert.match(headers, /frame-ancestors 'none'/u);
});

test("learning, proposal and mobile contracts are explicit", () => {
  assert.equal((script.match(/topic:/gu) || []).length, 4);
  for (const level of ["fundamentos", "explorador", "construtor"]) assert.match(html, new RegExp(`data-labs-level="${level}"`, "u"));
  for (const field of ["titulo", "problema", "solucao", "beneficiados", "valorEducativo", "esboco", "cuidados"]) assert.match(html, new RegExp(`data-proposal-field="${field}"`, "u"));
  assert.match(html, /editor completo do Cofrinho Labs foi desenvolvido para computadores/iu);
  assert.match(html, /Recompensa de demonstração: 2 PIG Coins educativas/iu);
});

test("adaptive diagnosis is local, replaceable and permission-neutral", () => {
  assert.equal((html.match(/data-diagnostic-answer/gu) || []).length, 5);
  assert.match(script, /total <= 3 \? "fundamentos" : total <= 7 \? "explorador" : "construtor"/u);
  assert.match(script, /setLearningLevel\(button\.dataset\.labsLevel/u);
  assert.match(script, /resetDiagnostic/u);
  assert.match(script, /data-too-easy/u);
  assert.match(script, /data-too-hard/u);
  assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB|document\.cookie/iu);
  assert.doesNotMatch(script, /data-demo-protection[^]*reduce/iu);
  assert.match(html, /categoria etária fictícia[^]*nunca aumenta permissões/iu);
  assert.match(html, /aria-live="polite" aria-atomic="true" data-diagnostic-result/u);
});

test("mobile learning flow is compact, accessible and beginner-friendly", () => {
  assert.equal((html.match(/data-mobile-toggle=/gu) || []).length, 5);
  assert.equal((html.match(/data-mobile-panel/gu) || []).length, 5);
  for (const id of ["diagnostico-conteudo", "aprendizado-conteudo", "propostas-conteudo", "processo-conteudo", "seguranca-conteudo"]) {
    assert.match(html, new RegExp(`aria-controls="${id}"`, "u"));
  }
  assert.match(html, /labs-title-mobile[^]*Aprenda, crie e construa o Cofrinho Real/iu);
  assert.match(html, /Sandbox educativa: este código não acessa o site real/iu);
  assert.match(html, /Demonstração local e temporária\. Estas PIG Coins/iu);
  assert.match(html, /Seu nível adapta explicações e desafios, mas nunca altera/iu);
  assert.match(html, /data-download-proposal>Salvar rascunho/iu);
  assert.match(html, /rascunho será salvo somente neste dispositivo/iu);
  assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest/iu);
});
