/* JustiPenal — lógica del portal v2 (todo se ejecuta localmente en el navegador) */

// ---------- utilidades ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* Anima la entrada de elementos dinámicos (no interfiere con AOS:
   solo se aplica a nodos recién renderizados, sin data-aos).
   Si anime.js no cargó o el usuario prefiere menos movimiento,
   no hace nada y el contenido se muestra normal. */
const REDUCE_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function animarEntrada(selector, opts = {}) {
  if (!window.anime || REDUCE_MOTION) return;
  const els = typeof selector === "string" ? $$(selector) : selector;
  if (!els.length) return;
  anime.remove(els);
  anime({
    targets: els,
    translateY: [14, 0],
    opacity: [0, 1],
    delay: anime.stagger(opts.stagger || 70),
    duration: opts.duration || 450,
    easing: "easeOutCubic"
  });
}
function pulso(el) {
  if (!window.anime || REDUCE_MOTION || !el) return;
  anime.remove(el);
  anime({ targets: el, scale: [0.97, 1], duration: 300, easing: "easeOutBack" });
}
function animarPagina(page, nav) {
  if (!window.anime || REDUCE_MOTION || !page) return;
  anime.remove(page);
  anime({ targets: page, opacity: [0, 1], translateY: [10, 0], clipPath: ["inset(0 0 8% 0)", "inset(0 0 0% 0)"], duration: 420, easing: "easeOutCubic" });
  const cards = [...page.querySelectorAll(".card")].filter((card) => card.getClientRects().length);
  if (cards.length) {
    anime.remove(cards);
    anime({ targets: cards, opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(45), duration: 380, easing: "easeOutCubic" });
  }
  if (nav) {
    anime.remove(nav);
    anime({ targets: nav, translateX: [-5, 0], duration: 300, easing: "easeOutQuad" });
  }
}
let heroAnimated = false;
function animarHeroUnaVez() {
  if (heroAnimated) return;
  heroAnimated = true;
  const hero = $(".hero");
  hero?.classList.add("animate-hero");
  if (!window.anime || REDUCE_MOTION) return;
  anime({ targets: ".hero-scales path", strokeDashoffset: [anime.setDashoffset, 0], duration: 650, easing: "easeInOutSine" });
}
let statsAnimated = false;
function animarEstadisticasUnaVez() {
  if (statsAnimated || REDUCE_MOTION || !window.anime) return;
  const values = $$("#stats-row b");
  if (!values.length) return;
  statsAnimated = true;
  values.forEach((el) => {
    const match = el.textContent.match(/^(\d+)(.*)$/);
    if (!match) return;
    const end = Number(match[1]), suffix = match[2] || "", state = { value: 0 };
    anime({ targets: state, value: end, round: 1, duration: 650, easing: "easeOutCubic", update: () => { el.textContent = state.value + suffix; } });
  });
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function fmtAnios(v) {
  if (v == null) return "—";
  if (v <= 0.01) return "2 días (mínimo legal genérico, art. 29)";
  const anios = Math.floor(v);
  const meses = Math.round((v - anios) * 12);
  if (anios === 0 && meses > 0) return `${meses} meses`;
  if (meses === 0) return `${anios} ${anios === 1 ? "año" : "años"}`;
  return `${anios} ${anios === 1 ? "año" : "años"} y ${meses} meses`;
}
function selloBadge(id) {
  const s = SELLOS[id] || SELLOS["pendiente"];
  return `<span class="badge ${s.clase}">${s.label}</span>`;
}

// ---------- menú móvil ----------
const sidebar = $("#sidebar"), btnMenu = $("#btn-menu"), overlay = $("#overlay");
function setMenu(open) {
  sidebar.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  btnMenu.setAttribute("aria-expanded", String(open));
  btnMenu.textContent = open ? "✕" : "☰";
  if (open) {
    btnMenu.classList.remove("menu-attention");
    btnMenu.classList.add("menu-seen");
    try { sessionStorage.setItem("justipenal-menu-opened", "1"); } catch { /* Mejora visual opcional. */ }
  }
}
btnMenu.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
overlay.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
if (matchMedia("(max-width: 800px)").matches) {
  let menuOpened = false;
  try { menuOpened = sessionStorage.getItem("justipenal-menu-opened") === "1"; } catch { /* Sin persistencia. */ }
  if (!menuOpened) {
    window.setTimeout(() => { btnMenu.classList.add("menu-attention"); window.setTimeout(() => btnMenu.classList.remove("menu-attention"), 2600); }, 2500);
    window.setTimeout(() => { try { menuOpened = sessionStorage.getItem("justipenal-menu-opened") === "1"; } catch { /* Sin persistencia. */ } if (!menuOpened) { btnMenu.classList.add("menu-attention"); window.setTimeout(() => btnMenu.classList.remove("menu-attention"), 2600); } }, 20000);
  }
}

// ---------- navegación ----------
function goPage(id, options = {}) {
  $$(".page").forEach((p) => p.classList.remove("active"));
  $$(".nav-item").forEach((n) => { n.classList.remove("active"); n.removeAttribute("aria-current"); });
  const page = $("#page-" + id);
  const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
  if (page) page.classList.add("active");
  if (nav) { nav.classList.add("active"); nav.setAttribute("aria-current", "page"); }
  animarPagina(page, nav);
  if (id === "inicio") requestAnimationFrame(() => { animarEstadisticasUnaVez(); animarHeroUnaVez(); });
  setMenu(false);
  window.scrollTo({ top: 0, behavior: REDUCE_MOTION ? "auto" : "smooth" });
  if (page && options.focus !== false) {
    const heading = page.querySelector("h1, h2, h3");
    if (heading) {
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }
  if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
  if (window.AOS && id === "inicio") setTimeout(() => AOS.refresh(), 60);
  document.dispatchEvent(new CustomEvent("justipenal:pagechange", { detail: id }));
  /* Estadística anónima por módulo para esta aplicación de una sola página. */
  if (window.goatcounter && typeof window.goatcounter.count === "function") {
    window.goatcounter.count({ path: "/" + id, title: "JustiPenal — " + id, event: false });
  }
}
$$(".nav-item").forEach((btn) => btn.addEventListener("click", () => goPage(btn.dataset.page)));
$$(".topbar-links a, .footer-links a[data-goto]").forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = a.dataset.goto || a.getAttribute("href").slice(1);
    if ($("#page-" + target)) { e.preventDefault(); goPage(target); }
  })
);
if (location.hash === "#analizar") {
  history.replaceState(null, "", "#guia");
  goPage("guia", { focus: false });
} else if (location.hash && $("#page-" + location.hash.slice(1))) goPage(location.hash.slice(1), { focus: false });

// ---------- inicio ----------
const STATS = [
  { icon: "⚖️", color: "#dbeafe", num: DELITOS.length + "+", label: "Delitos frecuentes catalogados", page: "delitos", aria: "Ver delitos frecuentes catalogados" },
  { icon: "🧭", color: "#f3e8ff", num: GUIA_ETAPAS.length, label: "Conceptos y rutas de consulta", page: "guia", aria: "Ver conceptos y rutas de consulta" },
  { icon: "🏛️", color: "#dcfce7", num: FISCALIAS_UI_ORDER.length, label: "Especialidades fiscales mapeadas", page: "fiscalias", aria: "Ver especialidades fiscales mapeadas" },
  { icon: "🕐", color: "#ffedd5", num: PLAZOS.length + PRISION_PREVENTIVA.length, label: "Plazos procesales de referencia", page: "plazos", aria: "Ver plazos procesales de referencia" },
  { icon: "📖", color: "#dbeafe", num: NORMAS_BASE.length + NORMAS_RECIENTES.length, label: "Normas base y recientes", page: "normativa", aria: "Ver normas base y recientes" }
];
$("#stats-row").innerHTML = STATS.map(
  (s) => `<button class="stat stat-link" type="button" data-page="${s.page}" aria-label="${s.aria}"><span class="bubble" style="background:${s.color}" aria-hidden="true">${s.icon}</span><span class="stat-copy"><b>${s.num}</b><span>${s.label}</span><span class="stat-action" aria-hidden="true">Ver sección →</span></span></button>`
).join("");
$$("#stats-row .stat-link").forEach((button) => button.addEventListener("click", () => goPage(button.dataset.page)));

$("#guide-journey").innerHTML = GUIA_ETAPAS.map((etapa, index) => `<li class="guide-stage"><span class="guide-marker" aria-hidden="true">${index + 1}</span><div><h3>${esc(etapa.titulo)}</h3><p>${esc(etapa.texto)}</p><button class="btn small secondary" type="button" data-guide-destination="${esc(etapa.destino)}">${esc(etapa.accion)}</button></div></li>`).join("");
$("#guide-journey").addEventListener("click", (event) => { const button = event.target.closest("[data-guide-destination]"); if (button) goPage(button.dataset.guideDestination); });

$("#mini-flow").innerHTML = PROCEDIMIENTO.slice(0, 4)
  .map((p) => `<div class="flow-step"><span class="ic">${p.icono}</span><b>${p.nombre}</b></div>`)
  .join('<div class="flow-arrow">→</div>');
$("#mini-fiscalias").innerHTML = FISCALIAS_UI_ORDER.slice(0, 6).map((id) => `<li>${esc(FISCALIAS[id].nombre)}</li>`).join("");
$("#mini-plazos").innerHTML = PLAZOS.slice(0, 5).map((p) => `<li><b>${p.etapa}:</b> ${p.plazo}</li>`).join("");
$("#mini-normas").innerHTML = NORMAS_RECIENTES.map((n) => `<li><b>${n.norma}</b> (${n.publicacion}) — ${n.materia}</li>`).join("");

// ---------- rail de fuentes (escritorio ancho) ----------
$("#rail-fuentes").innerHTML = FUENTES_OFICIALES.map(
  (f) => `<div class="rail-src"><a href="${f.url}" target="_blank" rel="noopener">${f.nombre} ↗</a><p>${f.categoria} — ${f.uso.split(",")[0]}.</p></div>`
).join("");

// ---------- delitos: tabla con buscador ----------
function consecuenciasHTML(m) {
  const items = [];
  if (m.multa) items.push("💰 " + m.multa);
  if (m.inhab) items.push("🚫 " + m.inhab);
  if (m.alternativa) items.push("🔁 " + m.alternativa);
  return items.length ? items.map((i) => `<small style="display:block;color:var(--text-muted)">${i}</small>`).join("") : '<small style="color:var(--text-muted)">—</small>';
}
function penaHTML(m) {
  if (m.penaTexto) return esc(m.penaTexto);
  if (m.perpetua && m.min == null && m.max == null) return '<span class="badge red">Cadena perpetua</span>';
  let s;
  if (m.min == null) s = `No mayor de ${fmtAnios(m.max)}` + (m.minNoExpreso ? ' <small style="color:var(--text-muted)">(sin mínimo expreso)</small>' : "");
  else s = `${fmtAnios(m.min)} a ${fmtAnios(m.max)}`;
  if (m.perpetua) s += ' <span class="badge red">hasta perpetua</span>';
  return s;
}
function renderTablaDelitos(filtro = "") {
  const f = filtro.trim().toLowerCase();
  const rows = [];
  for (const d of DELITOS) {
    for (const m of d.modalidades) {
      const texto = `${d.familia} ${d.nombre} ${d.articulo} ${m.nombre}`.toLowerCase();
      if (f && !texto.includes(f)) continue;
      rows.push(
        `<tr><td><span class="badge">${d.familia}</span></td>
        <td><b>${d.nombre}</b>${m.nota ? `<br><small style="color:var(--text-muted)">${m.nota}</small>` : ""}</td>
        <td><a href="${d.fuente.url}" target="_blank" rel="noopener" title="${esc(d.fuente.norma)}">${d.articulo} ↗</a></td>
        <td>${m.nombre}</td><td>${penaHTML(m)}</td><td>${consecuenciasHTML(m)}</td>
        <td>${selloBadge(d.sello)}<br><small style="color:var(--text-muted)">al ${VERIFICADO_AT}</small></td>
        <td><button class="btn small secondary offense-analysis-open" type="button" data-offense="${esc(d.id)}">Ver ficha jurídica</button></td></tr>`
      );
    }
  }
  $("#tabla-delitos tbody").innerHTML = rows.join("") || '<tr><td colspan="8">Sin resultados para la búsqueda.</td></tr>';
}
renderTablaDelitos();
$("#buscar-delito").addEventListener("input", (e) => renderTablaDelitos(e.target.value));

// ---------- perfil jurídico extendido ----------
const offenseDialog = $("#offense-dialog");
let offenseDialogTrigger = null;
const officialHosts = ["spij.minjus.gob.pe", "diariooficial.elperuano.pe", "busquedas.elperuano.pe", "leyes.congreso.gob.pe", "www2.congreso.gob.pe", "www.tc.gob.pe", "tc.gob.pe", "www.gob.pe", "gob.pe", "www.pj.gob.pe", "pj.gob.pe", "www.sunat.gob.pe", "sunat.gob.pe", "www.sbs.gob.pe", "sbs.gob.pe", "www.defensoria.gob.pe", "defensoria.gob.pe"];
function safeOfficialUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" && officialHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : ""; } catch { return ""; }
}
const analysisList = (items) => `<ul class="analysis-list">${(items?.length ? items : ["Pendiente de revisión oficial"]).map((item) => `<li>${esc(typeof item === "string" ? item : item.texto)}${typeof item === "object" && item.estado ? ` <span class="result-badge">${esc(item.estado)}</span>` : ""}</li>`).join("")}</ul>`;
function renderOffenseAnalysis(delito) {
  const a = delito.analisis;
  const sections = [
    ["estructura", "Estructura del tipo", `<p>${esc(a.resumenTipo)}</p>${analysisList(a.estructura)}`],
    ["sujetos", "Sujetos y contexto", analysisList(a.sujetosContexto)],
    ["resultado", "Resultado y consumación", analysisList(a.resultadoConsumacion)],
    ["pena", "Pena y agravantes", analysisList(a.penasAgravantes)],
    ["fuentes", "Fuentes oficiales", a.fuentes.map((source) => { const url = safeOfficialUrl(source.url); return `<article class="analysis-source"><span class="result-badge">${esc(source.estado)}</span><h4>${esc(source.nombre)} — ${esc(source.articulo)}</h4><p>Revisión normativa: ${esc(source.ultimaVerificacion)}.</p>${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">Consultar fuente oficial ↗</a>` : "<p>Pendiente de enlace oficial válido.</p>"}</article>`; }).join("")]
  ];
  $("#offense-dialog-title").textContent = delito.nombre;
  $("#offense-dialog-meta").textContent = `${delito.familia} · ${delito.articulo} · ${a.estadoPerfil}`;
  $("#offense-tabs").innerHTML = sections.map(([id, label], index) => `<button type="button" role="tab" id="offense-tab-${id}" aria-controls="offense-panel-${id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${esc(label)}</button>`).join("");
  $("#offense-tabpanels").innerHTML = sections.map(([id, , content], index) => `<section role="tabpanel" id="offense-panel-${id}" aria-labelledby="offense-tab-${id}" ${index ? "hidden" : ""}>${content}</section>`).join("");
}
function selectOffenseTab(tab) {
  $$("#offense-tabs [role=tab]").forEach((item) => { const selected = item === tab; item.setAttribute("aria-selected", String(selected)); item.tabIndex = selected ? 0 : -1; $("#" + item.getAttribute("aria-controls")).hidden = !selected; });
}
$("#offense-tabs").addEventListener("click", (event) => { const tab = event.target.closest("[role=tab]"); if (tab) selectOffenseTab(tab); });
$("#offense-tabs").addEventListener("keydown", (event) => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; const tabs = [...$$("#offense-tabs [role=tab]")]; let index = tabs.indexOf(document.activeElement); if (event.key === "Home") index = 0; else if (event.key === "End") index = tabs.length - 1; else index = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; event.preventDefault(); selectOffenseTab(tabs[index]); tabs[index].focus(); });
$("#tabla-delitos tbody").addEventListener("click", (event) => { const button = event.target.closest(".offense-analysis-open"); if (!button) return; const delito = DELITOS.find((item) => item.id === button.dataset.offense); if (!delito) return; offenseDialogTrigger = button; renderOffenseAnalysis(delito); offenseDialog.showModal(); $("#offense-tabs [role=tab]")?.focus(); });
$(".offense-dialog-close").addEventListener("click", () => offenseDialog.close());
offenseDialog.addEventListener("click", (event) => { if (event.target === offenseDialog) offenseDialog.close(); });
offenseDialog.addEventListener("close", () => offenseDialogTrigger?.focus());

// ---------- calculadora: formulario del delito ----------
const familias = [...new Set(DELITOS.map((d) => d.familia))];
$("#sel-familia").innerHTML = familias.map((f) => `<option value="${f}">${f}</option>`).join("");

function fillDelitos() {
  const fam = $("#sel-familia").value;
  const ds = DELITOS.filter((d) => d.familia === fam);
  $("#sel-delito").innerHTML = ds.map((d) => `<option value="${d.id}">${d.nombre} (${d.articulo})</option>`).join("");
  fillModalidades();
}
function fillModalidades() {
  const d = DELITOS.find((x) => x.id === $("#sel-delito").value);
  $("#sel-modalidad").innerHTML = d.modalidades.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
  renderAbstracta();
}
function getSeleccion() {
  const d = DELITOS.find((x) => x.id === $("#sel-delito").value);
  const m = d.modalidades.find((x) => x.id === $("#sel-modalidad").value);
  return { d, m };
}
function organoJudicial(m) {
  if (m.perpetua && m.min == null && m.max == null) return "Juzgado Penal Colegiado (3 jueces)";
  return (m.min || 0) > 6
    ? "Juzgado Penal Colegiado — pena mínima abstracta mayor de 6 años"
    : "Juzgado Penal Unipersonal — pena mínima abstracta de hasta 6 años";
}
function renderAbstracta() {
  const { d, m } = getSeleccion();
  let rango;
  if (m.penaTexto) rango = `<span class="rng" style="font-size:15px">${esc(m.penaTexto)}</span> <small>no contempla pena privativa de libertad</small>`;
  else if (m.perpetua && m.min == null && m.max == null) rango = '<span class="rng">Cadena perpetua</span>';
  else if (m.min == null) rango = `<span class="rng">No mayor de ${fmtAnios(m.max)}</span> <small>sin mínimo expreso en la norma</small>`;
  else rango = `<span class="rng">${fmtAnios(m.min)} a ${fmtAnios(m.max)}</span> <small>de pena privativa de libertad</small>`;
  $("#box-abstracta").innerHTML = `
    <h4 style="color:var(--blue-600);font-size:12px;letter-spacing:.5px">PENA ABSTRACTA DEL DELITO</h4>
    <p style="font-size:13px;margin:4px 0"><b>${d.articulo} — ${d.nombre}</b><br>${m.nombre}</p>
    <div style="margin:8px 0">${rango}</div>
    ${m.alternativa ? `<p style="font-size:12px"><b>Pena alternativa:</b> ${m.alternativa}</p>` : ""}
    ${m.multa ? `<p style="font-size:12px"><b>Multa:</b> ${m.multa}</p>` : ""}
    ${m.inhab ? `<p style="font-size:12px"><b>Inhabilitación:</b> ${m.inhab}</p>` : ""}
    ${m.nota ? `<p style="font-size:12px;color:var(--text-muted)">${m.nota}</p>` : ""}
    <p style="font-size:11.5px;color:var(--text-muted);margin-top:6px">Fuente: <a href="${d.fuente.url}" target="_blank" rel="noopener">${esc(d.fuente.norma)}</a> · ${selloBadge(d.sello)} al ${VERIFICADO_AT}</p>`;
  marcarDobleValoracion();
}
$("#sel-familia").addEventListener("change", fillDelitos);
$("#sel-delito").addEventListener("change", fillModalidades);
$("#sel-modalidad").addEventListener("change", renderAbstracta);

$("#chk-atenuantes").innerHTML = ATENUANTES.map(
  (a, i) => `<label class="check-row"><input type="checkbox" class="at" value="${i}"><span>${a.texto}</span></label>`
).join("");
$("#chk-agravantes").innerHTML = AGRAVANTES.map(
  (a, i) => `<label class="check-row" id="ag-row-${i}"><input type="checkbox" class="ag" value="${i}"><span>${a.texto}</span></label>`
).join("");
$("#chk-reducciones").innerHTML = REDUCCIONES.map(
  (r) => `<label class="check-row"><input type="checkbox" class="red-chk" value="${r.id}"><span><b>${r.nombre}</b> — <small>${r.regla}</small></span></label>`
).join("");
$("#sel-condicion").innerHTML = CONDICIONES_PERSONA.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");

/* Aviso visual de doble valoración en el formulario */
function marcarDobleValoracion() {
  const { m } = getSeleccion();
  AGRAVANTES.forEach((a, i) => {
    const row = $("#ag-row-" + i);
    const conflicto = a.tag && (m.elementos || []).includes(a.tag);
    row.style.opacity = conflicto ? ".55" : "1";
    let warn = row.querySelector(".dv-warn");
    if (conflicto && !warn) {
      warn = document.createElement("small");
      warn.className = "dv-warn";
      warn.style.cssText = "color:var(--amber-600);display:block";
      warn.textContent = "Ya integra la modalidad seleccionada: no se computará (doble valoración).";
      row.querySelector("span").appendChild(warn);
    } else if (!conflicto && warn) warn.remove();
  });
}
fillDelitos();

function setStep(n) { for (let i = 1; i <= 4; i++) $("#st-" + i).classList.toggle("on", i <= n); }
["chk-atenuantes", "chk-agravantes"].forEach((id) => $("#" + id).addEventListener("change", () => setStep(2)));

// ---------- caso multi-delito ----------
let bloques = [];
let ultimoInforme = "";
let ultimoContextoCalculo = null;

window.getJustiPenalPortalContext = (type) => {
  const context = type === "calculation" ? ultimoContextoCalculo : null;
  return context ? JSON.parse(JSON.stringify(context)) : null;
};

function calcularTercioBloque(b) {
  const m = b.m;
  if (m.penaTexto) return { perpetua: false, penaTexto: m.penaTexto };
  if (m.perpetua && m.min == null && m.max == null) return { perpetua: true };
  const minC = m.min == null ? 0 : m.min;
  const span = m.max - minC, t = span / 3;
  const agValidas = b.agravantes.filter((a) => !(a.tag && (m.elementos || []).includes(a.tag)));
  const agExcluidas = b.agravantes.filter((a) => a.tag && (m.elementos || []).includes(a.tag));
  let tercio, tMin, tMax, justif;
  if (agValidas.length > 0 && b.atenuantes.length === 0) {
    tercio = "Superior"; tMin = minC + 2 * t; tMax = m.max; justif = "Solo circunstancias agravantes computables";
  } else if (agValidas.length > 0 && b.atenuantes.length > 0) {
    tercio = "Intermedio"; tMin = minC + t; tMax = minC + 2 * t; justif = "Concurren atenuantes y agravantes";
  } else {
    tercio = "Inferior"; tMin = minC; tMax = minC + t;
    justif = b.atenuantes.length > 0 ? "Solo circunstancias atenuantes" : "Ausencia de atenuantes y agravantes computables";
  }
  return { perpetua: false, tercio, tMin, tMax, justif, agValidas, agExcluidas, minC };
}

function renderBloques() {
  $("#caso-sub").textContent = bloques.length
    ? `${bloques.length} delito(s) en el caso. ${bloques.length > 1 ? "Se evaluarán las reglas de concurso (arts. 48-50)." : ""}`
    : "Aún no ha agregado delitos.";
  $("#lista-bloques").innerHTML = bloques.map((b, i) => {
    const r = calcularTercioBloque(b);
    const rango = r.perpetua ? "Cadena perpetua" : r.penaTexto ? r.penaTexto : `Tercio ${r.tercio}: ${fmtAnios(r.tMin)} a ${fmtAnios(r.tMax)}`;
    return `<div class="case-block">
      <div><b>${i + 1}. ${b.d.nombre}</b> <small>${b.d.articulo} — ${b.m.nombre} · ${b.tentativa ? "Tentativa" : "Consumado"}${b.reincidencia !== "no" ? " · " + (b.reincidencia === "reincidencia" ? "Reincidencia" : "Habitualidad") : ""}</small>
      <small>${rango}</small></div>
      <button class="del" title="Quitar del caso" onclick="quitarBloque(${i})">🗑</button></div>`;
  }).join("");
  $("#btn-calcular").disabled = bloques.length === 0;
}
function quitarBloque(i) { bloques.splice(i, 1); renderBloques(); }
window.quitarBloque = quitarBloque;
window.goPage = goPage;

$("#btn-agregar").addEventListener("click", () => {
  const { d, m } = getSeleccion();
  bloques.push({
    d, m,
    tentativa: $("#sel-consumacion").value === "tentativa",
    reincidencia: $("#sel-reincidencia").value,
    atenuantes: [...$$("#chk-atenuantes input:checked")].map((c) => ATENUANTES[+c.value]),
    agravantes: [...$$("#chk-agravantes input:checked")].map((c) => AGRAVANTES[+c.value])
  });
  $$("#chk-atenuantes input, #chk-agravantes input").forEach((c) => (c.checked = false));
  $("#sel-consumacion").value = "consumado";
  $("#sel-reincidencia").value = "no";
  setStep(3);
  renderBloques();
  const ultimo = $("#lista-bloques").lastElementChild;
  pulso(ultimo);
  if (ultimo) ultimo.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ---------- cálculo del caso ----------
function chip(tipo, texto) {
  const cls = { calc: "calc", judicial: "judicial", nocalc: "nocalc" }[tipo];
  return `<span class="chip ${cls}">${texto}</span>`;
}

$("#btn-calcular").addEventListener("click", () => {
  if (!bloques.length) return;
  setStep(4);
  $("#resultado-wrap").style.display = "block";
  const resultados = bloques.map((b) => ({ b, r: calcularTercioBloque(b) }));

  // ----- paneles por delito -----
  $("#res-delitos").innerHTML = resultados.map(({ b, r }, i) => {
    let cuerpo;
    if (r.perpetua) {
      cuerpo = `<div class="big-range">Cadena perpetua</div>
        <p style="font-size:12.5px;margin-top:4px">${b.m.nota || ""} El sistema de tercios no se aplica a la cadena perpetua. ${chip("judicial", "Valoración judicial")}</p>`;
    } else if (r.penaTexto) {
      cuerpo = `<div class="big-range" style="font-size:18px">${esc(r.penaTexto)}</div>
        <p style="font-size:12.5px;margin-top:4px">${b.m.nota || ""} Este delito no contempla pena privativa de libertad: el sistema de tercios sobre años de pena no resulta aplicable. La individualización corresponde al juez dentro del marco de la pena limitativa o de multa. ${chip("judicial", "Valoración judicial")}</p>`;
    } else {
      const notaMin = b.m.min == null ? `<p style="font-size:11.5px;color:var(--amber-600)">La norma no fija mínimo expreso: se emplea el mínimo legal genérico de la pena privativa de libertad (2 días, art. 29 CP) solo para dividir el marco. ${b.m.alternativa ? "Pena alternativa: " + b.m.alternativa + "." : ""}</p>` : "";
      const exdv = r.agExcluidas.length
        ? `<p style="font-size:11.5px;color:var(--amber-600)">No computadas por prohibición de doble valoración: ${r.agExcluidas.map((a) => a.texto).join("; ")}.</p>` : "";
      const tent = b.tentativa
        ? `<div class="kv"><span>Tentativa (art. 16, Ley 32258)</span><b>${chip("judicial", "Requiere decisión motivada")}</b></div>
           <p style="font-size:11.5px;color:var(--amber-600)">El juez reduce prudencialmente la pena, pudiendo fijarla por debajo del mínimo. El rango mostrado es el previo a esa reducción: la magnitud exacta no es calculable automáticamente.</p>` : "";
      const reinc = b.reincidencia !== "no"
        ? `<div class="kv"><span>${b.reincidencia === "reincidencia" ? "Reincidencia (art. 46-B)" : "Habitualidad (art. 46-C)"}</span><b>${chip("nocalc", "No calculable sin antecedentes verificados")}</b></div>
           <p style="font-size:11.5px;color:var(--amber-600)">Agravante cualificada: permite elevar el marco por encima del máximo legal en la proporción del texto vigente. Exige antecedentes verificables y valoración judicial; no se aplica un incremento numérico automático.</p>` : "";
      const consecuencias = [b.m.multa && "Multa: " + b.m.multa, b.m.inhab && "Inhabilitación: " + b.m.inhab, b.m.alternativa && "Alternativa: " + b.m.alternativa].filter(Boolean);
      cuerpo = `<div class="big-range">${fmtAnios(r.tMin)} a ${fmtAnios(r.tMax)}</div>
        <small style="color:var(--text-muted)">de pena privativa de libertad ${chip("calc", "Calculado (art. 45-A)")}</small>
        <div style="margin-top:8px">
          <div class="kv"><span>Pena abstracta</span><b>${b.m.min == null ? "No mayor de " + fmtAnios(b.m.max) : fmtAnios(b.m.min) + " a " + fmtAnios(b.m.max)}</b></div>
          <div class="kv third-indicator"><span>Tercio aplicado</span><b>${r.tercio}</b></div>
          <div class="kv"><span>Justificación</span><b>${r.justif}</b></div>
          <div class="kv"><span>Atenuantes computadas</span><b>${b.atenuantes.length}</b></div>
          <div class="kv"><span>Agravantes computadas</span><b>${r.agValidas.length}</b></div>
          ${tent}${reinc}
          ${consecuencias.length ? `<div class="kv"><span>Otras consecuencias</span><b style="max-width:60%">${consecuencias.join(" · ")}</b></div>` : ""}
          <div class="kv"><span>Reparación civil</span><b>A determinar en juicio</b></div>
        </div>${notaMin}${exdv}`;
    }
    return `<div class="panel green"><h4>Delito ${i + 1}: ${b.d.nombre} (${b.d.articulo}) — ${b.m.nombre}</h4>${cuerpo}</div>`;
  }).join("");

  // ----- concurso (si hay 2+ delitos) -----
  let concursoHTML = "";
  if (resultados.length > 1) {
    const conPerpetua = resultados.some(({ r }) => r.perpetua);
    const finitos = resultados.filter(({ r }) => !r.perpetua && !r.penaTexto);
    const noPrivativas = resultados.filter(({ r }) => r.penaTexto);
    let grave = null;
    if (finitos.length) grave = finitos.reduce((a, c) => (c.r.tMax > a.r.tMax ? c : a));
    const filas = [];
    if (noPrivativas.length) {
      filas.push(`<div class="kv"><span><small style="color:var(--amber-600)">No incluidos en el cómputo de años por no contemplar pena privativa de libertad: ${noPrivativas.map(({ b }) => b.d.nombre).join("; ")}. Sus penas (multa o limitativas de derechos) se imponen conforme a su propia regla.</small></span><b></b></div>`);
    }
    if (conPerpetua) {
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.real.nombre}</b><br><small style="color:var(--text-muted)">Uno de los delitos contempla cadena perpetua: esta absorbe a las penas temporales.</small></span><b>Cadena perpetua</b></div>`);
    } else if (!grave) {
      filas.push(`<div class="kv"><span><small style="color:var(--text-muted)">Ninguno de los delitos del caso contempla pena privativa de libertad: los escenarios de concurso sobre años de pena no resultan aplicables.</small></span><b></b></div>`);
    } else {
      const sumMin = finitos.reduce((s, { r }) => s + r.tMin, 0);
      const sumMax = finitos.reduce((s, { r }) => s + r.tMax, 0);
      const tope = Math.min(2 * grave.r.tMax, 35);
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.real.nombre}</b><br><small style="color:var(--text-muted)">${CONCURSO_INFO.real.regla}</small></span><b>${fmtAnios(Math.min(sumMin, tope))} a ${fmtAnios(Math.min(sumMax, tope))}${sumMax > tope ? " (tope legal aplicado)" : ""}</b></div>`);
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.ideal.nombre}</b><br><small style="color:var(--text-muted)">${CONCURSO_INFO.ideal.regla}</small></span><b>${fmtAnios(grave.r.tMin)} a ${fmtAnios(Math.min(grave.r.tMax * 1.25, 35))}</b></div>`);
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.continuado.nombre}</b><br><small style="color:var(--text-muted)">${CONCURSO_INFO.continuado.regla}</small></span><b>${fmtAnios(grave.r.tMin)} a ${fmtAnios(grave.r.tMax)}</b></div>`);
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.aparente.nombre}</b><br><small style="color:var(--text-muted)">${CONCURSO_INFO.aparente.regla}</small></span><b>Solo el delito más grave: ${fmtAnios(grave.r.tMin)} a ${fmtAnios(grave.r.tMax)}</b></div>`);
    }
    concursoHTML = `<h4>Escenarios de concurso de delitos ${chip("judicial", "La regla aplicable exige análisis jurídico")}</h4>
      <p style="font-size:12px;margin-bottom:6px">Las penas <b>no se suman mecánicamente</b>: primero debe determinarse qué regla concursal corresponde según los hechos (unidad o pluralidad de acciones, misma resolución criminal, absorción).</p>${filas.join("")}`;
    $("#res-concurso").style.display = "block";
    $("#res-concurso").innerHTML = concursoHTML;
  } else {
    $("#res-concurso").style.display = "none";
  }

  // ----- bonificaciones procesales: escenarios A/B/C -----
  const reds = [...$$("#chk-reducciones input:checked")].map((c) => REDUCCIONES.find((r) => r.id === c.value));
  const baseRef = resultados.length === 1 ? resultados[0] : resultados.filter(({ r }) => !r.perpetua && !r.penaTexto).reduce((a, c) => (!a || c.r.tMax > a.r.tMax ? c : a), null);
  if (reds.length && baseRef && !baseRef.r.perpetua && !baseRef.r.penaTexto) {
    const { r, b } = baseRef;
    const puntos = [
      { label: "Escenario A — si la pena base individualizada fuera el extremo inferior del tercio", v: r.tMin },
      { label: "Escenario B — hipótesis media del tercio (no determinada jurídicamente)", v: (r.tMin + r.tMax) / 2 },
      { label: "Escenario C — si la pena base individualizada fuera el extremo superior del tercio", v: r.tMax }
    ];
    const items = reds.map((rd) => {
      if (rd.sobre === "min") {
        const piso = b.m.min != null ? b.m.min * (1 - rd.factor) : 0;
        return `<div class="kv"><span><b>${rd.nombre}</b><br><small style="color:var(--text-muted)">${rd.regla}</small></span><b>Permite descender hasta ${fmtAnios(piso)}</b></div>`;
      }
      const filas = puntos.map((p) => `<div class="kv"><span style="font-size:12px">${p.label} (${fmtAnios(p.v)})</span><b>≈ ${fmtAnios(p.v * (1 - rd.factor))}</b></div>`).join("");
      return `<div style="margin-bottom:8px"><b style="font-size:13px">${rd.nombre}</b><br><small style="color:var(--text-muted)">${rd.regla}</small>${filas}</div>`;
    });
    $("#res-escenarios").style.display = "block";
    $("#res-escenarios").innerHTML = `<h4>Bonificaciones procesales — escenarios sobre ${resultados.length > 1 ? "el delito más grave" : "el tercio aplicable"} ${chip("judicial", "Sobre la pena concreta que fije el juez")}</h4>
      <p style="font-size:12px;margin-bottom:6px">La reducción se aplica sobre la <b>pena base individualizada por el juez</b>, que este portal no determina. Se muestran tres hipótesis ilustrativas; ninguna es la pena del caso.${resultados.length > 1 ? " En concurso, la bonificación opera sobre la pena concreta final." : ""}</p>
      ${items.join("")}
      <p style="font-size:12px;padding-top:4px">Las bonificaciones no son automáticas: dependen de la oportunidad procesal, la aprobación judicial y las exclusiones legales.</p>`;
  } else {
    $("#res-escenarios").style.display = "none";
  }

  // ----- competencia -----
  const cond = CONDICIONES_PERSONA.find((c) => c.id === $("#sel-condicion").value);
  const territorio = $("#inp-territorio").value.trim();
  const principal = baseRef || resultados[0];
  const fis = FISCALIAS[principal.b.d.fiscalia] || FISCALIAS["penal-comun"];
  const dirUrl = "https://www.gob.pe/busquedas?contenido[]=informes-publicaciones&institucion[]=mpfn&term=" + encodeURIComponent("directorio distrito fiscal " + (territorio || ""));
  $("#res-competencia").innerHTML = `<h4 style="color:var(--navy-800)">Competencia preliminar probable</h4>
    <p style="font-size:13.5px;margin-top:4px"><b>${fis.nombre}</b>${territorio ? ` de la jurisdicción de <b>${esc(territorio)}</b>` : " de la jurisdicción donde ocurrió el hecho"}</p>
    <p style="font-size:12.5px;color:var(--text-muted)">${fis.desc}</p>
    ${principal.b.d.fiscaliaNorma ? `<p style="font-size:12px;color:var(--text-muted)">${principal.b.d.fiscaliaNorma}</p>` : ""}
    <p style="font-size:12px;margin-top:6px"><b>Condición:</b> siempre que no se confirme organización criminal, violencia familiar, condición especial del investigado u otro criterio de especialidad que desplace la competencia.</p>
    ${cond.nota ? `<div class="kv" style="margin-top:6px"><span>Condición del investigado</span><b style="max-width:55%">${cond.label}</b></div><p style="font-size:12px;color:var(--amber-600)">${cond.nota}</p>` : ""}
    <div class="kv" style="margin-top:6px"><span>Órgano de juzgamiento</span><b style="text-align:right">${organoJudicial(principal.b.m)}</b></div>
    <p style="font-size:12px;margin-top:6px"><a href="${dirUrl}" target="_blank" rel="noopener">Buscar el directorio oficial del distrito fiscal ↗</a> · <small style="color:var(--text-muted)">revisión editorial al ${VERIFICADO_AT}; los despachos cambian por resolución de la Fiscalía de la Nación</small></p>`;

  $("#res-plazos").innerHTML = `<h4>Plazos aplicables (regímenes alternativos, referenciales)</h4>
    <div class="kv"><span>Investigación preliminar</span><b>60 días (referencia general)</b></div>
    <div class="kv"><span>Preparatoria ordinaria</span><b>120 días (+60)</b></div>
    <div class="kv"><span>Caso complejo</span><b>8 meses (+8)</b></div>
    <div class="kv"><span>Criminalidad organizada</span><b>36 meses (+36)</b></div>
    <p style="font-size:11.5px;color:var(--text-muted);margin:6px 0">El plazo puede variar conforme al CPP, el control judicial o los regímenes especiales.</p>
    <a href="#plazos" onclick="goPage('plazos');return false" style="font-size:12.5px">Ver calculadora de plazos →</a>`;

  // ----- trazabilidad -----
  const vistos = new Set();
  $("#res-fuentes").innerHTML = resultados.filter(({ b }) => !vistos.has(b.d.id) && vistos.add(b.d.id)).map(({ b }) => `
    <div class="panel" style="padding:12px 14px">
      <p style="font-size:13px"><b>${b.d.nombre} — ${b.d.articulo}</b> ${selloBadge(b.d.sello)}</p>
      <p style="font-size:12px;color:var(--text-muted)">${esc(b.d.fuente.norma)}${b.d.vigenteDesde ? " · " + b.d.vigenteDesde : ""}</p>
      <p style="font-size:12px"><a href="${b.d.fuente.url}" target="_blank" rel="noopener">Ver texto oficial ↗</a> · Revisión editorial: ${VERIFICADO_AT}</p>
    </div>`).join("");

  ultimoInforme = generarInforme(resultados, reds, cond, territorio, fis);
  ultimoContextoCalculo = {
    type: "calculation",
    data: {
      candidateOffenseIds: resultados.map(({ b }) => b.d.id),
      articles: resultados.map(({ b }) => b.d.articulo),
      selectedModality: resultados.map(({ b }) => ({ offenseId: b.d.id, modalityId: b.m.id, name: b.m.nombre })),
      applicableThird: resultados.map(({ b, r }) => ({ offenseId: b.d.id, third: r.perpetua ? "No aplicable: cadena perpetua" : r.penaTexto ? "No aplicable: pena no privativa de libertad" : r.tercio })),
      generalCircumstances: resultados.flatMap(({ b, r }) => [
        ...b.atenuantes.map((item) => item.texto),
        ...(r.agValidas || []).map((item) => item.texto),
        ...(b.reincidencia !== "no" ? [b.reincidencia] : [])
      ]),
      executionStatus: resultados.map(({ b }) => ({ offenseId: b.d.id, status: b.tentativa ? "tentativa" : "consumado" })),
      proceduralStage: "No indicada en la calculadora",
      preliminaryProsecutionSpecialty: fis.nombre,
      missingInformation: ["La pena concreta requiere individualización judicial", "La regla concursal aplicable requiere análisis jurídico cuando existe más de un delito"],
      sources: resultados.map(({ b }) => ({ name: b.d.fuente.norma, url: b.d.fuente.url }))
    }
  };
  $("#resultado-wrap").scrollIntoView({ behavior: "smooth" });
  animarEntrada("#res-delitos .panel, #res-concurso, #res-escenarios, #res-competencia, #res-plazos, #res-fuentes .panel", { stagger: 90 });
  animarEntrada("#resultado-wrap .big-range, #resultado-wrap .third-indicator, #resultado-wrap .penalty-stamp", { stagger: 70, duration: 500 });
});

// ---------- informe descargable ----------
function generarInforme(resultados, reds, cond, territorio, fis) {
  const hoy = new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
  const L = [];
  L.push("# INFORME PRELIMINAR DE ANÁLISIS PENAL REFERENCIAL");
  L.push(`Generado por JustiPenal el ${hoy}. Documento orientador: no es sentencia, dictamen fiscal ni determinación definitiva de pena.`);
  L.push("");
  L.push("## 1. Delitos analizados");
  resultados.forEach(({ b, r }, i) => {
    L.push(`### Delito ${i + 1}: ${b.d.nombre} (${b.d.articulo}) — ${b.m.nombre}`);
    if (r.perpetua) L.push("- Pena: cadena perpetua (no se aplica el sistema de tercios).");
    else if (r.penaTexto) L.push(`- Pena: ${r.penaTexto} (no contempla pena privativa de libertad; el sistema de tercios sobre años no resulta aplicable).`);
    else {
      L.push(`- Pena abstracta: ${b.m.min == null ? "no mayor de " + fmtAnios(b.m.max) : fmtAnios(b.m.min) + " a " + fmtAnios(b.m.max)}.`);
      L.push(`- Tercio aplicado: ${r.tercio} (${r.justif}).`);
      L.push(`- Rango referencial de individualización: ${fmtAnios(r.tMin)} a ${fmtAnios(r.tMax)}.`);
      if (r.agExcluidas.length) L.push(`- No computadas por doble valoración: ${r.agExcluidas.map((a) => a.texto).join("; ")}.`);
    }
    if (b.tentativa) L.push("- Tentativa (art. 16; Ley 32258): reducción prudencial que requiere decisión judicial motivada; no calculada automáticamente.");
    if (b.reincidencia !== "no") L.push(`- ${b.reincidencia === "reincidencia" ? "Reincidencia (art. 46-B)" : "Habitualidad (art. 46-C)"}: agravante cualificada no calculable sin antecedentes verificados.`);
    if (b.m.multa) L.push(`- Multa: ${b.m.multa}`);
    if (b.m.inhab) L.push(`- Inhabilitación: ${b.m.inhab}`);
    if (b.m.alternativa) L.push(`- Pena alternativa: ${b.m.alternativa}`);
    L.push(`- Fuente: ${b.d.fuente.norma} — ${b.d.fuente.url} (verificado al ${VERIFICADO_AT}).`);
    L.push("");
  });
  if (resultados.length > 1) {
    L.push("## 2. Concurso de delitos (escenarios)");
    L.push("La regla aplicable (concurso real, ideal, delito continuado o concurso aparente) exige análisis jurídico; las penas no se suman mecánicamente. Véanse los escenarios del portal.");
    L.push("");
  }
  if (reds.length) {
    L.push("## 3. Bonificaciones procesales seleccionadas");
    reds.forEach((r) => L.push(`- ${r.nombre}: ${r.regla}`));
    L.push("");
  }
  L.push("## 4. Competencia preliminar probable");
  L.push(`${fis.nombre}${territorio ? " — jurisdicción indicada: " + territorio : ""}. Condición: salvo criterio de especialidad, territorio o condición personal que la desplace.${cond && cond.nota ? " Nota: " + cond.nota : ""}`);
  L.push("");
  L.push("## 5. Limitaciones");
  L.push("El resultado constituye una orientación técnico-jurídica preliminar basada en fuentes oficiales públicas. No establece responsabilidad penal, no reemplaza la investigación fiscal ni determina la pena judicial. Verifique la versión vigente de cada norma a la fecha del hecho.");
  return L.join("\n");
}
function descargar(nombre, contenido, mime) {
  const blob = new Blob([contenido], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(a.href);
}
$("#btn-copiar").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(ultimoInforme); $("#btn-copiar").textContent = "✅ Copiado"; setTimeout(() => ($("#btn-copiar").textContent = "📋 Copiar"), 1500); } catch { alert("No se pudo copiar automáticamente."); }
});
$("#btn-txt").addEventListener("click", () => descargar("informe-preliminar-justipenal.txt", ultimoInforme.replace(/^#+ /gm, "").replace(/\*\*/g, ""), "text/plain;charset=utf-8"));
$("#btn-md").addEventListener("click", () => descargar("informe-preliminar-justipenal.md", ultimoInforme, "text/markdown;charset=utf-8"));
$("#btn-doc").addEventListener("click", () => {
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Informe preliminar</title></head><body style="font-family:Calibri,Arial,sans-serif">` +
    ultimoInforme.split("\n").map((l) => {
      if (l.startsWith("### ")) return `<h3>${esc(l.slice(4))}</h3>`;
      if (l.startsWith("## ")) return `<h2>${esc(l.slice(3))}</h2>`;
      if (l.startsWith("# ")) return `<h1 style="font-size:18pt">${esc(l.slice(2))}</h1>`;
      if (l.startsWith("- ")) return `<p style="margin:2pt 0 2pt 18pt">• ${esc(l.slice(2))}</p>`;
      return l.trim() ? `<p>${esc(l)}</p>` : "";
    }).join("") + "</body></html>";
  descargar("informe-preliminar-justipenal.doc", "﻿" + html, "application/msword");
});
$("#btn-print").addEventListener("click", () => window.print());

// ---------- procedimiento ----------
$("#flow-completo").innerHTML = PROCEDIMIENTO.map(
  (p) => `<div class="flow-step"><span class="ic">${p.icono}</span><b>${p.nombre}</b><span style="font-size:11.5px;color:var(--text-muted)">${p.desc}</span></div>`
).join('<div class="flow-arrow">→</div>');

// ---------- plazos ----------
$("#tabla-plazos").innerHTML = PLAZOS.map(
  (p) => `<tr><td><b>${p.etapa}</b></td><td><span class="badge">${p.plazo}</span></td><td><small>${p.base}</small></td><td>${p.prorroga}</td></tr>`
).join("");
$("#tabla-pp").innerHTML = PRISION_PREVENTIVA.map(
  (p) => `<tr><td>${p.tipo}</td><td><span class="badge amber">${p.plazo}</span></td></tr>`
).join("");
$("#sel-plazo-acto").innerHTML = ACTOS_INICIO.map((a) => `<option value="${a.id}">${a.label}</option>`).join("");
$("#inp-fecha-inicio").valueAsDate = new Date();

$("#btn-plazo").addEventListener("click", () => {
  const tipo = PLAZOS[+$("#sel-plazo-tipo").value];
  const acto = ACTOS_INICIO.find((a) => a.id === $("#sel-plazo-acto").value);
  const inicioStr = $("#inp-fecha-inicio").value;
  const notifStr = $("#inp-fecha-notif").value;
  const conProrroga = $("#chk-prorroga").checked;
  const detenido = $("#chk-detenido-plazo").checked;
  const panel = $("#res-plazo-panel");
  if (!inicioStr) {
    panel.innerHTML = '<div class="panel amber"><h4>Falta información</h4><p style="font-size:13px">Indique la fecha del acto procesal para calcular el vencimiento.</p></div>';
    return;
  }
  const baseStr = notifStr || inicioStr;
  const inicio = new Date(baseStr + "T00:00:00");
  const venc = new Date(inicio);
  if (tipo.dias) venc.setDate(venc.getDate() + tipo.dias);
  if (tipo.meses) venc.setMonth(venc.getMonth() + tipo.meses);
  if (conProrroga && tipo.prorrogaDias) venc.setDate(venc.getDate() + tipo.prorrogaDias);
  if (conProrroga && tipo.prorrogaMeses) venc.setMonth(venc.getMonth() + tipo.prorrogaMeses);

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const msDia = 86400000;
  const transcurridos = Math.max(0, Math.floor((hoy - inicio) / msDia));
  const restantes = Math.floor((venc - hoy) / msDia);
  const fmt = (dt) => dt.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });

  const faltante = [];
  if (!notifStr) faltante.push("fecha de notificación (el cómputo se hizo desde la fecha del acto)");
  if (detenido) faltante.push("con persona detenida el plazo preliminar se reduce y rige el control de la detención: verifique el plazo específico");
  let certeza = "Alta", certezaCls = "green";
  if (!notifStr) { certeza = "Media"; certezaCls = "amber"; }
  if (detenido || acto.id === "denuncia") { certeza = "Baja"; certezaCls = "red"; }

  panel.innerHTML = `
    <div class="panel green"><h4>Vencimiento estimado</h4>
      <div class="big-range" style="font-size:22px">${fmt(venc)}</div>
      <div style="margin-top:8px">
        <div class="kv"><span>Acto procesal</span><b style="max-width:55%">${acto.label}</b></div>
        <div class="kv"><span>Régimen</span><b>${tipo.etapa}</b></div>
        <div class="kv"><span>Plazo base</span><b>${tipo.plazo}${conProrroga ? " + prórroga" : ""} (días naturales)</b></div>
        <div class="kv"><span>Base normativa</span><b>${tipo.base}</b></div>
        <div class="kv"><span>Cómputo desde</span><b>${fmt(inicio)}${notifStr ? " (notificación)" : " (fecha del acto)"}</b></div>
        <div class="kv"><span>Días transcurridos</span><b>${transcurridos}</b></div>
        <div class="kv"><span>Días restantes</span><b style="color:${restantes < 0 ? "var(--red-600)" : restantes < 15 ? "var(--amber-600)" : "var(--green-600)"}">${restantes < 0 ? "Plazo vencido hace " + Math.abs(restantes) + " días" : restantes}</b></div>
        <div class="kv"><span>Nivel de certeza</span><b><span class="badge ${certezaCls}">${certeza}</span></b></div>
      </div>
    </div>
    ${faltante.length ? `<div class="panel amber" style="font-size:12px"><h4>Información faltante</h4><ul class="list-check">${faltante.map((f) => `<li>${f}</li>`).join("")}</ul></div>` : ""}
    <div class="panel" style="font-size:12px"><h4 style="color:var(--navy-800)">Advertencia</h4>
      El cómputo real puede variar por suspensión, ampliación, declaración de complejidad, conversión a criminalidad organizada, nulidades, acumulación o disposiciones que fijen un plazo distinto. El control de plazo puede solicitarse judicialmente.</div>`;
  animarEntrada("#res-plazo-panel .panel", { stagger: 100 });
});

// ---------- teoría del caso ----------
const theoryRoot = $("#page-teoria");

function theoryIcon(id) {
  const paths = {
    tesis: '<circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>',
    factico: '<path d="M6 3h9l3 3v15H6z"></path><path d="M15 3v4h4M9 11h6M9 15h6"></path>',
    juridico: '<path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6zM17 6l-4 7h8l-4-7zM8 21h8"></path>',
    probatorio: '<path d="M5 3h9l3 3v6M14 3v4h4"></path><circle cx="15.5" cy="15.5" r="4.5"></circle><path d="m19 19 3 3"></path>',
    alternativa: '<path d="M12 21V9M12 9 7 4M12 9l5-5M7 4H3v4M17 4h4v4"></path>',
    estandar: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3z"></path><path d="m9 12 2 2 4-5"></path>',
    default: '<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8M12 8v8"></path>'
  };
  return `<svg class="theory-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[id] || paths.default}</svg>`;
}

function theoryMatrix(tab) {
  return `<div class="theory-matrix-wrap"><table class="theory-matrix">
    <thead><tr><th scope="col">Proposición fáctica</th><th scope="col">Elemento jurídico relacionado</th><th scope="col">Sustento disponible</th><th scope="col">Estado del análisis</th></tr></thead>
    <tbody>${tab.matrix.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>
  <div class="theory-matrix-cards">${tab.matrix.map((row) => `<article>${row.map((cell, index) => `<div><strong>${["Proposición", "Elemento jurídico", "Sustento", "Estado"][index]}</strong><span>${esc(cell)}</span></div>`).join("")}</article>`).join("")}</div>`;
}

function theoryTabBody(tab) {
  let content = "";
  if (tab.items) {
    content = `<div class="theory-thesis-grid">${tab.items.map(([label, text], index) => `<div><span>${index + 1}</span><p><strong>${esc(label)}</strong>${esc(text)}</p></div>`).join("")}</div>
      <aside class="theory-model"><strong>Modelo didáctico de tesis</strong><p>${esc(tab.model)}</p></aside>`;
  } else if (tab.matrix) {
    content = theoryMatrix(tab);
  } else if (tab.sequence) {
    content = `<div class="theory-proof-flow">${tab.sequence.map((step, index) => `<div><span>${index + 1}</span><strong>${esc(step)}</strong></div>`).join("")}</div>
      <div class="theory-criteria">${tab.criteria.map(([term, text]) => `<article><h4>${esc(term)}<span class="theory-info" title="${esc(text)}" aria-label="${esc(text)}">i</span></h4><p>${esc(text)}</p></article>`).join("")}</div>`;
  } else if (tab.comparison) {
    content = `<div class="theory-rival-grid">${tab.comparison.map(([label, text]) => `<article><h4>${esc(label)}</h4><p>${esc(text)}</p></article>`).join("")}</div>`;
  } else if (tab.checks) {
    content = `<ol class="theory-legal-checks">${tab.checks.map((check) => `<li>${esc(check)}</li>`).join("")}</ol>`;
  } else if (tab.summary) {
    content = `<div class="theory-result-list">${tab.summary.map(([label, text]) => `<article><h4>${esc(label)}</h4><p>${esc(text)}</p></article>`).join("")}</div>`;
  }
  return `<div class="theory-panel-heading"><h3>${esc(tab.title)}</h3><p>${esc(tab.intro)}</p></div>${content}`;
}

function activateTheoryTab(button, moveFocus = false) {
  const tabs = [...theoryRoot.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    const selected = tab === button;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    if (panel) panel.hidden = !selected;
  });
  if (moveFocus) button.focus();
}

function renderTheorySection() {
  $("#theory-pillars").innerHTML = TEORIA_PILARES.map((pillar) => `<article class="theory-pillar" tabindex="0">
    ${theoryIcon(pillar.id)}<h3>${esc(pillar.nombre)}</h3><p>${esc(pillar.desc)}</p>
  </article>`).join("");

  $("#theory-tabs").innerHTML = TEORIA_TABS.map((tab, index) => `<button type="button" role="tab" id="theory-tab-${tab.id}" aria-selected="${index === 0}" aria-controls="theory-panel-${tab.id}" tabindex="${index === 0 ? 0 : -1}">${esc(tab.label)}</button>`).join("");
  $("#theory-tabpanels").innerHTML = TEORIA_TABS.map((tab, index) => `<section class="theory-tabpanel" role="tabpanel" id="theory-panel-${tab.id}" aria-labelledby="theory-tab-${tab.id}" tabindex="0"${index === 0 ? "" : " hidden"}>${theoryTabBody(tab)}</section>`).join("");

  $("#theory-standards-list").innerHTML = TEORIA_ESTANDARES.map((standard, index) => `<li>
    <span class="theory-standard-index">${index + 1}</span><div><h4>${esc(standard.etapa)}</h4><strong>${esc(standard.nivel)}</strong><p>${esc(standard.desc)}</p></div>
  </li>`).join("");

  $("#theory-foundation-content").innerHTML = `<p class="theory-foundation-intro">Referencias compactas para controlar defensa, imputación, congruencia y fundamento de la acusación.</p><div class="theory-references">${TEORIA_REFERENCIAS.map((reference) => `<article><h3>${esc(reference.label)}</h3><p>${esc(reference.desc)}</p><a href="${esc(reference.url)}" target="_blank" rel="noopener noreferrer">Fuente oficial</a></article>`).join("")}</div>`;

  const result = TEORIA_TABS.find((tab) => tab.id === "resultado");
  $("#theory-output-grid").innerHTML = result.summary.map(([label, text], index) => `<article class="theory-output-item">
    <span>${index + 1}</span><div><h4>${esc(label === "Pendientes" ? "Elementos pendientes de corroboración" : label)}</h4><p>${esc(text)}</p></div>
  </article>`).join("");
}

renderTheorySection();

$("#theory-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (tab) activateTheoryTab(tab);
});

$("#theory-tabs").addEventListener("keydown", (event) => {
  const tabs = [...theoryRoot.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  let next = current;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;
  event.preventDefault();
  activateTheoryTab(tabs[next], true);
});

// ---------- medidas ----------
const coercionRoot = $("#page-medidas");

function coercionList(value) {
  if (Array.isArray(value)) return `<ul>${value.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  return `<p>${esc(value)}</p>`;
}

function coercionMeasureCard(measure) {
  const analysisId = `coercion-analysis-${measure.id}`;
  return `<article class="coercion-measure" data-coercion-measure="${esc(measure.id)}">
    <div class="coercion-measure-summary">
      <div class="coercion-measure-copy">
        <h3>${esc(measure.nombre)}</h3>
        <p>${esc(measure.desc)}</p>
        <div class="coercion-meta">
          <span><strong>Intensidad:</strong> ${esc(measure.intensidad)}</span>
          <span><strong>Finalidad:</strong> ${esc(measure.finalidad)}</span>
        </div>
      </div>
      <button class="coercion-analysis-toggle" type="button" aria-expanded="false" aria-controls="${analysisId}">
        <span>Ver análisis</span><span class="coercion-chevron" aria-hidden="true"></span>
      </button>
    </div>
    <div class="coercion-analysis" id="${analysisId}" hidden>
      <div class="coercion-analysis-inner">
        <section class="coercion-detail"><h4>Finalidad</h4><p>${esc(measure.finalidad)}</p></section>
        ${measure.detalles.map(([label, content]) => `<section class="coercion-detail"><h4>${esc(label)}</h4>${coercionList(content)}</section>`).join("")}
        ${(measure.advertencias || []).map((warning) => `<p class="coercion-warning">${esc(warning)}</p>`).join("")}
      </div>
    </div>
  </article>`;
}

function renderCoercionSection() {
  $("#coercion-principles").innerHTML = MEDIDAS_PRINCIPIOS.map((principle) => {
    const helpId = `coercion-principle-${principle.id}`;
    return `<div class="coercion-principle">
      <button type="button" aria-expanded="false" aria-controls="${helpId}">${esc(principle.nombre)}<span aria-hidden="true">?</span></button>
      <p id="${helpId}" hidden>${esc(principle.desc)}</p>
    </div>`;
  }).join("");

  $("#coercion-panel-principios").innerHTML = `<div class="coercion-test">
    <h3>Test de legitimidad de la medida</h3>
    <ol>${MEDIDAS_TEST_LEGITIMIDAD.map((question) => `<li>${esc(question)}</li>`).join("")}</ol>
    <p class="coercion-warning">La sola gravedad del delito o de la pena esperada no sustituye el análisis concreto del peligro procesal.</p>
    <p class="coercion-note">El análisis debe realizarse sobre circunstancias verificables del caso y no mediante fórmulas genéricas.</p>
  </div>`;

  const personal = MEDIDAS_COERCITIVAS.filter((measure) => measure.categoria === "personal");
  const patrimonial = MEDIDAS_COERCITIVAS.filter((measure) => measure.categoria === "patrimonial");
  $("#coercion-panel-personales").innerHTML = `<div class="coercion-measures">${personal.map(coercionMeasureCard).join("")}</div>`;
  $("#coercion-panel-patrimoniales").innerHTML = `<div class="coercion-measures">${patrimonial.map(coercionMeasureCard).join("")}</div>`;

  const comparisonHeaders = ["Comparecencia simple", "Comparecencia con restricciones", "Prisión preventiva"];
  $("#coercion-comparison").innerHTML = `<div class="coercion-table-wrap"><table class="coercion-table">
    <thead><tr><th scope="col">Criterio</th>${comparisonHeaders.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead>
    <tbody>${MEDIDAS_COMPARACION.map((row) => `<tr><th scope="row">${esc(row.criterio)}</th><td>${esc(row.simple)}</td><td>${esc(row.restringida)}</td><td>${esc(row.preventiva)}</td></tr>`).join("")}</tbody>
  </table></div>
  <div class="coercion-compare-cards">${comparisonHeaders.map((header, index) => {
    const key = ["simple", "restringida", "preventiva"][index];
    return `<article><h4>${header}</h4><dl>${MEDIDAS_COMPARACION.map((row) => `<div><dt>${esc(row.criterio)}</dt><dd>${esc(row[key])}</dd></div>`).join("")}</dl></article>`;
  }).join("")}</div>`;

  $("#coercion-jurisprudence").innerHTML = MEDIDAS_JURISPRUDENCIA.map((entry) => `<article>
    <h3>${esc(entry.nombre)}</h3>
    <dl><div><dt>Tema</dt><dd>${esc(entry.tema)}</dd></div><div><dt>Regla resumida</dt><dd>${esc(entry.regla)}</dd></div><div><dt>Aplicación práctica</dt><dd>${esc(entry.aplicacion)}</dd></div></dl>
    <a href="${esc(entry.url)}" target="_blank" rel="noopener noreferrer">Consultar fuente oficial</a>
  </article>`).join("");

  $("#coercion-sources-list").innerHTML = MEDIDAS_REFERENCIAS.map((reference) => `<li><a href="${esc(reference.url)}" target="_blank" rel="noopener noreferrer">${esc(reference.label)}</a></li>`).join("");
  $("#coercion-reviewed").textContent = `Revisión normativa: ${MEDIDAS_REVISION_NORMATIVA}`;
}

function setCoercionExpanded(button, expanded) {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  if (!panel) return;
  button.setAttribute("aria-expanded", String(expanded));
  const label = button.querySelector("span:first-child");
  if (label) label.textContent = expanded ? "Ocultar análisis" : "Ver análisis";
  if (expanded) {
    panel.hidden = false;
    if (!REDUCE_MOTION) panel.animate([{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
  } else if (REDUCE_MOTION) {
    panel.hidden = true;
  } else {
    const animation = panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-in" });
    animation.addEventListener("finish", () => { panel.hidden = true; }, { once: true });
  }
}

function activateCoercionTab(button) {
  const tabs = [...coercionRoot.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    const selected = tab === button;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    if (panel) panel.hidden = !selected;
  });
}

renderCoercionSection();

coercionRoot.addEventListener("click", (event) => {
  const principleButton = event.target.closest(".coercion-principle button");
  if (principleButton) {
    const expanded = principleButton.getAttribute("aria-expanded") === "true";
    const help = document.getElementById(principleButton.getAttribute("aria-controls"));
    principleButton.setAttribute("aria-expanded", String(!expanded));
    if (help) help.hidden = expanded;
    return;
  }

  const tab = event.target.closest('[role="tab"]');
  if (tab) {
    activateCoercionTab(tab);
    return;
  }

  const toggle = event.target.closest(".coercion-analysis-toggle");
  if (toggle) {
    const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
    const tabPanel = toggle.closest('[role="tabpanel"]');
    if (shouldOpen && tabPanel) {
      tabPanel.querySelectorAll('.coercion-analysis-toggle[aria-expanded="true"]').forEach((openButton) => setCoercionExpanded(openButton, false));
    }
    setCoercionExpanded(toggle, shouldOpen);
  }
});

coercionRoot.querySelector(".coercion-tabs").addEventListener("keydown", (event) => {
  const tabs = [...coercionRoot.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  let next = current;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;
  event.preventDefault();
  tabs[next].focus();
  activateCoercionTab(tabs[next]);
});

// ---------- fiscalías ----------
const MPFN_DIRECTORY_URL = "https://www.gob.pe/institucion/mpfn/directorio-fiscalias";
const MPFN_ORGANIZATION_URL = "https://www.gob.pe/institucion/mpfn/organizacion";
const EXTERNAL_LINK_ATTRS = 'target="_blank" rel="noopener noreferrer"';

const SUPREME_PENAL_ANALYSIS = {
  title: "Fiscalías Supremas en lo Penal",
  description: "Interviene ante la Corte Suprema en los procesos, recursos y actuaciones que el ordenamiento jurídico atribuye al nivel supremo. Su actuación comprende el control de legalidad, el análisis de garantías procesales, la interpretación de normas penales y procesales, y la formulación de una posición fiscal especializada.",
  metadata: [
    ["Nivel funcional", "Supremo"],
    ["Ámbito", "Nacional"],
    ["Intervención", "Ante la Corte Suprema"]
  ],
  areas: [
    ["Control de legalidad", "Examen de la correcta aplicación e interpretación de las normas penales y procesales."],
    ["Garantías procesales", "Evaluación del debido proceso, derecho de defensa, presunción de inocencia y debida motivación."],
    ["Coherencia jurisprudencial", "Contraste del caso con acuerdos plenarios, doctrina jurisprudencial y criterios relevantes de la Corte Suprema."],
    ["Vía procesal", "Identificación del recurso o procedimiento que habilita la intervención fiscal en el nivel supremo."],
    ["Impacto jurídico", "Evaluación de los efectos que una interpretación puede producir en casos semejantes y en la actuación institucional."]
  ],
  references: [
    "Constitución Política del Perú, artículos 158 y 159.",
    "Decreto Legislativo N.º 052, Ley Orgánica del Ministerio Público.",
    "Decreto Legislativo N.º 957, Código Procesal Penal.",
    "Legislación especial y jurisprudencia aplicables según la materia."
  ],
  disclaimer: "La competencia y el alcance de la intervención deben verificarse conforme a la vía procesal, la normativa vigente y las particularidades del caso concreto."
};

const FISCAL_HIERARCHY = [
  { id: "provinciales", nombre: "Fiscalías Provinciales", texto: "Es el nivel operativo que interviene directamente en la recepción y evaluación de denuncias, investigación, disposiciones fiscales, solicitudes judiciales, formalización, acusación y actuación en audiencias, según la materia y el procedimiento aplicable." },
  { id: "superiores", nombre: "Fiscalías Superiores", texto: "Interviene en recursos, elevaciones de actuados, revisiones jerárquicas y actuaciones de segunda instancia conforme al procedimiento aplicable. También puede contribuir a uniformizar criterios y organizar la actuación del subsistema, sin sustituir la autonomía funcional del fiscal competente." },
  { id: "supremas", nombre: "Fiscalías Supremas", texto: "Las Fiscalías Supremas son órganos de línea de mayor jerarquía. La organización institucional vigente comprende Fiscalías Supremas en lo Penal, Fiscalía Suprema de Familia, Fiscalía Suprema Especializada en Delitos Cometidos por Funcionarios Públicos y Fiscalías Supremas Transitorias Especializadas en esa materia.", tipos: [
    [SUPREME_PENAL_ANALYSIS.title, SUPREME_PENAL_ANALYSIS.description],
    ["Fiscalía Suprema de Familia", "Interviene en materias de familia, menores y personas especialmente protegidas que corresponden al nivel supremo."],
    ["Fiscalía Suprema Especializada en Delitos Cometidos por Funcionarios Públicos", "Interviene en los procedimientos y actuaciones de su competencia relacionados con delitos atribuidos a funcionarios públicos."],
    ["Fiscalías Supremas Transitorias Especializadas", "Órganos temporales creados para atender las materias y cargas que determine la organización institucional."]
  ], aclaracion: "La cooperación judicial internacional y las extradiciones cuentan con una oficina institucional especializada. No deben presentarse como una función genérica de todas las Fiscalías Supremas." },
  { id: "coordinaciones", nombre: "Coordinaciones Nacionales o Superiores", texto: "Las coordinaciones nacionales o superiores apoyan la planificación estratégica, estandarización de criterios de gestión, seguimiento de carga, coordinación interinstitucional, capacitación, reportes, identificación de necesidades y fortalecimiento operativo del subsistema. Las herramientas de gestión no deben interferir con la autonomía funcional ni decidir el sentido jurídico de un caso concreto." }
];

const OFFICE_TOOLS = [
  ["Ingreso y clasificación", "Registrar denuncias, identificar materia, territorio, condición de las personas y posible despacho competente."],
  ["Distribución de carga", "Asignar expedientes mediante reglas transparentes, turnos, especialidad, complejidad y carga existente."],
  ["Plazos y agenda", "Controlar vencimientos, detenidos, diligencias, pericias, audiencias, requerimientos y actuaciones pendientes."],
  ["Gestión de evidencias", "Registrar documentos, muestras, dispositivos, incautaciones, cadena de custodia, ubicación y responsable."],
  ["Operativos y diligencias", "Planificar personal, movilidad, entidades participantes, riesgos, actas, evidencias esperadas y resultados."],
  ["Plantillas y documentos", "Generar borradores de disposiciones, providencias, requerimientos, oficios, informes, actas y cuadros de seguimiento."],
  ["Coordinación y analítica", "Mostrar carga por despacho, antigüedad, tipo de delito, estado procesal, productividad, cuellos de botella y necesidades de recursos."],
  ["Conocimiento jurídico", "Organizar normas, jurisprudencia, protocolos, criterios, resoluciones institucionales y fechas de actualización con fuentes verificables."]
];

function animateAccordion(panel, opening, onComplete) {
  if (!window.anime || REDUCE_MOTION) { onComplete?.(); return; }
  anime.remove(panel);
  anime({ targets: panel, opacity: opening ? [0, 1] : [1, 0], translateY: opening ? [-5, 0] : [0, -4], duration: opening ? 220 : 150, easing: "easeOutCubic", complete: onComplete });
}

function closeAccordion(button, animate = true) {
  if (!button || button.getAttribute("aria-expanded") !== "true") return;
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", "false");
  panel?.classList.remove("open");
  const finish = () => { if (panel) { panel.hidden = true; panel.removeAttribute("style"); } };
  if (panel && animate) animateAccordion(panel, false, finish); else finish();
}

function setupExclusiveAccordions(container, buttonSelector) {
  let openButton = null;
  container?.addEventListener("click", (event) => {
    const button = event.target.closest(buttonSelector);
    if (!button || !container.contains(button)) return;
    const wasOpen = button.getAttribute("aria-expanded") === "true";
    if (openButton && openButton !== button) closeAccordion(openButton, false);
    if (wasOpen) {
      closeAccordion(button);
      openButton = null;
      return;
    }
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "true");
    if (panel) { panel.hidden = false; panel.classList.add("open"); animateAccordion(panel, true); }
    openButton = button;
  });
  container?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !openButton) return;
    event.preventDefault();
    const button = openButton;
    closeAccordion(button);
    openButton = null;
    button.focus();
  });
}

function hierarchyDetail(item) {
  const supremePenalCard = () => {
    const metadata = SUPREME_PENAL_ANALYSIS.metadata.map(([label, value]) => `<span><b>${esc(label)}:</b> ${esc(value)}</span>`).join("");
    const areas = SUPREME_PENAL_ANALYSIS.areas.map(([title, text]) => `<li><b>${esc(title)}</b><span>${esc(text)}</span></li>`).join("");
    const references = SUPREME_PENAL_ANALYSIS.references.map((reference) => `<li>${esc(reference)}</li>`).join("");
    return `<article class="supreme-type supreme-penal-card"><div class="supreme-penal-badge"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3h8l4 4v14H7zM15 3v5h4M10 12h6M10 16h6"/></svg><span>ANÁLISIS ESPECIALIZADO</span></div><h5>${esc(SUPREME_PENAL_ANALYSIS.title)}</h5><p>${esc(SUPREME_PENAL_ANALYSIS.description)}</p><div class="supreme-penal-metadata" aria-label="Datos funcionales">${metadata}</div><button class="supreme-analysis-toggle" id="supreme-penal-analysis-toggle" type="button" aria-expanded="false" aria-controls="supreme-penal-analysis-detail"><span>Ver análisis institucional</span><span class="accordion-chevron" aria-hidden="true">⌄</span></button><div class="supreme-analysis-detail" id="supreme-penal-analysis-detail" hidden><h6>Ámbitos de análisis</h6><ol class="supreme-analysis-list">${areas}</ol><section class="supreme-normative"><h6>Marco normativo principal</h6><ul>${references}</ul></section><p class="supreme-disclaimer">${esc(SUPREME_PENAL_ANALYSIS.disclaimer)}</p></div></article>`;
  };
  const tipos = item.tipos ? `<div class="supreme-types">${item.tipos.map(([title, text]) => title === SUPREME_PENAL_ANALYSIS.title ? supremePenalCard() : `<div class="supreme-type"><h5>${esc(title)}</h5><p>${esc(text)}</p></div>`).join("")}</div>` : "";
  const clarification = item.aclaracion ? `<p class="hierarchy-clarification"><b>Aclaración:</b> ${esc(item.aclaracion)}</p>` : "";
  return `<article class="hierarchy-card"><button class="hierarchy-toggle" type="button" aria-expanded="false" aria-controls="hierarchy-detail-${item.id}"><span>${esc(item.nombre)}</span><span class="accordion-chevron" aria-hidden="true">⌄</span></button><div class="hierarchy-detail" id="hierarchy-detail-${item.id}" hidden><p>${esc(item.texto)}</p>${tipos}${clarification}<a href="${MPFN_ORGANIZATION_URL}" ${EXTERNAL_LINK_ATTRS}>Ver organización institucional vigente ↗</a></div></article>`;
}

$("#fiscal-hierarchy").innerHTML = FISCAL_HIERARCHY.map(hierarchyDetail).join("");
setupExclusiveAccordions($("#fiscal-hierarchy"), ".hierarchy-toggle");

const supremeAnalysisButton = $("#supreme-penal-analysis-toggle");
supremeAnalysisButton?.addEventListener("click", () => {
  const panel = document.getElementById(supremeAnalysisButton.getAttribute("aria-controls"));
  const opening = supremeAnalysisButton.getAttribute("aria-expanded") !== "true";
  supremeAnalysisButton.setAttribute("aria-expanded", String(opening));
  if (!panel) return;
  if (opening) {
    panel.hidden = false;
    panel.classList.add("open");
    animateAccordion(panel, true);
  } else {
    panel.classList.remove("open");
    animateAccordion(panel, false, () => { panel.hidden = true; panel.removeAttribute("style"); });
  }
});

function fiscalDetail(id) {
  const fiscalia = FISCALIAS[id];
  const subject = encodeURIComponent(`Consulta sobre herramientas para despacho fiscal — ${fiscalia.nombre}`);
  const mailto = `mailto:consultas@andesnova.solutions?subject=${subject}`;
  const distinction = fiscalia.distincion ? `<p class="fiscalia-distinction"><b>Distinción importante:</b> ${esc(fiscalia.distincion)}</p>` : "";
  const specificSource = fiscalia.fuenteEspecifica ? `<a href="${fiscalia.fuenteEspecifica}" ${EXTERNAL_LINK_ATTRS}>Ver fuente oficial específica ↗</a>` : "";
  const compactList = (title, items) => `<details class="fiscalia-extra"><summary>${esc(title)}</summary>${analysisList(items)}</details>`;
  const resources = fiscalia.directorioApoyo.map((resource) => {
    const url = safeOfficialUrl(resource.url);
    const badge = resource.acceso === "restringido" ? "Información restringida no disponible" : resource.acceso === "requiere solicitud formal" ? "Requiere trámite formal" : resource.categoria === "normativa" ? "Fuente normativa" : resource.categoria === "estadística" ? "Estadística" : resource.categoria === "directorio" ? "Directorio" : resource.categoria === "consulta pública" ? "Consulta pública" : "Canal oficial";
    return `<article class="support-resource"><span class="result-badge">${esc(badge)}</span><h6>${esc(resource.nombre)}</h6><p>${esc(resource.rolReferencial)} ${esc(resource.advertencia)}</p>${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(resource.recurso)} ↗</a>` : "<span class=\"result-badge\">Acceso restringido</span>"}<small>Verificación editorial: ${esc(resource.ultimaVerificacion)}</small></article>`;
  }).join("");
  const extras = `<section class="fiscalia-section"><h5>Casuísticas y gestión del despacho</h5><div class="fiscalia-extra-grid">${compactList("Casuísticas ficticias", fiscalia.casuisticas)}${compactList("Documentos frecuentes", fiscalia.documentosFrecuentes)}${compactList("Peritos y especialistas", fiscalia.peritosYEspecialistas)}${compactList("Entidades relacionadas", fiscalia.entidadesRelacionadas)}${compactList("Riesgos de gestión", fiscalia.riesgosDeGestion)}${compactList("Controles recomendados", fiscalia.controlesRecomendados)}</div></section><section class="fiscalia-section"><h5>Directorio público de apoyo institucional</h5><div class="support-directory">${resources}</div><p class="support-disclaimer">JustiPenal únicamente organiza enlaces públicos de entidades oficiales. No accede a sistemas internos, expedientes, registros reservados, información de inteligencia, datos bancarios, comunicaciones privadas ni bases de datos protegidas. La disponibilidad de un enlace no autoriza el acceso, tratamiento o reutilización de información personal.</p></section>`;
  return `<article class="fiscalia-card"><button class="fiscalia-toggle" type="button" aria-expanded="false" aria-controls="fiscalia-detail-${id}"><span class="fiscalia-icon" aria-hidden="true">§</span><span class="fiscalia-heading"><strong>${esc(fiscalia.nombre)}</strong><span>${esc(fiscalia.desc)}</span></span><span class="accordion-chevron" aria-hidden="true">⌄</span></button><div class="fiscalia-detail" id="fiscalia-detail-${id}" hidden>${distinction}<section class="fiscalia-section"><h5>¿Qué atiende?</h5><p>${esc(fiscalia.atiende)}</p></section><section class="fiscalia-section"><h5>Necesidades principales del despacho</h5><p>${esc(fiscalia.necesidades)}</p></section><section class="fiscalia-section"><h5>Organización y herramientas de apoyo</h5><p>${esc(fiscalia.herramientas)}</p></section><section class="fiscalia-section"><h5>Base normativa referencial</h5><p>${esc(fiscalia.baseNormativa)}</p></section>${extras}<section class="fiscalia-section fiscalia-sources"><h5>Fuente institucional</h5><div><a href="${MPFN_DIRECTORY_URL}" ${EXTERNAL_LINK_ATTRS}>Directorio oficial de fiscalías ↗</a><a href="${MPFN_ORGANIZATION_URL}" ${EXTERNAL_LINK_ATTRS}>Organización del Ministerio Público ↗</a>${specificSource}</div></section><section class="fiscalia-contact"><h5>Herramientas para organizar o modernizar el despacho</h5><p>¿Necesita adaptar estas funciones a un despacho fiscal, una fiscalía especializada o una coordinación? AndesNova Solutions desarrolla herramientas de organización, distribución de carga, control de plazos, plantillas, trazabilidad, analítica y consulta normativa, incluidas alternativas de funcionamiento local.</p><p><b>Contacto:</b> <a href="mailto:consultas@andesnova.solutions">consultas@andesnova.solutions</a></p><a class="btn small" href="${mailto}">Consultar una solución para este despacho</a><p class="contact-warning"><b>No incluya nombres, DNI, expedientes ni información confidencial en el correo inicial.</b></p><p class="contact-disclaimer">Servicio tecnológico independiente. AndesNova Solutions no pertenece ni representa al Ministerio Público ni sustituye la evaluación jurídica o institucional correspondiente.</p></section></div></article>`;
}

const directoryFiscalias = FISCALIAS_UI_ORDER.filter((id) => FISCALIAS[id]?.showInDirectory);
$("#grid-fiscalias").innerHTML = directoryFiscalias.map(fiscalDetail).join("");
setupExclusiveAccordions($("#grid-fiscalias"), ".fiscalia-toggle");

$("#office-tools-grid").innerHTML = OFFICE_TOOLS.map(([title, text]) => `<details class="office-tool"><summary>${esc(title)}</summary><p>${esc(text)}</p></details>`).join("");
$("#tabla-condiciones").innerHTML = CONDICIONES_PERSONA.filter((c) => c.nota).map(
  (c) => `<tr><td><b>${c.label}</b></td><td>${c.nota}</td></tr>`
).join("");

// ---------- normativa ----------
$("#tabla-normas").innerHTML = NORMAS_BASE.map(
  (n) => `<tr><td style="white-space:nowrap"><b>${n.norma}</b></td><td>${n.contenido}</td></tr>`
).join("");
$("#tabla-jurisprudencia").innerHTML = JURISPRUDENCIA.map(
  (j) => `<tr><td style="white-space:nowrap"><b>${esc(j.nombre)}</b><br><small style="color:var(--text-muted)">${esc(j.organo)} · ${esc(j.anio)}</small></td><td><b>${esc(j.materia)}</b></td><td style="font-size:12.5px">${esc(j.texto)}</td><td>${selloBadge(j.sello)}<br><small style="color:var(--text-muted)">al ${VERIFICADO_AT}</small></td></tr>`
).join("");
$("#tabla-normas-recientes").innerHTML = NORMAS_RECIENTES.map(
  (n) => { const url = safeOfficialUrl(n.url); return `<tr><td style="white-space:nowrap"><span class="badge green">${esc(n.norma)}</span><br><small>${esc(n.categoria)}</small></td><td>${esc(n.publicacion)}</td><td>${esc(n.materia)}<br><small style="color:var(--text-muted)">Vigencia: ${esc(n.vigencia)}</small></td><td>${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(n.fuenteOficial)} ↗</a>` : esc(n.fuenteOficial)}</td><td>${esc(n.estado)}</td><td>${esc(n.verificacion)}</td></tr>`; }
).join("");

// ---------- fuentes ----------
$("#grid-fuentes").innerHTML = FUENTES_OFICIALES.map(
  (f, index) => `<article class="panel src-card"><span class="lvl">${esc(f.categoria)}</span><h5>${esc(f.nombre)}</h5><p>${esc(f.uso)}</p><details class="source-help"><summary aria-label="Ayuda sobre ${esc(f.nombre)}">¿Para qué sirve?</summary><p>${esc(f.ayuda.replace(/^¿Para qué sirve\?\s*/, ""))}</p></details><a href="${safeOfficialUrl(f.url)}" target="_blank" rel="noopener noreferrer">Visitar fuente oficial ↗</a></article>`
).join("");

// ---------- metodología ----------
$("#tabla-changelog").innerHTML = CHANGELOG.map(
  (c) => `<tr><td style="white-space:nowrap">${c.fecha}</td><td>${c.cambio}</td></tr>`
).join("");

/* ============================================================
   Ayuda contextual: botón (?) en cada sección
   ============================================================ */
const AYUDA = [
  ["Recorrido para comprender", "Ruta educativa de seis etapas para conocer conceptos, instituciones, procedimientos, medidas y fuentes oficiales sin evaluar hechos concretos."],
  ["Cálculo de Penas", "Seleccione uno o más delitos y sus circunstancias. El portal aplica el <b>sistema de tercios</b> del Código Penal (art. 45-A) y muestra un rango referencial de pena — no una condena: esa la decide únicamente un juez."],
  ["Delitos y Penas", "Catálogo referencial de los delitos más frecuentes con su artículo, rango de pena, multa e inhabilitación. Use el buscador y haga clic en el artículo para ver el texto oficial."],
  ["3. Delitos del Caso", "Los delitos que usted agregó al caso. Con dos o más, el portal evalúa las reglas de <b>concurso</b> (arts. 48-50): las penas no se suman mecánicamente."],
  ["Rango Referencial de Individualización", "Intervalo del tercio aplicable según sus circunstancias. La pena exacta dentro del tercio exige motivación judicial (gravedad, dolo, daño, condiciones personales)."],
  ["Competencia y Plazos", "Fiscalía que probablemente conocería el caso (según materia, territorio y condición del investigado), el órgano judicial de juzgamiento y los plazos de investigación aplicables."],
  ["Trazabilidad Normativa", "Repositorio o fuente oficial de consulta de cada delito usado en el cálculo, con enlace, fecha de revisión editorial y su sello correspondiente."],
  ["Teoría del Caso", "Explica los componentes fáctico, jurídico y probatorio como contenidos académicos y profesionales. No construye una teoría para hechos ingresados por el usuario."],
  ["Checklist Probatorio", "Medios de prueba que típicamente sustentan cada familia de delito. Es orientativo: la estrategia probatoria concreta la define un abogado según el caso."],
  ["Imputación y Defensa", "Frente a cada acusación existen defensas legales: que el hecho no encaje en el delito (atipicidad), causas de justificación como la legítima defensa, errores del art. 14 o la insuficiencia de la prueba."],
  ["Instituciones del Proceso", "Figuras que pueden cambiar el rumbo de un caso: salidas alternativas al juicio, suspensión de la pena, prescripción, beneficios penitenciarios y regímenes especiales."],
  ["Glosario Penal", "Términos técnicos del derecho penal explicados en lenguaje simple. Use el buscador para encontrar un término."],
  ["Procedimiento Penal", "Etapas del proceso penal común peruano, desde la denuncia hasta la sentencia y sus recursos (D. Leg. 957)."],
  ["Rutas procesales especiales", "Caminos distintos al proceso común: proceso inmediato por flagrancia, acuerdos como la terminación anticipada, colaboración eficaz, etc."],
  ["Decisiones fiscales", "Opciones que tiene el fiscal al terminar las diligencias preliminares: archivar, aplicar salidas alternativas, formalizar investigación o acusar directamente."],
  ["Distribución Fiscalía", "Cómo se reparten el trabajo la Policía (investigación operativa) y el fiscal (conducción jurídica) tras la Ley 32130 y la sentencia del Tribunal Constitucional de 2026."],
  ["Calculadora de Plazos", "Estime la fecha de vencimiento de una investigación indicando el acto que inicia el cómputo. El resultado incluye base normativa y nivel de certeza; el cómputo real puede variar."],
  ["Plazos legales de referencia", "Duración máxima legal de cada etapa. Son regímenes alternativos: una investigación es ordinaria, compleja o de criminalidad organizada — no las tres a la vez."],
  ["Prisión preventiva", "Plazos máximos de la prisión preventiva. No es una pena: es una medida excepcional que requiere graves elementos, prognosis de pena y peligro procesal."],
  ["Medidas Coercitivas", "Restricciones que un juez puede imponer durante el proceso (comparecencia, impedimento de salida, prisión preventiva). Ninguna equivale a una condena."],
  ["Clases de penas", "Tipos de pena del art. 28 del Código Penal: privativa de libertad, restrictivas, limitativas de derechos y multa, más las consecuencias adicionales."],
  ["Organización de las Fiscalías", "Jerarquía del Ministerio Público: fiscalías provinciales (investigan y acusan), superiores (apelaciones) y supremas (casación). La jerarquía no depende de la gravedad del delito."],
  ["Fiscalías por Especialidad", "Fiscalías dedicadas a materias específicas: corrupción, crimen organizado, drogas, lavado, extorsión, etc. La especialidad depende de la materia, no de la pena."],
  ["Verificador de Competencia", "La fiscalía competente se determina por cuatro factores: materia, territorio, condición de la persona investigada y etapa del proceso."],
  ["Marco Normativo", "Las normas que forman el sistema penal peruano: Constitución, Código Penal, Código Procesal Penal y leyes especiales."],
  ["Modificaciones Recientes", "Reformas recientes con su fecha de publicación, materia y estado. La ley aplicable es la vigente en la fecha del hecho, salvo que una posterior sea más favorable."],
  ["Jurisprudencia Vinculante", "Criterios de la Corte Suprema (acuerdos plenarios y casaciones) que explican cómo se aplican las normas en la práctica: prisión preventiva, prueba en delitos sexuales, lavado de activos, conclusión anticipada."],
  ["Fuentes Oficiales", "Repositorios del Estado peruano de donde proviene la información, ordenados por prioridad: El Peruano, SPIJ, Congreso, Ministerio Público, Poder Judicial y Tribunal Constitucional."],
  ["Fuentes complementarias", "Entidades sectoriales (SUNAT, OEFA, Indecopi…) que aportan normativa técnica; la pena siempre proviene de una norma penal con rango de ley."],
  ["Metodología", "Cómo se construye y actualiza la información del portal: fuentes prioritarias, gestión de derogaciones, reporte de errores y registro público de cambios."],
  ["Aviso Legal", "Términos de uso: el portal es informativo, usa solo fuentes públicas oficiales, no recopila datos personales y no constituye asesoría legal."]
];
let popActual = null;
function cerrarPop() { if (popActual) { popActual.remove(); popActual = null; } }
document.addEventListener("click", (e) => { if (popActual && !e.target.closest(".help-pop") && !e.target.closest(".help-btn")) cerrarPop(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarPop(); });

$$(".card-title h3").forEach((h3) => {
  const titulo = h3.textContent.trim();
  const entrada = AYUDA.find(([k]) => titulo.toLowerCase().startsWith(k.toLowerCase()) || titulo.toLowerCase().includes(k.toLowerCase()));
  if (!entrada) return;
  const btn = document.createElement("button");
  btn.className = "help-btn";
  btn.textContent = "?";
  btn.setAttribute("aria-label", "¿Qué es esta sección?");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const abierto = popActual && popActual.dataset.para === titulo;
    cerrarPop();
    if (abierto) return;
    const pop = document.createElement("div");
    pop.className = "help-pop";
    pop.dataset.para = titulo;
    pop.innerHTML = entrada[1];
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect();
    pop.style.left = Math.min(r.left, window.innerWidth - pop.offsetWidth - 12) + "px";
    pop.style.top = r.bottom + window.scrollY + 8 + "px";
    popActual = pop;
    if (window.anime && !REDUCE_MOTION) anime({ targets: pop, translateY: [-4, 0], opacity: [0, 1], duration: 250, easing: "easeOutQuad" });
  });
  h3.parentElement.appendChild(btn);
});

/* ============================================================
   Animaciones (AOS + anime.js) — con degradación elegante
   ============================================================ */
if (window.AOS) {
  $$("#page-inicio .action-grid .card, #stats-row .stat").forEach((el, i) => {
    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-delay", String(Math.min((i % 6) * 60, 300)));
  });
  AOS.init({ duration: 550, once: true, offset: 50 });
}
if (window.anime) {
  anime({ targets: ".hero h2, .hero p", translateY: [18, 0], opacity: [0, 1], delay: anime.stagger(100), duration: 600, easing: "easeOutCubic" });
  anime({ targets: ".hero-glow", scale: [.86, 1], opacity: [.35, 1], duration: 650, easing: "easeOutSine" });
  anime({ targets: ".brand-logo", scale: [0.6, 1], rotate: ["-12deg", "0deg"], duration: 600, easing: "easeOutBack" });
  if ($("#page-inicio").classList.contains("active")) { animarEstadisticasUnaVez(); animarHeroUnaVez(); }
}
