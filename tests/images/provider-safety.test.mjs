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
  const args = { "--execute-paid-generation": true, "--max-cost-usd": "0.10" };
  const env = {
    OPENAI_API_KEY: "test-key",
    IMAGE_GENERATION_AUTHORIZED: "true",
    IMAGE_PROVIDER: "openai",
  };
  assert.equal(generationGate(executableConfig, args, env).authorized, true);
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
