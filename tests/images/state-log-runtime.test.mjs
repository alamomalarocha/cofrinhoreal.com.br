import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { appendJsonl, fromRoot, readJsonl } from "../../scripts/images/lib.mjs";

const statePath = "data/image-automation/runtime/test-state-log.jsonl";
const absoluteStatePath = fromRoot(statePath);

test("state log is ignored while its structural example remains versionable", () => {
  const gitignore = fs.readFileSync(fromRoot(".gitignore"), "utf8");
  assert.match(gitignore, /^data\/image-automation\/state\.jsonl$/mu);
  assert.equal(fs.existsSync(fromRoot("data/image-automation/state.example.jsonl")), true);
  const ignored = spawnSync("git", ["check-ignore", "-q", "data/image-automation/state.jsonl"], {
    cwd: fromRoot(),
  });
  assert.equal(ignored.status, 0);
});

test("missing state log is empty and append creates a metadata-free readable log", (context) => {
  fs.rmSync(absoluteStatePath, { force: true });
  context.after(() => fs.rmSync(absoluteStatePath, { force: true }));
  assert.deepEqual(readJsonl(statePath), []);
  const event = { type: "state", status: "pendente", asset: "example.png" };
  appendJsonl(statePath, event);
  assert.equal(fs.existsSync(absoluteStatePath), true);
  assert.deepEqual(readJsonl(statePath), [event]);
  assert.notEqual(readJsonl(statePath)[0].type, "metadata");
});

test("ignored operational events do not make a git workspace dirty", (context) => {
  const repository = fs.mkdtempSync(path.join(fromRoot("data/image-automation/runtime"), "state-git-test-"));
  context.after(() => fs.rmSync(repository, { recursive: true, force: true }));
  assert.equal(spawnSync("git", ["init", "-q"], { cwd: repository }).status, 0);
  fs.writeFileSync(path.join(repository, ".gitignore"), "state.jsonl\n", "utf8");
  fs.writeFileSync(path.join(repository, "state.jsonl"), `${JSON.stringify({ type: "state" })}\n`, "utf8");
  const status = spawnSync("git", ["status", "--porcelain", "--", "state.jsonl"], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(status.status, 0);
  assert.equal(status.stdout, "");
});
