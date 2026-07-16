import { setTimeout as sleepDefault } from "node:timers/promises";

export function classifyOpenAIError(error) {
  const status = Number(error?.status || error?.response?.status || 0);
  const code = String(error?.code || error?.error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  if (status === 401 || status === 403 || /auth|api key|permission/u.test(message)) {
    return { type: "authentication", retryable: false };
  }
  if (status === 429 || code.includes("rate_limit")) {
    return { type: "rate_limit", retryable: true };
  }
  if (status >= 500) return { type: "server", retryable: true };
  if (/moderation|safety|content_policy/u.test(`${code} ${message}`)) {
    return { type: "moderation", retryable: false };
  }
  if (/model.*not.*found|does not exist|unsupported model/u.test(message) || code === "model_not_found") {
    return { type: "model_unavailable", retryable: false };
  }
  return { type: "request", retryable: false };
}

function responseBase64(response) {
  const value = response?.data?.[0]?.b64_json;
  if (!value || typeof value !== "string") {
    const error = new Error("A resposta da OpenAI nao trouxe imagem PNG em base64.");
    error.code = "MISSING_IMAGE_DATA";
    throw error;
  }
  return value;
}

export function createOpenAIImageProvider({
  client,
  sdkLoader = () => import("openai"),
  sleep = sleepDefault,
  stopRequested = () => false,
} = {}) {
  async function resolveSdk(apiKey) {
    if (client) return { client, toFile: async (bytes, name) => ({ bytes, name }) };
    const sdk = await sdkLoader();
    return {
      client: new sdk.default({ apiKey }),
      toFile: sdk.toFile,
    };
  }

  return {
    async generateEdit({
      apiKey,
      referenceBytes,
      referenceName,
      prompt,
      model,
      fallbackModel,
      quality,
      size,
      outputFormat,
      maxAttempts = 3,
      pauseMs = 1500,
    }) {
      const sdk = await resolveSdk(apiKey);
      const image = await sdk.toFile(referenceBytes, referenceName, { type: "image/png" });
      let selectedModel = model;
      let lastError;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        if (stopRequested()) {
          const error = new Error("Parada segura solicitada antes da chamada OpenAI.");
          error.code = "STOP_REQUESTED";
          error.attempts = attempt - 1;
          throw error;
        }
        try {
          const response = await sdk.client.images.edit({
            model: selectedModel,
            image,
            prompt,
            quality,
            size,
            output_format: outputFormat,
          });
          return {
            png_bytes: Buffer.from(responseBase64(response), "base64"),
            model: selectedModel,
            attempts: attempt,
            request_id: response?._request_id || null,
            usage: response?.usage || null,
          };
        } catch (error) {
          lastError = error;
          const classification = classifyOpenAIError(error);
          if (classification.type === "model_unavailable"
              && fallbackModel
              && selectedModel !== fallbackModel) {
            selectedModel = fallbackModel;
            continue;
          }
          if (!classification.retryable || attempt >= maxAttempts) {
            error.classification = classification.type;
            error.attempts = attempt;
            throw error;
          }
          await sleep(pauseMs * attempt);
        }
      }
      throw lastError;
    },
  };
}
