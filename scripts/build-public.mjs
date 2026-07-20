import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const pages = ["index", "comerciantes", "como-funciona", "cookies", "direitos", "educacao", "familias", "faq", "jogos", "o-que-e", "personagens", "pig-coins", "privacidade", "seguranca", "termos"];
const publicFiles = ["styles.css", "script.js", "approved-avatars.js", "site.webmanifest", "robots.txt", "_headers", "_redirects", "404.html", "assets/favicon.svg", "data/personagens/avatares/avatares-aprovados.json"];
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/personagens/avatares/avatares-aprovados.json"), "utf8"));
const images = ["assets/characters/001-pig-principal.png", ...catalog.avatars.map((item) => item.public_path)];
const pigSha = "efc4cb94ea1f52d0b27fdf78d931672d23d62de0b0128c57ec829e050ac0acd0";
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const copy = (relative) => {
  const source = path.join(root, relative);
  const target = path.join(output, relative);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error(`Arquivo público obrigatório ausente: ${relative}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};
const legalHeader = `<header class="site-header"><div class="site-header-inner"><a class="brand" href="/" aria-label="Cofrinho Real, início"><img class="header-logo" src="assets/characters/001-pig-principal.png?v=46" alt="" /><span class="header-wordmark">Cofrinho <strong>Real</strong></span></a><button class="menu-button" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="site-menu"><span></span><span></span><span></span></button><div class="nav-panel public-nav-panel" id="site-menu"><nav class="nav-links" aria-label="Navegação principal"><a href="/">Home</a><a href="/pig-coins">PigCoin</a><a href="/educacao">Educação</a><a href="/jogos">Jogos</a><a href="/personagens">Personagens</a><a href="/familias">Famílias</a><a href="/seguranca">Segurança</a><a href="/faq">FAQ</a></nav></div></div></header>`;
const legalFooter = `<footer class="site-footer public-footer"><div><a class="brand footer-brand" href="/"><span class="brand-name">Cofrinho <strong>Real</strong></span></a><p>Aprender, brincar e crescer com o Pig.</p></div><nav aria-label="Links legais"><a href="/privacidade">Privacidade</a><a href="/termos">Termos</a><a href="/cookies">Cookies</a><a href="/direitos">Direitos</a></nav></footer>`;
const legalPages = new Set(["cookies", "direitos", "privacidade", "termos"]);
const metadata = (html, route) => {
  const canonical = `https://cofrinhoreal.com.br/${route === "index" ? "" : route}`;
  const additions = `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="Cofrinho Real" /><meta property="og:type" content="website" /><meta property="og:image" content="https://cofrinhoreal.com.br/assets/characters/001-pig-principal.png?v=46" /><meta name="twitter:card" content="summary_large_image" /><link rel="apple-touch-icon" href="assets/favicon.svg" /><script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"Cofrinho Real",url:"https://cofrinhoreal.com.br/"})}</script>`;
  let result = html.replace(/<\/head>/u, `${additions}</head>`);
  if (legalPages.has(route)) result = result.replace(/<body>/u, `<body>${legalHeader}`).replace(/<\/main>/u, `</main>${legalFooter}`);
  return result;
};

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const page of pages) {
  const html = metadata(fs.readFileSync(path.join(root, `${page}.html`), "utf8"), page);
  const target = page === "index" ? path.join(output, "index.html") : path.join(output, page, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  if (page !== "index") fs.writeFileSync(path.join(output, `${page}.html`), html);
}
for (const file of [...publicFiles, ...images]) copy(file);
if (sha(path.join(output, images[0])) !== pigSha) throw new Error("SHA do Pig Principal divergiu no build.");
for (const item of catalog.avatars) if (sha(path.join(output, item.public_path)) !== item.sha256) throw new Error(`SHA divergente: ${item.uid}`);
const forbidden = /(^|\/)(?:docs|scripts|tests|cloudflare|node_modules|runtime|tmp|checkpoints|data\/image-automation)(?:\/|$)|(?:^|\/)(?:package(?:-lock)?\.json|pnpm-lock\.yaml|README\.md|\.env(?:\..*)?|wrangler\.toml)(?:$|\/)/iu;
const built = fs.readdirSync(output, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => path.relative(output, path.join(entry.parentPath, entry.name)).replaceAll("\\", "/")).sort();
if (built.some((file) => forbidden.test(file))) throw new Error("Denylist encontrada no output público.");
console.log(JSON.stringify({ output_directory: "dist", included_count: built.length, included: built, excluded: ["package.json", "package-lock.json", "README.md", "docs/", "scripts/", "tests/", "data/image-automation/", "runtime/", "tmp/"] }, null, 2));
