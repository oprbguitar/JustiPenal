/* JustiPenal — formulario de opinión, sin datos personales */
(() => {
  "use strict";
  const modal = document.querySelector("#feedback-modal");
  const form = document.querySelector("#feedback-form");
  const message = document.querySelector("#feedback-message");
  const counter = document.querySelector("#feedback-counter");
  const status = document.querySelector("#feedback-status");
  const submit = document.querySelector("#feedback-submit");
  const triggers = [...document.querySelectorAll("[data-feedback-open]")];
  const closers = [...document.querySelectorAll("[data-feedback-close]")];
  if (!modal || !form || !message || !triggers.length) return;

  let returnFocus = null;
  let pending = false;
  const focusable = () => [...modal.querySelectorAll("button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([tabindex='-1'])")];

  function sectionContext() {
    const page = document.querySelector(".page.active");
    const id = (page?.id || "page-inicio").replace(/^page-/, "");
    const heading = page?.querySelector("h2, h3")?.textContent?.trim();
    return [id, heading].filter(Boolean).join(" — ").slice(0, 120);
  }

  function open(trigger) {
    returnFocus = trigger;
    status.textContent = "";
    status.classList.remove("success");
    status.replaceChildren();
    modal.hidden = false;
    document.body.classList.add("feedback-open");
    requestAnimationFrame(() => document.querySelector("#feedback-category")?.focus());
  }

  function close() {
    if (pending) return;
    modal.hidden = true;
    document.body.classList.remove("feedback-open");
    returnFocus?.focus();
  }

  function updateCounter() { counter.textContent = `${message.value.length}/500`; }

  triggers.forEach((trigger) => trigger.addEventListener("click", () => open(trigger)));
  closers.forEach((button) => button.addEventListener("click", close));
  message.addEventListener("input", updateCounter);
  modal.addEventListener("mousedown", (event) => { if (event.target === modal) close(); });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    const trimmed = message.value.trim();
    message.value = trimmed;
    updateCounter();
    if (trimmed.length < 3 || trimmed.length > 500) { message.reportValidity(); return; }

    pending = true;
    submit.disabled = true;
    submit.textContent = "Enviando…";
    status.textContent = "";
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.elements.category.value,
          message: trimmed,
          section: sectionContext(),
          pathname: location.pathname.slice(0, 200),
          website: form.elements.website.value
        })
      });
      if (!response.ok) {
        const error = new Error("feedback_failed");
        error.status = response.status;
        throw error;
      }
      form.reset();
      updateCounter();
      const icon = document.createElement("span");
      icon.className = "feedback-success-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "✓";
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = "¡Opinión enviada!";
      const detail = document.createElement("small");
      detail.textContent = "Gracias por ayudarnos a mejorar JustiPenal.";
      copy.append(title, detail);
      status.replaceChildren(icon, copy);
      status.classList.add("success");
    } catch (error) {
      if (error.status === 429) status.textContent = "Ya recibimos varias opiniones desde este dispositivo. Inténtalo mañana.";
      else if (error.status === 400) status.textContent = "Revisa que la sugerencia no incluya datos personales e inténtalo nuevamente.";
      else status.textContent = "No se pudo enviar la opinión en este momento. Inténtalo nuevamente en unos minutos.";
      status.classList.remove("success");
    } finally {
      pending = false;
      submit.disabled = false;
      submit.textContent = "Enviar opinión";
    }
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && !sessionStorage.getItem("justipenal-feedback-shimmer")) {
    sessionStorage.setItem("justipenal-feedback-shimmer", "1");
    const trigger = matchMedia("(max-width: 800px)").matches ? triggers.find((x) => x.classList.contains("feedback-trigger-mobile")) : triggers[0];
    window.setTimeout(() => trigger?.querySelector(".feedback-star")?.classList.add("shimmer"), 700);
  }
})();
