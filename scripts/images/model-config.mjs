export const OFFICIAL_IMAGE_MODELS = Object.freeze({
  "gpt-image-2-2026-04-21": Object.freeze({
    requested_model: "gpt-image-2-2026-04-21",
    pricing_base_model: "gpt-image-2",
    kind: "official-snapshot",
  }),
  "gpt-image-2": Object.freeze({
    requested_model: "gpt-image-2",
    pricing_base_model: "gpt-image-2",
    kind: "official-alias",
  }),
});

export function resolveImageModel(model) {
  const resolved = OFFICIAL_IMAGE_MODELS[String(model || "").trim()];
  if (!resolved) throw new Error(`Modelo de imagem nao reconhecido: ${model || "(vazio)"}`);
  return resolved;
}

export function providerModelSelection(provider = {}) {
  const primaryModel = provider.primary_model || provider.model;
  const fallbackModel = provider.fallback_model || null;
  return {
    primary: resolveImageModel(primaryModel),
    fallback: fallbackModel ? resolveImageModel(fallbackModel) : null,
  };
}

