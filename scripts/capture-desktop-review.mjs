import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "docs", "review", "desktop-visual-foundation");
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
  for (const viewport of [
    { name: "desktop-1440", width: 1440, height: 1000 },
    { name: "mobile-390", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.locator(".desktop-foundation").screenshot({
      path: path.join(output, `${viewport.name}.png`),
    });
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(output);
