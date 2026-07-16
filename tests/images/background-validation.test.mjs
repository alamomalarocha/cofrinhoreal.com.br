import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  alphaMetrics,
  checkerboardScore,
  decodePng,
  encodeRgbaPng,
  removeTechnicalBackground,
  residualBackgroundFraction,
} from "../../scripts/images/png-lib.mjs";
import { validateImageFile } from "../../scripts/images/validate-file.mjs";
import {
  checkerboardFixture,
  solidCharacterFixture,
} from "../fixtures/image-fixtures.mjs";

const config = {
  provider: { size: "64x96" },
  validation: {
    max_file_bytes: 1_000_000,
    min_width: 32,
    min_height: 32,
    max_width: 128,
    max_height: 192,
    min_transparent_fraction: 0.08,
    max_edge_opaque_fraction: 0.08,
    background_color_tolerance: 38,
    background_feather: 18,
    background_shadow_tolerance: 20,
    max_residual_background_fraction: 0.02,
    max_external_shadow_fraction: 0.02,
    max_checkerboard_score: 0.35,
    min_margin_fraction: 0.01,
  },
};

test("local remover creates real alpha while preserving the character", () => {
  const fixture = solidCharacterFixture();
  const result = removeTechnicalBackground(fixture, {
    background: [119, 119, 119],
    tolerance: 20,
    feather: 12,
    shadowTolerance: 10,
  });
  const metrics = alphaMetrics(result);
  assert.ok(metrics.transparent_fraction > 0.5);
  assert.equal(result.rgba[(48 * result.width + 32) * 4 + 3], 255);
  assert.equal(result.rgba[3], 0);
  assert.equal(residualBackgroundFraction(result, [119, 119, 119], 20), 0);
});

test("checkerboard fixture is rejected as fake transparency", () => {
  assert.ok(checkerboardScore(checkerboardFixture()) > 0.35);
});

test("technical validator reports hashes, alpha, dimensions and safe margins", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cofrinho-image-test-"));
  const filePath = path.join(directory, "002-pig-bebe-azul.png");
  const processed = removeTechnicalBackground(solidCharacterFixture(), {
    background: [119, 119, 119],
    tolerance: 20,
    feather: 12,
    shadowTolerance: 10,
  });
  encodeRgbaPng(processed, filePath);
  const decoded = decodePng(filePath);
  assert.equal(decoded.width, 64);
  const report = validateImageFile(filePath, config, {
    expectedAsset: "assets/characters/002-pig-bebe-azul.png",
    background: [119, 119, 119],
  });
  assert.equal(report.valid, true, report.errors.join("; "));
  assert.match(report.sha256, /^[a-f0-9]{64}$/u);
  assert.match(report.perceptual_hash, /^[a-f0-9]{16}$/u);
  assert.ok(report.margins.left > 0);
});
