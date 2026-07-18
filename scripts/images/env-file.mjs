import fs from "node:fs";

export const SENSITIVE_IMAGE_ENV_KEYS = [
  "OPENAI_API_KEY",
  "IMAGE_PROVIDER",
  "IMAGE_GENERATION_AUTHORIZED",
  "IMAGE_PUBLICATION_AUTHORIZED",
  "IMAGE_STORAGE_MODE",
  "IMAGE_MAX_COST_USD",
];

export const RUNTIME_ENV_META = Symbol("image-runtime-environment-meta");

export function parseEnvironmentFile(content = "") {
  const parsed = {};
  for (const rawLine of String(content).split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

export function loadRuntimeEnvironment(
  args = {},
  env = process.env,
  { existsSync = fs.existsSync, readFileSync = fs.readFileSync } = {},
) {
  const envFile = args["--env-file"];
  if (!envFile) {
    const runtimeEnv = { ...env };
    Object.defineProperty(runtimeEnv, RUNTIME_ENV_META, {
      value: { source: "synthetic-or-process", conflicts: [], loaded_once: true },
    });
    return runtimeEnv;
  }
  if (!existsSync(envFile)) {
    const error = new Error(`Arquivo de ambiente externo nao encontrado: ${envFile}`);
    error.code = "ENV_FILE_NOT_FOUND";
    throw error;
  }
  const fromFile = parseEnvironmentFile(readFileSync(envFile, "utf8"));
  const conflicts = SENSITIVE_IMAGE_ENV_KEYS.filter(
    (key) => Object.hasOwn(env, key)
      && (!Object.hasOwn(fromFile, key) || String(env[key]) !== String(fromFile[key])),
  );
  const inheritedNonSensitive = Object.fromEntries(
    Object.entries(env).filter(([key]) => !SENSITIVE_IMAGE_ENV_KEYS.includes(key)),
  );
  const runtimeEnv = { ...inheritedNonSensitive, ...fromFile };
  Object.defineProperty(runtimeEnv, RUNTIME_ENV_META, {
    value: { source: "explicit-env-file", conflicts, loaded_once: true },
  });
  return runtimeEnv;
}
