/* JustiPenal — catálogo profesional para especialidades fiscales. Sin formularios ni persistencia. */
(function () {
  "use strict";

  const CONTACT_EMAIL = "contacto@andesnova.solutions";
  const SUBJECT = "Consulta sobre herramientas avanzadas para JustiPenal";
  const BODY = `Hola.

Deseo recibir información sobre las herramientas profesionales disponibles para JustiPenal.

Me interesa conocer:

☐ IA local
☐ Gestión documental
☐ Generación automática de documentos
☐ Jurisprudencia
☐ Seguimiento de casos
☐ Búsqueda documental
☐ Automatización
☐ Otra solución

Nombre:

Institución:

Correo de contacto:

Comentario:`;

  const CAPABILITIES = [
    { icon:"🧠", title:"Asistente jurídico local con IA", items:["Análisis avanzado de casos", "Procesamiento completamente local, si así se configura", "Resúmenes técnicos y líneas de investigación"] },
    { icon:"📄", title:"Generación inteligente de documentos", items:["Disposiciones, requerimientos y providencias", "Informes, oficios y plantillas personalizadas"] },
    { icon:"⚖️", title:"Consulta normativa avanzada", items:["Código Penal, CPP, leyes especiales y reglamentos", "Comparación de versiones históricas"] },
    { icon:"📚", title:"Jurisprudencia y doctrina", items:["Jurisprudencia peruana y fuentes internacionales seleccionadas", "Búsqueda organizada y comparación de criterios"] },
    { icon:"📊", title:"Gestión y seguimiento de casos", items:["Organización de expedientes y alertas de plazos", "Paneles, indicadores y estadísticas"] },
    { icon:"🔍", title:"Búsqueda documental inteligente", items:["PDF, Word, Excel y escaneo OCR", "Búsqueda por conceptos"] },
    { icon:"🤖", title:"Automatización mediante IA", items:["Clasificación y extracción documental", "Resúmenes e identificación de riesgos"] },
    { icon:"💻", title:"Implementación local", items:["Computadoras institucionales o privadas", "Operación sin conexión permanente", "Datos bajo control del usuario en instalaciones locales"] }
  ];

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
  window.JUSTIPENAL_PROFESSIONAL_CAPABILITIES = { CONTACT_EMAIL, SUBJECT, BODY, CAPABILITIES, mailto };
  if (typeof document === "undefined") return;

  const popover = document.querySelector("#professional-capabilities-popover");
  const catalog = document.querySelector("#capabilities-catalog");
  const context = document.querySelector("#capabilities-context");
  const closeButton = document.querySelector("#capabilities-close");
  const mailButton = document.querySelector("#capabilities-mailto");
  const triggers = [...document.querySelectorAll(".fiscal-specialty")];
  if (!popover || !catalog || !context || !closeButton || !mailButton || !triggers.length) return;

  const escapeHTML = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
  catalog.innerHTML = CAPABILITIES.map((capability) => `<article class="capability-item"><span class="capability-icon" aria-hidden="true">${capability.icon}</span><div><h3>${escapeHTML(capability.title)}</h3><ul>${capability.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div></article>`).join("");
  mailButton.href = mailto;

  let activeTrigger = null;
  let closeTimer = null;
  let keyboardNavigation = false;
  const desktopQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.addEventListener("keydown", () => { keyboardNavigation = true; }, true);
  document.addEventListener("pointerdown", () => { keyboardNavigation = false; }, true);

  function positionPopover(trigger) {
    if (!desktopQuery.matches) { popover.style.removeProperty("left"); popover.style.removeProperty("top"); return; }
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(560, window.innerWidth - 32);
    popover.style.width = `${width}px`;
    const left = Math.min(window.innerWidth - width - 16, Math.max(16, rect.left + rect.width / 2 - width / 2));
    popover.style.left = `${left}px`;
    const panelHeight = Math.min(popover.scrollHeight, window.innerHeight - 96);
    const below = rect.bottom + 10;
    const above = rect.top - panelHeight - 10;
    const top = below + panelHeight <= window.innerHeight - 16 ? below : Math.max(76, above);
    popover.style.top = `${Math.min(top, window.innerHeight - panelHeight - 16)}px`;
  }

  function openPopover(trigger, focusPanel = false) {
    window.clearTimeout(closeTimer);
    if (activeTrigger && activeTrigger !== trigger) activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger = trigger;
    context.textContent = `Especialidad seleccionada: ${trigger.dataset.fiscalSpecialty}`;
    trigger.setAttribute("aria-expanded", "true");
    popover.hidden = false;
    positionPopover(trigger);
    requestAnimationFrame(() => popover.classList.add("open"));
    if (focusPanel) closeButton.focus({ preventScroll:true });
  }

  function closePopover(returnFocus = false) {
    window.clearTimeout(closeTimer);
    popover.classList.remove("open");
    if (activeTrigger) activeTrigger.setAttribute("aria-expanded", "false");
    const trigger = activeTrigger;
    activeTrigger = null;
    window.setTimeout(() => { if (!popover.classList.contains("open")) popover.hidden = true; }, 150);
    if (returnFocus && trigger) trigger.focus();
  }

  function scheduleClose() {
    if (!desktopQuery.matches) return;
    closeTimer = window.setTimeout(() => {
      if (!popover.matches(":hover") && activeTrigger && !activeTrigger.matches(":hover") && !popover.contains(document.activeElement) && document.activeElement !== activeTrigger) closePopover();
    }, 180);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => { if (desktopQuery.matches) openPopover(trigger); });
    trigger.addEventListener("mouseleave", scheduleClose);
    trigger.addEventListener("focus", () => { if (desktopQuery.matches && keyboardNavigation) openPopover(trigger); });
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (activeTrigger === trigger && !popover.hidden) closePopover(); else openPopover(trigger, !desktopQuery.matches);
    });
  });
  popover.addEventListener("mouseenter", () => window.clearTimeout(closeTimer));
  popover.addEventListener("mouseleave", scheduleClose);
  closeButton.addEventListener("click", () => closePopover(true));
  document.addEventListener("pointerdown", (event) => {
    if (!popover.hidden && !popover.contains(event.target) && !event.target.closest(".fiscal-specialty")) closePopover();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !popover.hidden) closePopover(true); });
  window.addEventListener("resize", () => { if (activeTrigger) positionPopover(activeTrigger); });
  document.addEventListener("justipenal:pagechange", (event) => { if (event.detail !== "fiscalias" && !popover.hidden) closePopover(); });
})();
