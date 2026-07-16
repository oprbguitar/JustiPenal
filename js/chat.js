/* Asistente JustiPenal — interfaz aislada; el historial vive solo en memoria. */
(() => {
  "use strict";

  const el = (id) => document.getElementById(id);
  const launcher = el("chat-launcher");
  const panel = el("chat-panel");
  const messagesEl = el("chat-messages");
  const input = el("chat-input");
  const form = el("chat-form");
  const sendButton = el("chat-send");
  const loading = el("chat-loading");
  const errorEl = el("chat-error");
  const fallbackEl = el("chat-fallback");
  const statusEl = el("chat-status");
  const quickEl = el("chat-quick");
  const contextBanner = el("chat-context-banner");
  const limitCta = el("chat-limit-cta");
  const invitation = el("chat-invitation");
  const expandButton = el("chat-expand");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const config = window.JUSTIPENAL_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const configured = /^https:\/\//.test(apiBaseUrl) && !/YOUR-JUSTIPENAL-API/i.test(apiBaseUrl);
  /* Sugerencias contextuales: cambian según la página activa del portal. */
  const QUICK_DEFAULT = [
    "¿Cuál es la diferencia entre hurto y robo?",
    "¿Qué significa el sistema de tercios?",
    "¿Cuánto dura la investigación preparatoria ordinaria?",
    "¿Qué función cumple una fiscalía superior?",
    "¿Por qué la tentativa no se calcula automáticamente?"
  ];
  const QUICK_BY_PAGE = {
    analizar: [
      "¿Qué es la matriz de tipicidad?",
      "¿Qué diferencia hay entre hipótesis principal y alternativa?",
      "¿Qué significa que un elemento esté «inferido»?",
      "¿Qué es un delito conexo?"
    ],
    delitos: [
      "¿Cuál es la diferencia entre hurto y robo?",
      "¿Qué delitos se persiguen por querella?",
      "¿Qué es la microcomercialización de drogas?",
      "¿Qué significa el sello «pendiente de revisión»?"
    ],
    calculo: [
      "¿Qué es el tercio inferior?",
      "¿Qué es la prohibición de doble valoración?",
      "¿Cómo funciona la terminación anticipada?",
      "¿Por qué no se suman las penas en el concurso de delitos?"
    ],
    teoria: [
      "¿Cuáles son los tres elementos de la teoría del caso?",
      "¿Qué es la legítima defensa?",
      "¿Cuándo prescribe un delito?",
      "¿Puedo evitar el juicio con el principio de oportunidad?"
    ],
    procedimientos: [
      "¿Qué pasa después de la denuncia?",
      "¿Qué es la etapa intermedia?",
      "¿Qué es el proceso inmediato por flagrancia?",
      "¿Quién investiga: la Policía o el fiscal?"
    ],
    plazos: [
      "¿Cuánto dura la investigación preparatoria ordinaria?",
      "¿Qué es una investigación compleja?",
      "¿Desde cuándo se cuenta el plazo de las diligencias preliminares?",
      "¿Qué pasa si el fiscal se excede del plazo?"
    ],
    medidas: [
      "¿Qué requisitos tiene la prisión preventiva?",
      "¿Qué es la comparecencia con restricciones?",
      "¿Qué dice la Casación 626-2013-Moquegua?",
      "¿La prisión preventiva es una condena?"
    ],
    fiscalias: [
      "¿Qué fiscalía investiga la corrupción de funcionarios?",
      "¿Cómo se determina la competencia fiscal?",
      "¿Qué pasa si el investigado es un adolescente?",
      "¿Qué hace una fiscalía superior?"
    ],
    normativa: [
      "¿Qué cambió la Ley 32258?",
      "¿Qué es un acuerdo plenario?",
      "¿Qué norma se aplica si la ley cambió después del hecho?",
      "¿Qué es el Decreto Legislativo 1735?"
    ]
  };
  let currentPage = (location.hash || "").replace("#", "") || "inicio";
  let history = [];
  let pendingPortalContext = { type: "none", data: {} };
  let lastFocused = null;
  let busy = false;
  let rateLimitReset = 0;
  let rateLimitTimer;
  const RATE_LIMIT_RESET_KEY = "justipenal-chat-rate-limit-reset";

  function addMessage(role, text, sources = []) {
    const article = document.createElement("article");
    article.className = `chat-message ${role}`;
    const label = document.createElement("strong");
    label.textContent = role === "user" ? "Usted" : "Asistente JustiPenal";
    const body = document.createElement("p");
    body.textContent = text;
    article.append(label, body);
    if (role === "assistant" && sources.length) {
      const sourceTitle = document.createElement("span");
      sourceTitle.className = "chat-source-title";
      sourceTitle.textContent = "Fuente consultada";
      const list = document.createElement("ul");
      for (const source of sources) {
        try {
          const url = new URL(source.url);
          if (url.protocol !== "https:") continue;
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = url.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = source.name;
          item.appendChild(link);
          list.appendChild(item);
        } catch { /* La fuente no se vuelve enlazable si su URL no es válida. */ }
      }
      if (list.children.length) article.append(sourceTitle, list);
    }
    messagesEl.appendChild(article);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (window.anime && !reduceMotion) {
      anime({ targets: article, translateY: [8, 0], opacity: [0, 1], duration: 320, easing: "easeOutCubic" });
      const links = article.querySelectorAll("a");
      if (links.length) anime({ targets: links, translateX: [-5, 0], opacity: [0, 1], delay: anime.stagger(45), duration: 300, easing: "easeOutQuad" });
    }
  }

  function showError(message) {
    delete errorEl.dataset.rateLimit;
    errorEl.textContent = message;
    errorEl.hidden = false;
    fallbackEl.hidden = false;
    limitCta.hidden = true;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
    fallbackEl.hidden = true;
    limitCta.hidden = true;
  }

  function isRateLimited() {
    return rateLimitReset > Date.now();
  }

  function updateControls() {
    const disabled = busy || !configured || isRateLimited();
    sendButton.disabled = disabled;
    input.disabled = disabled;
    quickEl.querySelectorAll("button").forEach((button) => { button.disabled = disabled; });
  }

  function clearRateLimit() {
    rateLimitReset = 0;
    window.clearTimeout(rateLimitTimer);
    try { localStorage.removeItem(RATE_LIMIT_RESET_KEY); } catch { /* Continuidad visual opcional. */ }
    if (errorEl.dataset.rateLimit === "true") clearError();
    updateControls();
  }

  function activateRateLimit(data = {}, message = "") {
    let reset = Number(data.reset);
    if (reset > 0 && reset < 1e12) reset *= 1000;
    if (!Number.isFinite(reset) || reset <= Date.now()) reset = Date.now() + Math.max(1, Number(data.retryAfter) || 7200) * 1000;
    rateLimitReset = reset;
    try { localStorage.setItem(RATE_LIMIT_RESET_KEY, String(reset)); } catch { /* El servidor sigue siendo el control de seguridad. */ }
    const localReset = new Date(reset).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
    errorEl.dataset.rateLimit = "true";
    errorEl.textContent = `${message || "El límite de uso está activo."} Hora aproximada de restablecimiento: ${localReset}.`;
    errorEl.hidden = false;
    fallbackEl.hidden = false;
    limitCta.hidden = false;
    window.clearTimeout(rateLimitTimer);
    rateLimitTimer = window.setTimeout(clearRateLimit, Math.max(1, reset - Date.now()));
    updateControls();
  }

  function setBusy(value) {
    busy = value;
    loading.hidden = !value;
    launcher.classList.toggle("is-thinking", value);
    panel.setAttribute("aria-busy", String(value));
    updateControls();
  }

  function successReaction() {
    if (!window.anime || reduceMotion) return;
    anime.remove(launcher);
    anime.remove(launcher.querySelector(".chat-avatar"));
    anime({ targets: launcher, scale: [1, 1.11, 1], duration: 520, easing: "easeOutElastic(1, .55)" });
    anime({ targets: launcher.querySelector(".chat-avatar"), rotate: [0, -3, 3, 0], duration: 480, easing: "easeOutQuad" });
  }

  function handleLauncherClick() {
    if (!panel.classList.contains("open") && window.anime && !reduceMotion) {
      const avatar = launcher.querySelector(".chat-avatar");
      anime.remove(avatar);
      anime({ targets: avatar, scale: [1, .9, 1.08, 1], translateY: [0, 2, -3, 0], duration: 520, easing: "easeOutElastic(1, .58)" });
    }
    openPanel();
  }

  function openPanel() {
    lastFocused = document.activeElement;
    panel.classList.add("open");
    panel.classList.remove("minimized");
    invitation.hidden = true;
    launcher.classList.remove("invitation-pulse");
    try { sessionStorage.setItem("justipenal-chat-opened", "1"); } catch { /* Sin seguimiento persistente. */ }
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.classList.add("panel-open");
    if (window.anime && !reduceMotion) {
      anime.remove(panel);
      anime({ targets: panel, opacity: [0, 1], translateY: [12, 0], scale: [.985, 1], duration: 320, easing: "easeOutCubic" });
    }
    requestAnimationFrame(() => (configured ? input : el("chat-close")).focus());
  }

  function closePanel() {
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    (lastFocused && document.contains(lastFocused) ? lastFocused : launcher).focus();
    const finish = () => {
      panel.classList.remove("open", "minimized", "expanded");
      launcher.classList.remove("panel-open");
      panel.style.opacity = "";
      panel.style.transform = "";
    };
    if (window.anime && !reduceMotion && panel.classList.contains("open")) {
      anime.remove(panel);
      anime({ targets: panel, opacity: [1, 0], translateY: [0, 10], scale: [1, .985], duration: 250, easing: "easeInQuad", complete: finish });
    } else finish();
  }

  function attachPortalContext(type) {
    const context = window.getJustiPenalPortalContext?.(type);
    if (!context) return;
    const confirmed = window.confirm("Se enviará únicamente un resumen estructurado y sanitizado del resultado. No se enviará el relato original, nombres, documentos, domicilios ni otros identificadores. ¿Desea continuar?");
    if (!confirmed) return;
    pendingPortalContext = context;
    contextBanner.textContent = "Contexto generado por el motor local de JustiPenal. Se adjuntará a la próxima consulta.";
    contextBanner.hidden = false;
    openPanel();
  }

  async function submitMessage(text) {
    const message = text.trim();
    if (!message || busy || !configured) return;
    clearError();
    addMessage("user", message);
    input.value = "";
    setBusy(true);
    const requestHistory = history.slice(-10);
    const portalContext = pendingPortalContext;
    pendingPortalContext = { type: "none", data: {} };
    contextBanner.hidden = true;

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: requestHistory, portalContext })
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 429) throw Object.assign(new Error(data.error || "Se alcanzó el límite de uso."), { rateLimit: data });
      if (!response.ok) throw new Error(data.error || "No fue posible completar la consulta.");
      addMessage("assistant", data.reply, Array.isArray(data.sources) ? data.sources : []);
      successReaction();
      history.push({ role: "user", content: message }, { role: "assistant", content: data.reply });
      history = history.slice(-10);
    } catch (error) {
      if (error.rateLimit) activateRateLimit(error.rateLimit, error.message);
      else showError(error.message || "El asistente no está disponible. Las demás herramientas continúan funcionando localmente.");
    } finally {
      setBusy(false);
      if (!input.disabled) input.focus();
    }
  }

  launcher.addEventListener("click", handleLauncherClick);
  el("chat-close").addEventListener("click", closePanel);
  el("chat-minimize").addEventListener("click", () => {
    const minimized = panel.classList.toggle("minimized");
    if (minimized) {
      panel.classList.remove("expanded");
      expandButton.setAttribute("aria-label", "Expandir el asistente");
      expandButton.title = "Expandir";
      launcher.focus();
    } else {
      input.focus();
    }
  });
  expandButton.addEventListener("click", () => {
    const expanded = panel.classList.toggle("expanded");
    panel.classList.remove("minimized");
    expandButton.setAttribute("aria-label", expanded ? "Restaurar tamaño del asistente" : "Expandir el asistente");
    expandButton.title = expanded ? "Restaurar" : "Expandir";
    input.focus();
  });
  el("chat-clear").addEventListener("click", () => {
    history = [];
    pendingPortalContext = { type: "none", data: {} };
    messagesEl.replaceChildren();
    contextBanner.hidden = true;
    clearError();
    addMessage("assistant", "Conversación borrada. ¿Qué tema del sistema penal peruano desea consultar?");
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitMessage(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("open")) closePanel();
  });
  document.querySelectorAll("[data-chat-goto]").forEach((button) => button.addEventListener("click", () => {
    window.goPage?.(button.dataset.chatGoto);
    closePanel();
  }));
  el("btn-preguntar-analisis").addEventListener("click", () => attachPortalContext("analysis"));
  el("btn-preguntar-calculo").addEventListener("click", () => attachPortalContext("calculation"));

  function renderQuickQuestions() {
    const questions = QUICK_BY_PAGE[currentPage] || QUICK_DEFAULT;
    quickEl.replaceChildren();
    for (const question of questions) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = question;
      button.disabled = busy || !configured || isRateLimited();
      button.addEventListener("click", () => submitMessage(question));
      quickEl.appendChild(button);
    }
  }
  document.addEventListener("justipenal:pagechange", (event) => {
    currentPage = String(event.detail || "inicio");
    renderQuickQuestions();
  });
  renderQuickQuestions();

  try {
    const storedReset = Number(localStorage.getItem(RATE_LIMIT_RESET_KEY));
    if (storedReset > Date.now()) activateRateLimit({ reset: storedReset }, "El envío permanece pausado en este navegador hasta el restablecimiento indicado por el servidor.");
    else localStorage.removeItem(RATE_LIMIT_RESET_KEY);
  } catch { /* La continuidad visual es opcional; el límite real se aplica en el servidor. */ }

  const invitePhrases = ["Consulta aquí", "Explora un delito", "Pregunta por un plazo", "Revisa una fiscalía", "Analiza una duda"];
  function showInvitation(index) {
    if (panel.classList.contains("open")) return;
    let opened = false, count = 0;
    try { opened = sessionStorage.getItem("justipenal-chat-opened") === "1"; count = Number(sessionStorage.getItem("justipenal-chat-invites") || 0); } catch { /* Sin persistencia. */ }
    if (opened || count >= 2) return;
    invitation.textContent = invitePhrases[index % invitePhrases.length];
    invitation.hidden = false;
    if (!reduceMotion) launcher.classList.add("invitation-pulse");
    try { sessionStorage.setItem("justipenal-chat-invites", String(count + 1)); } catch { /* Sin persistencia. */ }
    window.setTimeout(() => { invitation.hidden = true; launcher.classList.remove("invitation-pulse"); }, 4000);
  }
  if (matchMedia("(max-width: 800px)").matches) {
    window.setTimeout(() => showInvitation(0), 3000);
    window.setTimeout(() => showInvitation(1), 22000);
  }
  function syncVisualViewport() {
    const height = window.visualViewport?.height || window.innerHeight;
    panel.style.setProperty("--chat-visual-height", `${Math.round(height)}px`);
  }
  window.visualViewport?.addEventListener("resize", syncVisualViewport);
  syncVisualViewport();

  if (configured) {
    statusEl.textContent = "● Configurado";
    statusEl.classList.add("ready");
    addMessage("assistant", "Puedo explicar la información legal verificada por JustiPenal. No incluyo ni leo automáticamente el relato del analizador local.");
  } else {
    statusEl.textContent = "● No configurado";
    statusEl.classList.add("offline");
    addMessage("assistant", "El asistente de IA todavía no ha sido configurado. Las demás herramientas de JustiPenal continúan disponibles localmente.");
    showError("Configure la URL pública del backend en js/config.js para habilitar el envío.");
  }
  setBusy(false);
})();
