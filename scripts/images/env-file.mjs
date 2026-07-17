import fs from "node:fs";

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

export function loadRuntimeEnvironment(args = {}, env = process.env) {
  const envFile = args["--env-file"];
  if (!envFile) return { ...env };
  if (!fs.existsSync(envFile)) {
    const error = new Error(`Arquivo de ambiente externo nao encontrado: ${envFile}`);
    error.code = "ENV_FILE_NOT_FOUND";
    throw error;
  }
  const fromFile = parseEnvironmentFile(fs.readFileSync(envFile, "utf8"));
  return { ...fromFile, ...env };
}
