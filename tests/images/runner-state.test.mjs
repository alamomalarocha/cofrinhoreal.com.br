import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  loadRunnerCheckpoint,
  persistRunnerCheckpoint,
  reconcileRunnerCheckpoint,
  updateRunnerStep,
} from "../../scripts/images/runner-state.mjs";

const record = {
  uid: "PHASE-002-BASE",
  numero: "002",
  nome: "Base tecnica Pig Bebe",
  estilo: "base_tecnica",
  kind: "phase_base",
  arquivo: "data/image-automation/phase-bases/002-pig-bebe-base.png",
  prompt_hash: "abc123",
  referencias_prontas: true,
};

test("runner checkpoint is atomic, resumable and does not duplicate assets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cofrinho-runner-"));
  const file = path.join(root, "runner-checkpoint.json");
  let checkpoint = reconcileRunnerCheckpoint(
    null,
    [record, record],
    {
      mode: "dry-run",
      pilot: true,
      resume: true,
      untilComplete: true,
      stopOnError: true,
    },
    "2026-07-16T12:00:00.000Z",
  );
  assert.equal(checkpoint.items.length, 1);
  assert.equal(checkpoint.current_step, "planned");
  persistRunnerCheckpoint(file, checkpoint);

  checkpoint = updateRunnerStep(file, record.arquivo, "background_removed", {
    completedStep: "generated",
    now: "2026-07-16T12:01:00.000Z",
  });
  assert.deepEqual(checkpoint.items[0].completed_steps, ["generated"]);

  const resumed = reconcileRunnerCheckpoint(
    loadRunnerCheckpoint(file),
    [record],
    { resume: true, untilComplete: true, stopOnError: true },
    "2026-07-16T12:02:00.000Z",
  );
  assert.equal(resumed.items.length, 1);
  assert.equal(resumed.items[0].current_step, "background_removed");
  assert.deepEqual(resumed.items[0].completed_steps, ["generated"]);
});

test("runner records a blocked reference without losing the item", () => {
  const blocked = {
    ...record,
    uid: "AVA-002-AZL",
    kind: "identity",
    arquivo: "assets/characters/002-pig-bebe-azul.png",
    referencias_prontas: false,
  };
  const checkpoint = reconcileRunnerCheckpoint(null, [blocked], { resume: true });
  assert.equal(checkpoint.items[0].current_step, "waiting_for_approved_reference");
  assert.equal(checkpoint.current_asset, blocked.arquivo);
});
