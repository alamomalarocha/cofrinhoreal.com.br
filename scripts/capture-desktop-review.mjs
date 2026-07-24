import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "docs", "review", "cofrinho-labs-foundation");
const port = 4191;
const server = spawn(process.execPath, ["scripts/serve-public.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("Preview server timeout")), 10000);
  server.once("exit", (code) => reject(new Error(`Preview server exited: ${code}`)));
  server.stdout.on("data", (chunk) => {
    if (String(chunk).includes("Public preview")) {
      clearTimeout(timer);
      resolve();
    }
  });
});

fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
try {
  const captures = [
    { name: "entrada-desktop", width: 1440, height: 1000, view: "visao-geral" },
    { name: "diagnostico-desktop", width: 1440, height: 1000, view: "diagnostico" },
    { name: "desafio-desktop", width: 1440, height: 1000, view: "aprender" },
    { name: "editor-desktop", width: 1440, height: 1000, view: "criar" },
    { name: "proposta-desktop", width: 1440, height: 1000, view: "ideia" },
    { name: "entrada-mobile", width: 390, height: 844, view: "visao-geral" },
    { name: "diagnostico-mobile", width: 390, height: 844, view: "diagnostico" },
    { name: "desafio-mobile", width: 390, height: 844, view: "aprender" },
    { name: "proposta-mobile", width: 390, height: 844, view: "ideia" },
  ];
  for (const capture of captures) {
    const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height } });
    await page.goto(`http://127.0.0.1:${port}/labs#${capture.view}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(output, `${capture.name}.png`), fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(output);
