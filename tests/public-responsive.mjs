import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4187;
const origin = `http://127.0.0.1:${port}`;
const routes = ["/", "/personagens", "/o-que-e", "/cookies", "/direitos", "/privacidade", "/termos", "/rota-inexistente"];
const viewports = [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const server = spawn(process.execPath, ["scripts/serve-public.mjs"], {
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

const browser = await chromium.launch();
const report = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ""}`));

    for (const route of routes) {
      consoleErrors.length = 0;
      pageErrors.length = 0;
      failedRequests.length = 0;
      const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), route === "/rota-inexistente" ? 404 : 200, `${viewport.width}px ${route}`);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
        clippedControls: [...document.querySelectorAll("button, h1, h2, h3")].filter((element) => {
          const style = getComputedStyle(element);
          return style.overflow !== "visible" && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
        }).map((element) => element.textContent?.trim().slice(0, 80)),
      }));
      assert.ok(layout.overflow <= 1, `horizontal overflow ${layout.overflow}px at ${viewport.width}px ${route}`);
      assert.deepEqual(layout.brokenImages, [], `broken images at ${viewport.width}px ${route}`);
      assert.deepEqual(layout.clippedControls, [], `clipped controls at ${viewport.width}px ${route}`);
      const unexpectedConsole = route === "/rota-inexistente"
        ? consoleErrors.filter((message) => !message.includes("status of 404"))
        : consoleErrors;
      assert.deepEqual(unexpectedConsole, [], `console errors at ${viewport.width}px ${route}`);
      assert.deepEqual(pageErrors, [], `page errors at ${viewport.width}px ${route}`);
      assert.deepEqual(failedRequests, [], `network failures at ${viewport.width}px ${route}`);
    }

    consoleErrors.length = 0;
    pageErrors.length = 0;
    failedRequests.length = 0;
    await page.goto(`${origin}/personagens`, { waitUntil: "networkidle" });
    const styleHref = await page.locator('link[rel="stylesheet"]').getAttribute("href");
    assert.match(styleHref || "", /styles\.css\?v=46/u);
    const scriptSources = await page.locator("script[src]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("src")));
    assert.ok(scriptSources.every((source) => !source?.includes("v=45")));
    await page.locator('[data-avatar-filter="rosa"]').click();
    assert.equal(await page.locator('[data-avatar-filter="rosa"]').getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator('[data-avatar-filter="todos"]').getAttribute("aria-pressed"), "false");
    assert.equal(await page.locator(".approved-avatar-card").count(), 9);

    const menu = page.locator(".menu-button");
    if (await menu.isVisible()) {
      await menu.click();
      assert.equal(await menu.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await menu.getAttribute("aria-expanded"), "false");
    }
    await page.locator("body").press("Tab");
    assert.notEqual(await page.evaluate(() => document.activeElement?.tagName), "BODY", `keyboard focus at ${viewport.width}px`);
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
    assert.equal(await page.locator("main").count(), 1);
    assert.equal(await page.locator('img[src*="002-brasileirinho"]').getAttribute("alt"), "Brasileirinho, pássaro personagem que representa o governo do Universo Cofrinho Real");
    assert.equal(await page.locator("button:disabled").count() > 0, true);
    const desktopMenu = page.locator("[data-desktop-menu]");
    if (viewport.width <= 860) {
      await desktopMenu.click();
      assert.equal(await desktopMenu.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await desktopMenu.getAttribute("aria-expanded"), "false");
    }
    const headingOrder = await page.locator("h1, h2, h3").evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));
    assert.equal(headingOrder.every((level, index) => index === 0 || level <= headingOrder[index - 1] + 1), true, `heading order at ${viewport.width}px`);
    assert.deepEqual(consoleErrors, [], `console errors at ${viewport.width}px`);
    assert.deepEqual(pageErrors, [], `page errors at ${viewport.width}px`);
    assert.deepEqual(failedRequests, [], `network failures at ${viewport.width}px`);
    report.push({ width: viewport.width, routes: routes.length, console_errors: 0, network_failures: 0, overflow: 0 });
    await context.close();
  }
  console.log(JSON.stringify({ engine: "playwright-chromium", viewports: report, result: "PASS" }, null, 2));
} finally {
  await browser.close();
  server.kill();
}
