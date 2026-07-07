const gallery = document.querySelector("[data-character-gallery]");
const statusLabel = document.querySelector("[data-collection-status]");
const countLabel = document.querySelector("[data-collection-count]");
const filters = document.querySelector("[data-character-filters]");
const collectionYear = "2026";
const assetVersion = "38";

const styleCodes = {
  padrao: "PAD",
  azul: "AZL",
  rosa: "RSA",
  arco_iris: "ARC",
};

const styleLabels = {
  padrao: "Padrao",
  azul: "Azul",
  rosa: "Rosa",
  arco_iris: "Arco-iris",
};

const categoryLabels = {
  mascote_principal: "Mascote Principal",
  avatar_usuario: "Avatar do Usuario",
  personagem_especial: "Personagem Especial",
  familia_principal: "Familia Pig",
  familia_estendida: "Familia Pig",
};

const typeCodes = {
  mascote_principal: "MAS",
  personagem_especial: "ESP",
  familia_principal: "VIL",
  familia_estendida: "VIL",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function categoryFor(person) {
  if (person.tipo === "avatar_usuario") return categoryLabels.avatar_usuario;
  if (person.tipo === "personagem_especial") return "Personagem Especial";
  return categoryLabels[person.tipo] || person.categoria || "Vila Pig";
}

function codeFor(person, style) {
  if (style) {
    return "CR-" + person.numero + "-" + (styleCodes[style] || "VAR") + "-" + collectionYear;
  }

  return "CR-" + person.numero + "-" + (typeCodes[person.tipo] || "VIL") + "-" + collectionYear;
}

function footerLine(person) {
  if (person.numero === "201") {
    return "No dinheiro real, ele so ensina. No PigCoin, ele entra no jogo.";
  }

  if (person.tipo === "avatar_usuario") {
    return "Troco pequeno tambem tem valor.";
  }

  if (person.tipo === "mascote_principal") {
    return "O Pig acompanha cada pequena conquista.";
  }

  return "Uma historia da Vila Pig para aprender com carinho.";
}

function versionedAsset(path) {
  if (!path || path.includes("?")) return path;
  return path + "?v=" + assetVersion;
}

function tagsFor(person, style, status) {
  const tags = ["todos", status];

  if (person.tipo === "mascote_principal") tags.push("mascote");
  if (person.tipo === "avatar_usuario") tags.push("avatar");
  if (person.tipo === "personagem_especial") tags.push("especial");
  if (!["mascote_principal", "avatar_usuario", "personagem_especial"].includes(person.tipo)) {
    tags.push("vila");
  }
  if (style) tags.push(style);

  return tags.join(" ");
}

function makeCard(person, options = {}) {
  const style = options.style || "";
  const image = options.image || person.asset_futuro;
  const status = options.status || person.status_imagem || "pendente";
  const displayStatus = status === "criada" ? "Criado" : "Pendente";
  const category = categoryFor(person);
  const cardCode = codeFor(person, style);
  const styleLabel = style ? styleLabels[style] || style : "Principal";
  const tags = tagsFor(person, style, status);
  const created = status === "criada";
  const title = style ? person.nome + " " + styleLabel : person.nome;
  const imageMarkup = created
    ? '<img src="' + escapeHtml(versionedAsset(image)) + '" alt="' + escapeHtml(title) + '" loading="lazy" />'
    : '<div class="card-placeholder" aria-label="Imagem pendente"><span>' +
      escapeHtml(person.numero) +
      "</span><small>Imagem pendente</small></div>";

  return (
    '<article class="collectible-card ' +
    (created ? "is-created" : "is-pending") +
    '" data-tags="' +
    escapeHtml(tags) +
    '">' +
    '<div class="collectible-topline"><span>CARD No ' +
    escapeHtml(person.numero) +
    "</span><strong>" +
    escapeHtml(category) +
    "</strong></div>" +
    '<div class="collectible-frame">' +
    imageMarkup +
    "</div>" +
    '<div class="collectible-body"><h2>' +
    escapeHtml(title) +
    "</h2><p>" +
    escapeHtml(person.descricao_curta || "Personagem do universo Cofrinho Real.") +
    "</p><dl>" +
    "<div><dt>Estilo</dt><dd>" +
    escapeHtml(styleLabel) +
    "</dd></div>" +
    "<div><dt>Faixa</dt><dd>" +
    escapeHtml(person.faixa_etaria || "-") +
    "</dd></div>" +
    "<div><dt>Colecao</dt><dd>CR " +
    collectionYear +
    "</dd></div>" +
    "<div><dt>Codigo</dt><dd>" +
    escapeHtml(cardCode) +
    "</dd></div>" +
    "</dl></div>" +
    '<div class="collectible-footer"><span class="card-status ' +
    escapeHtml(status) +
    '">' +
    displayStatus +
    "</span><small>" +
    escapeHtml(footerLine(person)) +
    "</small></div>" +
    "</article>"
  );
}

function cardsFromPerson(person) {
  if (person.tipo !== "avatar_usuario") {
    return [makeCard(person)];
  }

  const styles = person.variacoes_planejadas || ["padrao", "azul", "rosa", "arco_iris"];
  return styles.map((style) =>
    makeCard(person, {
      style,
      image: person.assets_variacoes_futuras?.[style],
      status: person.status_variacoes?.[style] || "pendente",
    })
  );
}

function applyFilter(filter) {
  const cards = [...document.querySelectorAll(".collectible-card")];
  let visible = 0;

  cards.forEach((card) => {
    const tags = (card.dataset.tags || "").split(" ");
    const show = filter === "todos" || tags.includes(filter);
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (statusLabel) {
    statusLabel.textContent = visible + " card" + (visible === 1 ? "" : "s") + " na visualizacao atual.";
  }
}

async function loadCollection() {
  if (!gallery) return;

  try {
    const response = await fetch("data/vila-pig-personagens.json", { cache: "no-store" });
    if (!response.ok) throw new Error("JSON indisponivel");

    const people = await response.json();
    gallery.innerHTML = people.flatMap(cardsFromPerson).join("");

    const total = gallery.querySelectorAll(".collectible-card").length;
    const created = gallery.querySelectorAll(".is-created").length;
    if (countLabel) countLabel.textContent = created + " de " + total + " cards criados";
    if (statusLabel) {
      statusLabel.textContent = total + " cards carregados. " + created + " com imagem oficial.";
    }
    applyFilter("todos");
  } catch {
    gallery.innerHTML = "";
    if (statusLabel) {
      statusLabel.textContent =
        "Nao foi possivel carregar a colecao. Abra por um servidor local para ler o JSON estatico.";
    }
  }
}

filters?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;

  filters.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  applyFilter(button.dataset.filter || "todos");
});

loadCollection();
