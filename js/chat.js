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
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const config = window.JUSTIPENAL_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const configured = /^https:\/\//.test(apiBaseUrl) && !/YOUR-JUSTIPENAL-API/i.test(apiBaseUrl);
  const quickQuestions = [
    "¿Cuál es la diferencia entre hurto y robo?",
    "¿Qué significa el sistema de tercios?",
    "¿Cuánto dura la investigación preparatoria ordinaria?",
    "¿Qué función cumple una fiscalía superior?",
    "¿Por qué la tentativa no se calcula automáticamente?"
  ];
  let history = [];
  let pendingPortalContext = { type: "none", data: {} };
  let lastFocused = null;
  let busy = false;

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
    errorEl.textContent = message;
    errorEl.hidden = false;
    fallbackEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
    fallbackEl.hidden = true;
  }

  function setBusy(value) {
    busy = value;
    sendButton.disabled = value || !configured;
    input.disabled = value || !configured;
    loading.hidden = !value;
    launcher.classList.toggle("is-thinking", value);
    panel.setAttribute("aria-busy", String(value));
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
      panel.classList.remove("open", "minimized");
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
      if (!response.ok) throw new Error(data.error || "No fue posible completar la consulta.");
      addMessage("assistant", data.reply, Array.isArray(data.sources) ? data.sources : []);
      successReaction();
      history.push({ role: "user", content: message }, { role: "assistant", content: data.reply });
      history = history.slice(-10);
    } catch (error) {
      showError(error.message || "El asistente no está disponible. Las demás herramientas continúan funcionando localmente.");
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  launcher.addEventListener("click", handleLauncherClick);
  el("chat-close").addEventListener("click", closePanel);
  el("chat-minimize").addEventListener("click", () => {
    panel.classList.toggle("minimized");
    if (panel.classList.contains("minimized")) launcher.focus();
    else input.focus();
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

  for (const question of quickQuestions) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = question;
    button.disabled = !configured;
    button.addEventListener("click", () => submitMessage(question));
    quickEl.appendChild(button);
  }

  try {
    if (!localStorage.getItem("justipenal-chat-pulse-seen")) {
      localStorage.setItem("justipenal-chat-pulse-seen", "1");
      if (!reduceMotion) launcher.classList.add("first-visit-pulse");
    }
  } catch { /* El almacenamiento puede estar bloqueado; el chat sigue funcionando. */ }

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
