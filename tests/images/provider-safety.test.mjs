import assert from "node:assert/strict";
import test from "node:test";
import {
  assertGenerationAuthorized,
  generationGate,
  sanitizeForLog,
} from "../../scripts/images/safety.mjs";
import {
  classifyOpenAIError,
  createOpenAIImageProvider,
} from "../../scripts/images/providers/openai-image-provider.mjs";
import {
  providerModelSelection,
  resolveImageModel,
} from "../../scripts/images/model-config.mjs";

const executableConfig = {
  mode: "execute",
  provider: {
    name: "openai",
    enabled: true,
    estimated_cost_usd_per_image: 0.041,
  },
  authorization: {
    environment_variable: "IMAGE_GENERATION_AUTHORIZED",
    required_value: "true",
    provider_environment_variable: "IMAGE_PROVIDER",
    required_provider: "openai",
    execute_flag: "--execute-paid-generation",
    budget_environment_variable: "IMAGE_MAX_COST_USD",
  },
  limits: { max_cost_usd: 0 },
};

test("generation is blocked by default and cannot reach a provider", () => {
  const gate = generationGate(executableConfig, {}, {});
  assert.equal(gate.authorized, false);
  assert.throws(
    () => assertGenerationAuthorized(executableConfig, {}, {}),
    /Geracao paga bloqueada/u,
  );
});

test("all explicit locks are required", () => {
  const args = {
    "--execute-paid-generation": true,
    "--max-cost-usd": "0.19",
    "--only-phase-base": "002",
    "--no-publish": true,
    "--no-push": true,
    "--review-policy": "human-mandatory",
  };
  const env = {
    OPENAI_API_KEY: "test-key",
    IMAGE_GENERATION_AUTHORIZED: "true",
    IMAGE_PROVIDER: "openai",
    IMAGE_PUBLICATION_AUTHORIZED: "false",
    IMAGE_STORAGE_MODE: "local",
  };
  const conditions = {
    requiredPhase: "002",
    requiredBudgetUsd: 0.18,
    maxAllowedBudgetUsd: 0.19,
    selectionCount: 1,
    gitClean: true,
    referenceReady: true,
    stopAbsent: true,
    baseAbsent: true,
  };
  assert.equal(generationGate(executableConfig, args, env, conditions).authorized, true);
});

test("official adapter uses binary image edit request without network in tests", async () => {
  let request;
  const provider = createOpenAIImageProvider({
    client: {
      images: {
        edit: async (payload) => {
          request = payload;
          return {
            data: [{ b64_json: Buffer.from("fake-png").toString("base64") }],
            _request_id: "req_test",
          };
        },
      },
    },
  });
  const result = await provider.generateEdit({
    apiKey: "unused",
    referenceBytes: Buffer.from("reference"),
    referenceName: "001-pig-principal.png",
    prompt: "test prompt",
    model: "gpt-image-2-2026-04-21",
    fallbackModel: "gpt-image-2",
    quality: "medium",
    size: "1024x1536",
    outputFormat: "png",
    maxAttempts: 1,
  });
  assert.equal(request.model, "gpt-image-2-2026-04-21");
  assert.equal(request.quality, "medium");
  assert.equal(request.size, "1024x1536");
  assert.equal(request.output_format, "png");
  assert.equal(result.png_bytes.toString(), "fake-png");
});

test("official adapter sends every curated reference as a binary image input", async () => {
  let request;
  const provider = createOpenAIImageProvider({
    client: {
      images: {
        edit: async (payload) => {
          request = payload;
          return {
            data: [{ b64_json: Buffer.from("fake-png").toString("base64") }],
          };
        },
      },
    },
  });
  await provider.generateEdit({
    apiKey: "unused",
    referenceFiles: [
      { bytes: Buffer.from("pig-principal"), name: "001-pig-principal.png" },
      { bytes: Buffer.from("fase-bebe"), name: "fase-bebe.png" },
    ],
    prompt: "test prompt",
    model: "gpt-image-2-2026-04-21",
    fallbackModel: "gpt-image-2",
    quality: "medium",
    size: "1024x1536",
    outputFormat: "png",
    maxAttempts: 1,
  });
  assert.equal(Array.isArray(request.image), true);
  assert.deepEqual(request.image.map((image) => image.name), [
    "001-pig-principal.png",
    "fase-bebe.png",
  ]);
  assert.equal(request.image[0].bytes.toString(), "pig-principal");
  assert.equal(request.image[1].bytes.toString(), "fase-bebe");
});

test("official snapshot and alias share the GPT Image 2 pricing base", () => {
  assert.equal(
    resolveImageModel("gpt-image-2-2026-04-21").pricing_base_model,
    "gpt-image-2",
  );
  assert.equal(resolveImageModel("gpt-image-2").kind, "official-alias");
  const selection = providerModelSelection({
    primary_model: "gpt-image-2-2026-04-21",
    fallback_model: "gpt-image-2",
  });
  assert.equal(selection.primary.kind, "official-snapshot");
  assert.equal(selection.fallback.kind, "official-alias");
});

test("model fallback is blocked by default", async () => {
  let calls = 0;
  const provider = createOpenAIImageProvider({
    client: {
      images: {
        edit: async () => {
          calls += 1;
          const error = new Error("model not found");
          error.code = "model_not_found";
          throw error;
        },
      },
    },
  });
  await assert.rejects(
    provider.generateEdit({
      apiKey: "unused",
      referenceBytes: Buffer.from("reference"),
      referenceName: "001-pig-principal.png",
      prompt: "test prompt",
      model: "gpt-image-2-2026-04-21",
      fallbackModel: "gpt-image-2",
      maxAttempts: 3,
    }),
    (error) => error.code === "MODEL_FALLBACK_AUTHORIZATION_REQUIRED",
  );
  assert.equal(calls, 1);
});

test("model fallback requires the explicit authorization flag", async () => {
  const models = [];
  const provider = createOpenAIImageProvider({
    client: {
      images: {
        edit: async ({ model }) => {
          models.push(model);
          if (model === "gpt-image-2-2026-04-21") {
            const error = new Error("model not found");
            error.code = "model_not_found";
            throw error;
          }
          return { data: [{ b64_json: Buffer.from("fallback-png").toString("base64") }] };
        },
      },
    },
  });
  const result = await provider.generateEdit({
    apiKey: "unused",
    referenceBytes: Buffer.from("reference"),
    referenceName: "001-pig-principal.png",
    prompt: "test prompt",
    model: "gpt-image-2-2026-04-21",
    fallbackModel: "gpt-image-2",
    allowModelFallback: true,
    maxAttempts: 2,
  });
  assert.deepEqual(models, ["gpt-image-2-2026-04-21", "gpt-image-2"]);
  assert.equal(result.model, "gpt-image-2");
});

test("error classes and log sanitization are deterministic", () => {
  assert.deepEqual(classifyOpenAIError({ status: 429 }), {
    type: "rate_limit",
    retryable: true,
  });
  assert.deepEqual(classifyOpenAIError({ status: 503 }), {
    type: "server",
    retryable: true,
  });
  const sanitized = sanitizeForLog({
    api_key: "sk-secret-value",
    b64_json: "A".repeat(500),
  });
  assert.equal(sanitized.api_key, "[REDACTED]");
  assert.equal(sanitized.b64_json, "[REDACTED]");
});
