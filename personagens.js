(() => {
const gallery = document.querySelector("[data-character-gallery]");
const statusLabel = document.querySelector("[data-collection-status]");
const countLabel = document.querySelector("[data-collection-count]");
const filters = document.querySelector("[data-character-filters]");
const advancedFilters = document.querySelector("[data-advanced-filters]");
const searchInput = document.querySelector("[data-collection-search]");
const clearFiltersButton = document.querySelector("[data-clear-filters]");
const pagination = document.querySelector("[data-collection-pagination]");
const pageLabel = document.querySelector("[data-page-label]");
const collectionYear = "2026";
const assetVersion = "39";
const pageSize = 24;

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
  personagem_vila: "Vila Pig",
  familia_principal: "Familia Pig",
  familia_estendida: "Familia Pig",
};

const typeLabels = {
  mascote_principal: "Mascote",
  avatar_usuario: "Avatar do usuario",
  personagem_especial: "Especial",
  personagem_vila: "Vila Pig",
};

const state = {
  cards: [],
  quickFilter: "todos",
  page: 1,
  search: "",
  fields: {},
  lookups: {},
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function categoryFor(person) {
  return (
    categoryLabels[person.tipo_personagem] ||
    categoryLabels[person.tipo] ||
    person.categoria ||
    "Vila Pig"
  );
}

function codeFor(person, style) {
  if (style) {
    return (
      person.card_codes_variacoes?.[style] ||
      "CR-" + person.numero + "-" + (styleCodes[style] || "VAR") + "-" + collectionYear
    );
  }
  return person.card_code || "CR-" + person.numero + "-VIL-" + collectionYear;
}

function footerLine(person) {
  if (person.numero === "201") {
    return "No dinheiro real, ele so ensina. No PigCoin, ele entra no jogo.";
  }
  if (person.tipo === "avatar_usuario") return "Troco pequeno tambem tem valor.";
  if (person.tipo === "mascote_principal") return "O Pig acompanha cada pequena conquista.";
  return "Uma historia da Vila Pig para aprender com carinho.";
}

function versionedAsset(assetPath) {
  if (!assetPath || assetPath.includes("?")) return assetPath;
  return assetPath + "?v=" + assetVersion;
}

function lookup(group, key, fallback = "") {
  return state.lookups[group]?.get(key) || fallback || key || "";
}

function tagsFor(model) {
  const { person, style, status } = model;
  const tags = ["todos", status === "criada" ? "criado" : "pendente"];
  if (person.tipo_personagem === "mascote_principal") tags.push("mascote");
  if (person.tipo_personagem === "avatar_usuario") tags.push("avatar");
  if (person.tipo_personagem === "personagem_especial") tags.push("especial");
  if (person.tipo_personagem === "personagem_vila") tags.push("vila");
  if (style) tags.push(style);
  return tags;
}

function createModel(person, options = {}) {
  const style = options.style || "";
  const status = options.status || person.status_imagem || "pendente";
  const model = {
    person,
    style,
    status,
    image: options.image || person.asset_futuro,
  };
  model.tags = tagsFor(model);
  return model;
}

function modelsFromPerson(person) {
  if (person.tipo !== "avatar_usuario") return [createModel(person)];
  const styles = person.variacoes_planejadas || ["padrao", "azul", "rosa", "arco_iris"];
  return styles.map((style) =>
    createModel(person, {
      style,
      image: person.assets_variacoes_futuras?.[style],
      status: person.status_variacoes?.[style] || "pendente",
    })
  );
}

function phaseLabel(person) {
  return lookup("phases", person.fase_vida, person.faixa_etaria || "-");
}

function locationLabel(person) {
  const region = lookup("regions", person.regiao);
  const stateName = lookup("states", person.uf);
  return [region, stateName].filter(Boolean).join(" / ") || "A catalogar";
}

function taxonomyMarkup(person) {
  const labels = [
    person.familia_uid ? lookup("families", person.familia_uid) : "",
    ...(person.profissoes || []).slice(0, 1).map((id) => lookup("professions", id)),
    ...(person.folclore || []).slice(0, 1).map((id) => lookup("folklore", id)),
  ].filter(Boolean);
  if (!labels.length) return "";
  return '<ul class="card-taxonomy">' + labels.map((label) => "<li>" + escapeHtml(label) + "</li>").join("") + "</ul>";
}

function makeCard(model) {
  const { person, style, image, status } = model;
  const displayStatus = status === "criada" ? "Criado" : "Pendente";
  const category = categoryFor(person);
  const cardCode = codeFor(person, style);
  const styleLabel = style ? styleLabels[style] || style : "Principal";
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
    "</p>" +
    taxonomyMarkup(person) +
    "<dl>" +
    "<div><dt>Estilo</dt><dd>" +
    escapeHtml(styleLabel) +
    "</dd></div>" +
    "<div><dt>Fase</dt><dd>" +
    escapeHtml(phaseLabel(person)) +
    "</dd></div>" +
    "<div><dt>Regiao</dt><dd>" +
    escapeHtml(locationLabel(person)) +
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

function searchText(model) {
  const { person, style, status } = model;
  return normalize(
    [
      person.numero,
      person.uid,
      person.card_code,
      person.nome,
      person.slug,
      person.apelido,
      ...(person.aliases || []),
      person.tipo_personagem,
      person.tipo,
      person.categoria,
      person.subcategoria,
      person.descricao_curta,
      person.papel,
      style,
      status,
      phaseLabel(person),
      locationLabel(person),
      person.familia_uid ? lookup("families", person.familia_uid) : "",
      ...(person.profissoes || []).map((id) => lookup("professions", id)),
      ...(person.folclore || []).map((id) => lookup("folklore", id)),
      ...(person.tags || []),
    ].join(" ")
  );
}

function matchesField(model, field, expected) {
  if (!expected) return true;
  const { person, style, status } = model;
  if (field === "estilo") return style === expected;
  if (field === "status") return status === expected;
  const value = person[field];
  return Array.isArray(value) ? value.includes(expected) : value === expected;
}

function filteredCards() {
  const query = normalize(state.search);
  return state.cards.filter((model) => {
    if (state.quickFilter !== "todos" && !model.tags.includes(state.quickFilter)) return false;
    if (query && !searchText(model).includes(query)) return false;
    return Object.entries(state.fields).every(([field, expected]) => matchesField(model, field, expected));
  });
}

function renderCollection() {
  const matches = filteredCards();
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  state.page = Math.min(Math.max(state.page, 1), totalPages);
  const start = (state.page - 1) * pageSize;
  const visible = matches.slice(start, start + pageSize);
  gallery.innerHTML = visible.map(makeCard).join("");

  if (!matches.length) {
    statusLabel.textContent = "Nenhum card corresponde aos filtros atuais.";
  } else {
    statusLabel.textContent =
      "Exibindo " + (start + 1) + " a " + (start + visible.length) + " de " + matches.length + " cards filtrados.";
  }

  pagination.hidden = totalPages <= 1;
  pageLabel.textContent = "Pagina " + state.page + " de " + totalPages;
  pagination.querySelector('[data-page-action="previous"]').disabled = state.page <= 1;
  pagination.querySelector('[data-page-action="next"]').disabled = state.page >= totalPages;
}

function addOptions(select, entries) {
  for (const [value, label] of entries) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function populateFilters(catalogs, people) {
  const selects = Object.fromEntries(
    [...advancedFilters.querySelectorAll("select[data-filter-field]")].map((select) => [select.dataset.filterField, select])
  );
  const types = [...new Set(people.map((person) => person.tipo_personagem))]
    .filter(Boolean)
    .sort()
    .map((value) => [value, typeLabels[value] || value]);
  addOptions(selects.tipo_personagem, types);
  addOptions(selects.regiao, catalogs.regions.regioes.map((item) => [item.slug, item.nome]));
  addOptions(selects.uf, catalogs.states.ufs.map((item) => [item.sigla, item.sigla + " - " + item.nome]));
  addOptions(selects.familia_uid, catalogs.families.familias.map((item) => [item.uid, item.nome_exibicao]));
  addOptions(selects.profissoes, catalogs.professions.profissoes.map((item) => [item.id_estavel, item.nome_exibicao]));
  addOptions(selects.geracao, catalogs.generations.geracoes.map((item) => [item.id_estavel, item.nome_exibicao]));
  addOptions(selects.fase_vida, catalogs.phases.fases.map((item) => [item.id, item.nome_exibicao]));
  addOptions(selects.estilo, Object.entries(styleLabels));
  addOptions(selects.folclore, catalogs.folklore.figuras.map((item) => [item.uid, item.nome]));
}

function buildLookups(catalogs) {
  state.lookups = {
    regions: new Map(catalogs.regions.regioes.map((item) => [item.slug, item.nome])),
    states: new Map(catalogs.states.ufs.map((item) => [item.sigla, item.nome])),
    families: new Map(catalogs.families.familias.map((item) => [item.uid, item.nome_exibicao])),
    professions: new Map(catalogs.professions.profissoes.map((item) => [item.id_estavel, item.nome_exibicao])),
    generations: new Map(catalogs.generations.geracoes.map((item) => [item.id_estavel, item.nome_exibicao])),
    phases: new Map(catalogs.phases.fases.map((item) => [item.id, item.nome_exibicao])),
    folklore: new Map(catalogs.folklore.figuras.map((item) => [item.uid, item.nome])),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(url + " indisponivel");
  return response.json();
}

async function loadCollection() {
  if (!gallery) return;

  try {
    const [people, regions, states, families, professions, generations, phases, folklore] = await Promise.all([
      fetchJson("data/vila-pig-personagens.json"),
      fetchJson("data/regioes-brasil.json"),
      fetchJson("data/ufs-brasil.json"),
      fetchJson("data/familias-vila-pig.json"),
      fetchJson("data/profissoes.json"),
      fetchJson("data/geracoes.json"),
      fetchJson("data/fases-vida.json"),
      fetchJson("data/folclore-brasileiro.json"),
    ]);
    const catalogs = { regions, states, families, professions, generations, phases, folklore };
    buildLookups(catalogs);
    populateFilters(catalogs, people);
    state.cards = people.flatMap(modelsFromPerson);

    const created = state.cards.filter((model) => model.status === "criada").length;
    countLabel.textContent = created + " de " + state.cards.length + " cards criados";
    renderCollection();
  } catch (error) {
    gallery.innerHTML = "";
    statusLabel.textContent =
      "Nao foi possivel carregar a colecao. Abra por um servidor local para ler os dados estaticos.";
    console.error(error);
  }
}

filters?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  filters.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  state.quickFilter = button.dataset.filter || "todos";
  state.page = 1;
  renderCollection();
});

searchInput?.addEventListener("input", () => {
  state.search = searchInput.value;
  state.page = 1;
  renderCollection();
});

advancedFilters?.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-filter-field]");
  if (!select) return;
  state.fields[select.dataset.filterField] = select.value;
  state.page = 1;
  renderCollection();
});

clearFiltersButton?.addEventListener("click", () => {
  state.quickFilter = "todos";
  state.search = "";
  state.fields = {};
  searchInput.value = "";
  advancedFilters.querySelectorAll("select[data-filter-field]").forEach((select) => {
    select.value = "";
  });
  filters.querySelectorAll("button[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "todos");
  });
  state.page = 1;
  renderCollection();
});

pagination?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page-action]");
  if (!button) return;
  state.page += button.dataset.pageAction === "next" ? 1 : -1;
  renderCollection();
  statusLabel.scrollIntoView({ behavior: "smooth", block: "start" });
});

loadCollection();
})();
