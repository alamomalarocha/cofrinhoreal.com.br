const MAX_TOTAL = 6000;
const initialHtml = `<section class="cartao">
  <h1>Meu primeiro projeto</h1>
  <p>Estou aprendendo HTML e CSS no Cofrinho Labs.</p>
  <button type="button">Explorar</button>
</section>`;
const initialCss = `.cartao {
  max-width: 360px;
  padding: 32px;
  border-radius: 24px;
  background-color: #fff4b8;
  color: #18224b;
  text-align: center;
}

button {
  padding: 12px 20px;
  border: 0;
  border-radius: 999px;
  background-color: #635bff;
  color: white;
  font-weight: 700;
}`;

const learningProfiles = {
  fundamentos: {
    label: "Fundamentos",
    summary: "linguagem simples, mais dicas e exemplo guiado",
    explanation: "Vamos explicar cada conceito antes de avançar.",
    html: initialHtml,
    css: initialCss,
  },
  explorador: {
    label: "Explorador",
    summary: "dicas equilibradas, prática e mais autonomia",
    explanation: "Você receberá contexto e poderá testar pequenas variações.",
    html: `<main class="projeto">
  <h1>Missão Explorador</h1>
  <p>Organize este cartão e adapte o botão.</p>
  <button class="acao" type="button">Começar</button>
</main>`,
    css: `.projeto { max-width: 420px; padding: 32px; border-radius: 20px; background-color: #e9f7ff; color: #18224b; }
.acao { padding: 12px 20px; border: 0; border-radius: 12px; background-color: #007c91; color: white; font-weight: 700; }`,
  },
  construtor: {
    label: "Construtor",
    summary: "menos dicas, desafio maior e explicações mais profundas",
    explanation: "As explicações relacionam semântica, manutenção e acessibilidade.",
    html: `<main class="painel" aria-labelledby="titulo-projeto">
  <header>
    <p class="categoria">Projeto da sessão</p>
    <h1 id="titulo-projeto">Painel Construtor</h1>
  </header>
  <button class="acao" type="button">Revisar ideia</button>
</main>`,
    css: `.painel { max-width: 520px; padding: 40px; border: 1px solid #cbd5e1; border-radius: 24px; background-color: #ffffff; color: #172033; }
.categoria { color: #635bff; font-weight: 800; text-transform: uppercase; }
.acao { padding: 12px 22px; border: 0; border-radius: 999px; background-color: #172033; color: white; font-weight: 700; }`,
  },
};

const challenges = [
  {
    topic: "HTML · estrutura",
    title: "O que dá significado à página?",
    description: "HTML organiza títulos, textos, botões e outras partes do conteúdo.",
    question: "Qual linguagem organiza a estrutura de uma página?",
    options: ["CSS", "HTML", "Planilha", "Imagem"],
    answer: "HTML",
    explanation: "HTML descreve a estrutura e o significado do conteúdo. No exemplo, <h1>, <p> e <button> são elementos HTML.",
    contextTitle: "Estrutura antes do visual",
    contextCopy: "HTML descreve o que existe. CSS define como os elementos são apresentados.",
  },
  {
    topic: "CSS · aparência",
    title: "Mude a cor do botão",
    description: "CSS controla cores, espaços, tamanhos e a apresentação visual.",
    question: "Qual propriedade controla a cor de fundo?",
    options: ["font-size", "background-color", "border-radius", "text-align"],
    answer: "background-color",
    explanation: "background-color define a cor de fundo. Ela aparece no bloco button do exemplo ao lado.",
    contextTitle: "Uma propriedade, uma responsabilidade",
    contextCopy: "Procure background-color no CSS e experimente trocar #635bff por outra cor.",
  },
  {
    topic: "CSS · seletores",
    title: "Reutilize estilos com classes",
    description: "Classes permitem aplicar a mesma regra visual a diferentes elementos.",
    question: "Como uma classe chamada cartao é selecionada no CSS?",
    options: ["#cartao", ".cartao", "<cartao>", "cartao()"],
    answer: ".cartao",
    explanation: "No CSS, o ponto identifica uma classe. O seletor .cartao corresponde a class=\"cartao\" no HTML.",
    contextTitle: "Nomes que explicam",
    contextCopy: "Prefira nomes de classe que descrevam o papel do elemento, como cartao, aviso ou botao-principal.",
  },
  {
    topic: "Acessibilidade · controles",
    title: "Construa para mais pessoas",
    description: "Elementos semânticos ajudam teclado, leitores de tela e outros recursos assistivos.",
    question: "Qual elemento é mais adequado para uma ação clicável?",
    options: ["<div>", "<span>", "<button>", "<b>"],
    answer: "<button>",
    explanation: "O elemento <button> já possui semântica de ação e funcionamento por teclado. Um <div> exigiria trabalho extra e é mais fácil de usar incorretamente.",
    contextTitle: "Semântica também é segurança",
    contextCopy: "Use elementos nativos sempre que possível. Eles tornam a interface mais previsível e inclusiva.",
  },
];

const htmlEditor = document.querySelector("[data-html-editor]");
const cssEditor = document.querySelector("[data-css-editor]");
const preview = document.querySelector("[data-labs-preview]");
const editorFeedback = document.querySelector("[data-editor-feedback]");
const editorLimit = document.querySelector("[data-editor-limit]");
let challengeIndex = 0;
let score = 0;
let activeLevel = "fundamentos";
let recommendedLevel = null;
let extraHelp = false;

function sanitizeHtml(source) {
  const documentValue = new DOMParser().parseFromString(source, "text/html");
  documentValue.querySelectorAll("script, form, iframe, object, embed, link, meta, base, style, svg, math, video, audio").forEach((node) => node.remove());
  documentValue.querySelectorAll("*").forEach((element) => {
    for (const attribute of [...element.attributes]) {
      const value = attribute.value.trim();
      if (/^on/iu.test(attribute.name) || ["src", "srcset", "action", "formaction", "target"].includes(attribute.name.toLowerCase())) {
        element.removeAttribute(attribute.name);
      } else if (["href", "xlink:href"].includes(attribute.name.toLowerCase()) && !value.startsWith("#")) {
        element.removeAttribute(attribute.name);
      } else if (/url\s*\(|javascript:|data:|https?:|\/\//iu.test(value)) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  const serializer = new XMLSerializer();
  return [...documentValue.body.childNodes].map((node) => serializer.serializeToString(node)).join("");
}

function sanitizeCss(source) {
  return source
    .replaceAll(/@(?:import|font-face|namespace|supports|document|page|keyframes)[^{;]*(?:;|\{[\s\S]*?\})/giu, "")
    .replaceAll(/url\s*\([^)]*\)/giu, "")
    .replaceAll(/(?:javascript|data|https?):/giu, "")
    .slice(0, 2000);
}

function renderPreview() {
  const html = htmlEditor.value.slice(0, 4000);
  const css = cssEditor.value.slice(0, 2000);
  if (html.length + css.length > MAX_TOTAL) {
    editorFeedback.textContent = "O exemplo ultrapassou o limite educativo de 6.000 caracteres.";
    return;
  }
  const safeHtml = sanitizeHtml(html);
  const safeCss = sanitizeCss(css);
  preview.srcdoc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; form-action 'none'; base-uri 'none'"><style>html{font-family:system-ui,sans-serif;background:#f7f8fd;padding:24px}body{margin:0}${safeCss}</style></head><body>${safeHtml}</body></html>`;
  editorFeedback.textContent = "Preview atualizado localmente. Nenhum dado foi enviado.";
}

function updateEditorLimit() {
  editorLimit.textContent = `${htmlEditor.value.length + cssEditor.value.length} / ${MAX_TOTAL.toLocaleString("pt-BR")} caracteres`;
}

function restoreExample() {
  htmlEditor.value = learningProfiles[activeLevel].html;
  cssEditor.value = learningProfiles[activeLevel].css;
  updateEditorLimit();
  renderPreview();
}

function renderChallenge() {
  const challenge = challenges[challengeIndex];
  const profile = learningProfiles[activeLevel];
  document.querySelector("[data-challenge-counter]").textContent = `Desafio ${challengeIndex + 1} de ${challenges.length}`;
  document.querySelector("[data-session-score]").textContent = `${score} pontos de sessão`;
  document.querySelector("[data-progress-bar]").style.width = `${(challengeIndex / challenges.length) * 100}%`;
  document.querySelector("[data-challenge-topic]").textContent = challenge.topic;
  document.querySelector("[data-challenge-title]").textContent = challenge.title;
  document.querySelector("[data-challenge-description]").textContent = `${challenge.description} ${profile.explanation}`;
  document.querySelector("[data-question-text]").textContent = challenge.question;
  document.querySelector("[data-context-title]").textContent = challenge.contextTitle;
  document.querySelector("[data-context-copy]").textContent = extraHelp ? `${challenge.contextCopy} Dica extra: compare o HTML com o CSS linha por linha.` : challenge.contextCopy;
  document.querySelector("[data-adaptation-status]").textContent = `${profile.label}: ${profile.summary}${extraHelp ? "; ajuda adicional ativada" : ""}.`;
  const options = document.querySelector("[data-question-options]");
  options.replaceChildren();
  challenge.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerChallenge(button, option));
    options.append(button);
  });
  document.querySelector("[data-question-feedback]").textContent = "Escolha uma alternativa para receber uma explicação.";
  document.querySelector("[data-next-challenge]").disabled = true;
  document.querySelector("[data-overview-level]").textContent = profile.label;
  document.querySelector("[data-overview-progress]").textContent = `Desafio ${challengeIndex + 1} de ${challenges.length}`;
  document.querySelector("[data-overview-score]").textContent = `${score} pontos`;
  document.querySelector("[data-overview-challenge]").textContent = challenge.title;
}

function answerChallenge(button, option) {
  const challenge = challenges[challengeIndex];
  const correct = option === challenge.answer;
  document.querySelectorAll("[data-question-options] button").forEach((item) => {
    item.disabled = true;
    item.classList.toggle("is-correct", item.textContent === challenge.answer);
    item.classList.toggle("is-incorrect", item === button && !correct);
  });
  if (correct) score += 10;
  document.querySelector("[data-session-score]").textContent = `${score} pontos de sessão`;
  document.querySelector("[data-overview-score]").textContent = `${score} pontos`;
  document.querySelector("[data-question-feedback]").textContent = `${correct ? "Resposta correta." : `Ainda não. A resposta é ${challenge.answer}.`} ${challenge.explanation} ${learningProfiles[activeLevel].explanation}`;
  document.querySelector("[data-next-challenge]").disabled = false;
  if (correct) document.querySelector("[data-demo-reward]").hidden = false;
}

function setLearningLevel(level, reason) {
  if (!learningProfiles[level]) return;
  activeLevel = level;
  extraHelp = false;
  document.querySelectorAll("[data-labs-level]").forEach((item) => {
    const selected = item.dataset.labsLevel === level;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  restoreExample();
  renderChallenge();
  document.querySelector("[data-adaptation-status]").textContent = `${learningProfiles[level].label}: ${learningProfiles[level].summary}. ${reason}`;
}

document.querySelectorAll("[data-labs-level]").forEach((button) => {
  button.addEventListener("click", () => setLearningLevel(button.dataset.labsLevel, "Nível escolhido por você."));
});

document.querySelector("[data-next-challenge]").addEventListener("click", () => {
  challengeIndex = (challengeIndex + 1) % challenges.length;
  renderChallenge();
});
document.querySelector("[data-too-easy]").addEventListener("click", () => {
  const order = ["fundamentos", "explorador", "construtor"];
  const next = order[Math.min(order.indexOf(activeLevel) + 1, order.length - 1)];
  setLearningLevel(next, next === activeLevel ? "Você já está no nível mais desafiador desta demonstração." : "Dificuldade aumentada a seu pedido.");
});
document.querySelector("[data-too-hard]").addEventListener("click", () => {
  const order = ["fundamentos", "explorador", "construtor"];
  const previous = order[Math.max(order.indexOf(activeLevel) - 1, 0)];
  if (previous === activeLevel) {
    extraHelp = true;
    renderChallenge();
    document.querySelector("[data-adaptation-status]").textContent = "Fundamentos: dificuldade mantida e ajuda adicional ativada.";
  } else {
    setLearningLevel(previous, "Dificuldade reduzida e ajuda ampliada a seu pedido.");
  }
});
document.querySelector("[data-update-preview]").addEventListener("click", renderPreview);
document.querySelector("[data-restore-example]").addEventListener("click", restoreExample);
[htmlEditor, cssEditor].forEach((editor) => editor.addEventListener("input", updateEditorLimit));

const proposalFields = [...document.querySelectorAll("[data-proposal-field]")];
const proposalLabels = {
  problema: "Problema identificado",
  solucao: "Solução proposta",
  beneficiados: "Quem será beneficiado",
  valorEducativo: "Valor educativo",
  esboco: "Esboço ou código",
  cuidados: "Segurança e acessibilidade",
};

function proposalData() {
  return Object.fromEntries(proposalFields.map((field) => [field.dataset.proposalField, field.value.trim()]));
}

function renderProposal() {
  const data = proposalData();
  document.querySelector("[data-proposal-title]").textContent = data.titulo || "Ideia ainda sem título";
  const summary = document.querySelector("[data-proposal-summary]");
  summary.replaceChildren();
  Object.entries(proposalLabels).forEach(([key, label]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = data[key] || "Ainda não preenchido.";
    summary.append(term, description);
  });
}

function proposalText() {
  const data = proposalData();
  return [`Título: ${data.titulo || "Sem título"}`, ...Object.entries(proposalLabels).map(([key, label]) => `${label}: ${data[key] || "Não preenchido"}`), "", "Piloto local — esta proposta ainda não foi enviada para análise."].join("\n");
}

proposalFields.forEach((field) => field.addEventListener("input", renderProposal));
document.querySelector("[data-copy-proposal]").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(proposalText());
    document.querySelector("[data-proposal-feedback]").textContent = "Resumo copiado localmente.";
  } catch {
    document.querySelector("[data-proposal-feedback]").textContent = "O navegador não permitiu copiar. Use o download local.";
  }
});
document.querySelector("[data-download-proposal]").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ schema: "cofrinho-labs-proposta-local-v1", ...proposalData() }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "proposta-cofrinho-labs.json";
  link.click();
  URL.revokeObjectURL(url);
  document.querySelector("[data-proposal-feedback]").textContent = "Rascunho salvo localmente neste dispositivo.";
});
document.querySelector("[data-reset-proposal]").addEventListener("click", () => {
  proposalFields.forEach((field) => { field.value = ""; });
  renderProposal();
  showProposalStep(1);
  document.querySelector("[data-proposal-feedback]").textContent = "Rascunho local reiniciado.";
});

const proposalStepButtons = [...document.querySelectorAll("[data-proposal-step-target]")];
const proposalSteps = [...document.querySelectorAll("[data-proposal-step]")];

function showProposalStep(step) {
  proposalSteps.forEach((panel) => { panel.hidden = panel.dataset.proposalStep !== String(step); });
  proposalStepButtons.forEach((button) => {
    const active = button.dataset.proposalStepTarget === String(step);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const heading = proposalSteps.find((panel) => panel.dataset.proposalStep === String(step))?.querySelector("h2");
  if (heading && document.activeElement?.matches("[data-proposal-next], [data-proposal-step-target]")) {
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }
}

proposalStepButtons.forEach((button) => button.addEventListener("click", () => showProposalStep(button.dataset.proposalStepTarget)));
document.querySelectorAll("[data-proposal-next]").forEach((button) => button.addEventListener("click", () => showProposalStep(button.dataset.proposalNext)));

const diagnosticAnswers = [...document.querySelectorAll("[data-diagnostic-answer]")];
const diagnosticResult = document.querySelector("[data-diagnostic-result]");
const recommendedLevelNode = document.querySelector("[data-recommended-level]");
const recommendationCopy = document.querySelector("[data-recommendation-copy]");
const acceptRecommendation = document.querySelector("[data-accept-recommendation]");
const redoDiagnostic = document.querySelector("[data-redo-diagnostic]");

function runDiagnostic() {
  if (diagnosticAnswers.some((answer) => answer.value === "")) {
    diagnosticResult.dataset.state = "incomplete";
    recommendedLevelNode.textContent = "Complete as cinco respostas";
    recommendationCopy.textContent = "A categoria de proteção simulada é opcional e não participa desta recomendação.";
    acceptRecommendation.disabled = true;
    return;
  }
  const total = diagnosticAnswers.reduce((sum, answer) => sum + Number(answer.value), 0);
  recommendedLevel = total <= 3 ? "fundamentos" : total <= 7 ? "explorador" : "construtor";
  const profile = learningProfiles[recommendedLevel];
  diagnosticResult.dataset.state = "ready";
  recommendedLevelNode.textContent = profile.label;
  recommendationCopy.textContent = `Pelas respostas declaradas e práticas, sugerimos ${profile.label}: ${profile.summary}. A categoria etária fictícia não alterou o resultado.`;
  acceptRecommendation.disabled = false;
  redoDiagnostic.hidden = false;
}

function resetDiagnostic() {
  diagnosticAnswers.forEach((answer) => { answer.value = ""; });
  document.querySelector("[data-demo-protection]").value = "nao-informada";
  recommendedLevel = null;
  diagnosticResult.dataset.state = "empty";
  recommendedLevelNode.textContent = "Responda às perguntas";
  recommendationCopy.textContent = "Usaremos somente suas respostas declaradas e práticas para sugerir o ponto de partida.";
  acceptRecommendation.disabled = true;
  redoDiagnostic.hidden = true;
  diagnosticAnswers[0].focus();
}

document.querySelector("[data-run-diagnostic]").addEventListener("click", runDiagnostic);
redoDiagnostic.addEventListener("click", resetDiagnostic);
acceptRecommendation.addEventListener("click", () => {
  if (!recommendedLevel) return;
  setLearningLevel(recommendedLevel, "Recomendação do diagnóstico aceita; você ainda pode escolher outro nível.");
  showView("aprender", { history: true, focus: true });
});

const views = [...document.querySelectorAll("[data-labs-view]")];
const viewButtons = [...document.querySelectorAll("[data-view-target]")];
const mobileViewSelect = document.querySelector("[data-mobile-view-select]");
const validViews = new Set(views.map((view) => view.dataset.labsView));

function showView(name, options = {}) {
  const target = validViews.has(name) ? name : "visao-geral";
  views.forEach((view) => {
    const active = view.dataset.labsView === target;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  viewButtons.forEach((button) => {
    const active = button.dataset.viewTarget === target;
    button.classList.toggle("is-active", active);
    if (button.closest(".labs-view-nav")) {
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  });
  mobileViewSelect.value = target;
  if (options.history && window.location.hash !== `#${target}`) history.pushState({ labsView: target }, "", `#${target}`);
  if (options.focus) {
    const heading = document.querySelector(`[data-labs-view="${target}"] h1`);
    heading?.focus({ preventScroll: true });
  }
  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

viewButtons.forEach((button) => button.addEventListener("click", () => showView(button.dataset.viewTarget, { history: true, focus: true })));
mobileViewSelect.addEventListener("change", () => showView(mobileViewSelect.value, { history: true, focus: true }));
window.addEventListener("popstate", () => showView(window.location.hash.slice(1), { focus: true, instant: true }));

restoreExample();
renderChallenge();
renderProposal();
showProposalStep(1);
showView(window.location.hash.slice(1), { instant: true });
