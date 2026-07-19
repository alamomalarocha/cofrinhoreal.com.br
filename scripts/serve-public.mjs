import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\//u, "");
  const candidates = [relative, path.join(relative, "index.html")];
  const file = candidates.map((item) => path.resolve(root, item)).find((item) => item.startsWith(root + path.sep) && fs.existsSync(item) && fs.statSync(item).isFile());
  const target = file || path.join(root, "404.html");
  response.writeHead(file ? 200 : 404, { "Content-Type": types[path.extname(target)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(target).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Public preview: http://127.0.0.1:${port}`));
