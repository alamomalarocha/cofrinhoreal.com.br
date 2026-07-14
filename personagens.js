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
  const progress = document.querySelector("[data-load-progress]");
  const progressLabel = document.querySelector("[data-load-progress-label]");
  const progressBar = document.querySelector("[data-load-progress-bar]");
  const collectionYear = "2026";
  const assetVersion = "42";
  const pageSize = 24;
  const batchSize = 3;

  const styleCodes = {
    padrao: "PAD",
    azul: "AZL",
    rosa: "RSA",
    arco_iris: "ARC",
  };

  const styleLabels = {
    padrao: "Padrão",
    azul: "Azul",
    rosa: "Rosa",
    arco_iris: "Arco-íris",
  };

  const categoryLabels = {
    mascote_principal: "Mascote Principal",
    avatar_usuario: "Avatar do usuário",
    personagem_especial: "Personagem Especial",
    personagem_especial_educativo: "Especial Educativo",
    personagem_vila: "Vila Pig",
    personagem_regional: "Brasil na Vila Pig",
    personagem_educativo: "Educação na Vila Pig",
    familia_principal: "Família Pig",
    familia_estendida: "Família Pig",
  };

  const typeLabels = {
    mascote_principal: "Mascote",
    avatar_usuario: "Avatar do usuário",
    personagem_especial: "Especial",
    personagem_especial_educativo: "Especial educativo",
    personagem_vila: "Vila Pig",
    personagem_regional: "Personagem regional",
    personagem_educativo: "Personagem educativo",
  };

  const state = {
    cards: [],
    cardKeys: new Set(),
    quickFilter: "todos",
    page: 1,
    search: "",
    fields: {},
    lookups: {},
    manifest: null,
    loadedLots: 0,
    loadedProfiles: 0,
    failedLots: 0,
    loadingComplete: false,
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

  function humanize(value) {
    return String(value || "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function categoryFor(person) {
    return (
      categoryLabels[person.tipo_personagem] ||
      categoryLabels[person.tipo] ||
      person.categoria ||
      "Vila Pig"
    );
  }

  function displayName(person) {
    return person.nome_exibicao || person.nome;
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
      return "No dinheiro real, ele só ensina. No PigCoin, ele entra no jogo.";
    }
    if (person.tipo_personagem === "avatar_usuario") {
      return "Aprender acompanha todas as fases da vida.";
    }
    if (person.tipo_personagem === "mascote_principal") {
      return "O Pig acompanha cada pequena conquista.";
    }
    return "Uma história da Vila Pig para aprender com carinho.";
  }

  function versionedAsset(assetPath) {
    if (!assetPath || assetPath.includes("?")) return assetPath;
    return assetPath + "?v=" + assetVersion;
  }

  function lookup(group, key, fallback = "") {
    return state.lookups[group]?.get(key) || fallback || key || "";
  }

  function professionIds(person) {
    return [
      ...(person.profissoes || []),
      person.profissao,
      person.profissao_atual,
    ].filter(Boolean);
  }

  function tagsFor(model) {
    const { person, style, status } = model;
    const type = person.tipo_personagem;
    const tags = ["todos", status === "criada" ? "criado" : "pendente"];
    if (type === "mascote_principal") tags.push("mascote");
    if (type === "avatar_usuario") tags.push("avatar");
    if (["personagem_especial", "personagem_especial_educativo"].includes(type)) tags.push("especial");
    if (["personagem_vila", "personagem_regional", "personagem_educativo"].includes(type)) tags.push("vila");
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
    model.searchKey = searchText(model);
    return model;
  }

  function modelsFromPerson(person) {
    if (person.tipo_personagem !== "avatar_usuario") return [createModel(person)];
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
      ...professionIds(person).slice(0, 1).map((id) => lookup("professions", id)),
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
    const created = status === "criada" && image;
    const name = displayName(person);
    const title = style ? name + " " + styleLabel : name;
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
      "<div><dt>Região</dt><dd>" +
      escapeHtml(locationLabel(person)) +
      "</dd></div>" +
      "<div><dt>Código</dt><dd>" +
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
        displayName(person),
        person.nome,
        person.nome_completo,
        person.slug,
        person.apelido,
        ...(person.aliases || []),
        person.tipo_personagem,
        person.categoria,
        person.subcategoria,
        person.descricao_curta,
        person.papel,
        person.municipio_ou_territorio,
        style,
        status,
        phaseLabel(person),
        locationLabel(person),
        person.familia_uid ? lookup("families", person.familia_uid) : "",
        ...professionIds(person).map((id) => lookup("professions", id)),
        ...(person.origens_culturais || []),
        ...(person.comunidades || []),
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
    if (field === "publicavel") return String(person.publicavel) === expected;
    if (field === "profissoes") return professionIds(person).includes(expected);
    const value = person[field];
    return Array.isArray(value) ? value.includes(expected) : value === expected;
  }

  function filteredCards() {
    const query = normalize(state.search);
    return state.cards.filter((model) => {
      if (state.quickFilter !== "todos" && !model.tags.includes(state.quickFilter)) return false;
      if (query && !model.searchKey.includes(query)) return false;
      return Object.entries(state.fields).every(([field, expected]) => matchesField(model, field, expected));
    });
  }

  function updateSummary() {
    const created = state.cards.filter((model) => model.status === "criada").length;
    const total = state.manifest?.total_publicavel || state.loadedProfiles;
    const suffix = state.loadingComplete ? "publicados" : "carregados";
    countLabel.textContent = created + " imagens criadas | " + state.loadedProfiles + " de " + total + " perfis " + suffix;
  }

  function updateProgress() {
    if (!state.manifest || !progress) return;
    const totalLots = state.manifest.lotes.length;
    const percentage = totalLots ? Math.round((state.loadedLots / totalLots) * 100) : 0;
    const totalProfiles = state.manifest.total_publicavel;
    const failures = state.failedLots ? " | " + state.failedLots + " lote(s) com falha" : "";
    progressLabel.textContent = state.loadingComplete
      ? "Catálogo carregado: " + state.loadedLots + " lotes e " + state.loadedProfiles + " perfis." + failures
      : "Carregando catálogo: lote " + state.loadedLots + " de " + totalLots + " | " + state.loadedProfiles + " de " + totalProfiles + " perfis.";
    progressBar.style.width = percentage + "%";
    progress.classList.toggle("is-complete", state.loadingComplete);
  }

  function renderCollection() {
    const matches = filteredCards();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    state.page = Math.min(Math.max(state.page, 1), totalPages);
    const start = (state.page - 1) * pageSize;
    const visible = matches.slice(start, start + pageSize);
    gallery.innerHTML = visible.map(makeCard).join("");

    if (!matches.length) {
      statusLabel.textContent = state.loadingComplete
        ? "Nenhum card corresponde aos filtros atuais."
        : "Nenhum card carregado corresponde aos filtros atuais. O catálogo ainda está chegando.";
    } else {
      const loadingText = state.loadingComplete ? "" : " enquanto os demais lotes carregam";
      statusLabel.textContent =
        "Exibindo " + (start + 1) + " a " + (start + visible.length) + " de " + matches.length + " cards filtrados" + loadingText + ".";
    }

    pagination.hidden = totalPages <= 1;
    pageLabel.textContent = "Página " + state.page + " de " + totalPages;
    pagination.querySelector('[data-page-action="previous"]').disabled = state.page <= 1;
    pagination.querySelector('[data-page-action="next"]').disabled = state.page >= totalPages;
    updateSummary();
    updateProgress();
  }

  function addOptions(select, entries) {
    if (!select) return;
    const currentValues = new Set([...select.options].map((option) => option.value));
    for (const [value, label] of entries) {
      if (!value || currentValues.has(value)) continue;
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
      currentValues.add(value);
    }
  }

  function sortedFacet(values, labelFor) {
    return [...new Set(values || [])]
      .filter(Boolean)
      .map((value) => [value, labelFor(value)])
      .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }

  function populateFilters(catalogs, manifest) {
    const selects = Object.fromEntries(
      [...advancedFilters.querySelectorAll("select[data-filter-field]")].map((select) => [select.dataset.filterField, select])
    );
    const facets = manifest.facetas || {};
    addOptions(selects.tipo_personagem, sortedFacet(facets.tipos, (value) => typeLabels[value] || humanize(value)));
    addOptions(selects.regiao, sortedFacet(facets.regioes, (value) => lookup("regions", value)));
    addOptions(selects.uf, sortedFacet(facets.ufs, (value) => value + " - " + lookup("states", value)));
    addOptions(
      selects.familia_uid,
      sortedFacet(facets.familias, (value) => lookup("families", value) + " (" + value + ")")
    );
    addOptions(selects.profissoes, sortedFacet(facets.profissoes, (value) => lookup("professions", value)));
    addOptions(selects.geracao, sortedFacet(facets.geracoes, (value) => lookup("generations", value)));
    addOptions(selects.fase_vida, sortedFacet(facets.fases_vida, (value) => lookup("phases", value)));
    addOptions(selects.estilo, Object.entries(styleLabels));
    addOptions(selects.folclore, sortedFacet(facets.folclore, (value) => lookup("folklore", value)));
    addOptions(selects.origens_culturais, sortedFacet(facets.origens_culturais, humanize));
    addOptions(selects.comunidades, sortedFacet(facets.comunidades, humanize));
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

  function appendPeople(people) {
    for (const person of people) {
      for (const model of modelsFromPerson(person)) {
        const key = person.uid + ":" + (model.style || "principal");
        if (state.cardKeys.has(key)) continue;
        state.cardKeys.add(key);
        state.cards.push(model);
      }
    }
    state.loadedProfiles += people.length;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(url + " indisponível");
    return response.json();
  }

  async function fetchLot(lot) {
    try {
      const data = await fetchJson(lot.arquivo);
      return { records: data.registros || [], error: null };
    } catch (error) {
      console.error(error);
      return { records: [], error };
    }
  }

  async function loadLotBatch(lots) {
    const results = await Promise.all(lots.map(fetchLot));
    for (const result of results) {
      state.loadedLots += 1;
      if (result.error) {
        state.failedLots += 1;
        continue;
      }
      appendPeople(result.records);
    }
    renderCollection();
  }

  async function loadRemainingLots(lots) {
    for (let index = 0; index < lots.length; index += batchSize) {
      await loadLotBatch(lots.slice(index, index + batchSize));
    }
    state.loadingComplete = true;
    renderCollection();
  }

  async function loadCollection() {
    if (!gallery) return;

    try {
      const [manifest, regions, states, families, professions, generations, phases, folklore] = await Promise.all([
        fetchJson("data/personagens-publicos/manifest.json"),
        fetchJson("data/regioes-brasil.json"),
        fetchJson("data/ufs-brasil.json"),
        fetchJson("data/familias-catalogo.json"),
        fetchJson("data/profissoes.json"),
        fetchJson("data/geracoes.json"),
        fetchJson("data/fases-vida.json"),
        fetchJson("data/folclore-brasileiro.json"),
      ]);
      const catalogs = { regions, states, families, professions, generations, phases, folklore };
      state.manifest = manifest;
      buildLookups(catalogs);
      populateFilters(catalogs, manifest);

      if (!manifest.lotes?.length) throw new Error("Manifesto público sem lotes");
      await loadLotBatch(manifest.lotes.slice(0, 1));
      void loadRemainingLots(manifest.lotes.slice(1));
    } catch (error) {
      gallery.innerHTML = "";
      statusLabel.textContent =
        "Não foi possível carregar a coleção. Abra por um servidor local para ler os dados estáticos.";
      if (progressLabel) progressLabel.textContent = "Falha ao carregar o catálogo público.";
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
