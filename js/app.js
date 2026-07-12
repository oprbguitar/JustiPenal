/* JustiPenal — lógica del portal v2 (todo se ejecuta localmente en el navegador) */

// ---------- utilidades ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
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
}
btnMenu.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
overlay.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- navegación ----------
function goPage(id) {
  $$(".page").forEach((p) => p.classList.remove("active"));
  $$(".nav-item").forEach((n) => n.classList.remove("active"));
  const page = $("#page-" + id);
  const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
  if (page) page.classList.add("active");
  if (nav) nav.classList.add("active");
  setMenu(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
}
$$(".nav-item").forEach((btn) => btn.addEventListener("click", () => goPage(btn.dataset.page)));
$$(".topbar-links a, .footer-links a[data-goto]").forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = a.dataset.goto || a.getAttribute("href").slice(1);
    if ($("#page-" + target)) { e.preventDefault(); goPage(target); }
  })
);
if (location.hash && $("#page-" + location.hash.slice(1))) goPage(location.hash.slice(1));

// ---------- inicio ----------
const STATS = [
  { icon: "⚖️", color: "#dbeafe", num: DELITOS.length + "+", label: "Delitos frecuentes catalogados" },
  { icon: "🔎", color: "#f3e8ff", num: ANALIZADOR_PATRONES.length, label: "Patrones del analizador de casos" },
  { icon: "🏛️", color: "#dcfce7", num: Object.keys(FISCALIAS).length, label: "Especialidades fiscales mapeadas" },
  { icon: "🕐", color: "#ffedd5", num: PLAZOS.length + PRISION_PREVENTIVA.length, label: "Plazos procesales de referencia" },
  { icon: "📖", color: "#dbeafe", num: NORMAS_BASE.length + NORMAS_RECIENTES.length, label: "Normas base y recientes" }
];
$("#stats-row").innerHTML = STATS.map(
  (s) => `<div class="stat"><div class="bubble" style="background:${s.color}">${s.icon}</div><div><b>${s.num}</b><span>${s.label}</span></div></div>`
).join("");

$("#mini-flow").innerHTML = PROCEDIMIENTO.slice(0, 4)
  .map((p) => `<div class="flow-step"><span class="ic">${p.icono}</span><b>${p.nombre}</b></div>`)
  .join('<div class="flow-arrow">→</div>');
$("#mini-fiscalias").innerHTML = FISCALIAS_LISTA.slice(0, 6).map((f) => `<li>${f}</li>`).join("");
$("#mini-plazos").innerHTML = PLAZOS.slice(0, 5).map((p) => `<li><b>${p.etapa}:</b> ${p.plazo}</li>`).join("");
$("#mini-normas").innerHTML = NORMAS_RECIENTES.map((n) => `<li><b>${n.norma}</b> (${n.publicacion}) — ${n.materia}</li>`).join("");

// ---------- rail de fuentes (escritorio ancho) ----------
$("#rail-fuentes").innerHTML = FUENTES_OFICIALES.map(
  (f) => `<div class="rail-src"><a href="${f.url}" target="_blank" rel="noopener">${f.nombre} ↗</a><p>${f.nivel} — ${f.uso.split(",")[0]}.</p></div>`
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
        <td>${selloBadge(d.sello)}<br><small style="color:var(--text-muted)">al ${VERIFICADO_AT}</small></td></tr>`
      );
    }
  }
  $("#tabla-delitos tbody").innerHTML = rows.join("") || '<tr><td colspan="7">Sin resultados para la búsqueda.</td></tr>';
}
renderTablaDelitos();
$("#buscar-delito").addEventListener("input", (e) => renderTablaDelitos(e.target.value));

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
  if (m.perpetua && m.min == null && m.max == null) rango = '<span class="rng">Cadena perpetua</span>';
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

function calcularTercioBloque(b) {
  const m = b.m;
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
    const rango = r.perpetua ? "Cadena perpetua" : `Tercio ${r.tercio}: ${fmtAnios(r.tMin)} a ${fmtAnios(r.tMax)}`;
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
          <div class="kv"><span>Tercio aplicado</span><b>${r.tercio}</b></div>
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
    const finitos = resultados.filter(({ r }) => !r.perpetua);
    let grave = null;
    if (finitos.length) grave = finitos.reduce((a, c) => (c.r.tMax > a.r.tMax ? c : a));
    const filas = [];
    if (conPerpetua) {
      filas.push(`<div class="kv"><span><b>${CONCURSO_INFO.real.nombre}</b><br><small style="color:var(--text-muted)">Uno de los delitos contempla cadena perpetua: esta absorbe a las penas temporales.</small></span><b>Cadena perpetua</b></div>`);
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
  const baseRef = resultados.length === 1 ? resultados[0] : resultados.filter(({ r }) => !r.perpetua).reduce((a, c) => (!a || c.r.tMax > a.r.tMax ? c : a), null);
  if (reds.length && baseRef && !baseRef.r.perpetua) {
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
    <p style="font-size:12px;margin-top:6px"><a href="${dirUrl}" target="_blank" rel="noopener">Buscar el directorio oficial del distrito fiscal ↗</a> · <small style="color:var(--text-muted)">verificado al ${VERIFICADO_AT}; los despachos cambian por resolución de la Fiscalía de la Nación</small></p>`;

  $("#res-plazos").innerHTML = `<h4>Plazos aplicables (regímenes alternativos, referenciales)</h4>
    <div class="kv"><span>Investigación preliminar</span><b>60 días</b></div>
    <div class="kv"><span>Preparatoria ordinaria</span><b>120 días (+60)</b></div>
    <div class="kv"><span>Caso complejo</span><b>8 meses (+8)</b></div>
    <div class="kv"><span>Criminalidad organizada</span><b>36 meses (+36)</b></div>
    <a href="#plazos" onclick="goPage('plazos');return false" style="font-size:12.5px">Ver calculadora de plazos →</a>`;

  // ----- trazabilidad -----
  const vistos = new Set();
  $("#res-fuentes").innerHTML = resultados.filter(({ b }) => !vistos.has(b.d.id) && vistos.add(b.d.id)).map(({ b }) => `
    <div class="panel" style="padding:12px 14px">
      <p style="font-size:13px"><b>${b.d.nombre} — ${b.d.articulo}</b> ${selloBadge(b.d.sello)}</p>
      <p style="font-size:12px;color:var(--text-muted)">${esc(b.d.fuente.norma)}${b.d.vigenteDesde ? " · " + b.d.vigenteDesde : ""}</p>
      <p style="font-size:12px"><a href="${b.d.fuente.url}" target="_blank" rel="noopener">Ver texto oficial ↗</a> · Última comprobación: ${VERIFICADO_AT}</p>
    </div>`).join("");

  ultimoInforme = generarInforme(resultados, reds, cond, territorio, fis);
  $("#resultado-wrap").scrollIntoView({ behavior: "smooth" });
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

// ---------- analizador de casos ----------
$("#btn-analizar").addEventListener("click", () => {
  const texto = $("#caso-texto").value.trim();
  if (texto.length < 20) { alert("Describa el caso con un poco más de detalle (mínimo unas dos líneas)."); return; }
  const tags = new Map();
  for (const p of ANALIZADOR_PATRONES) if (!tags.has(p.tag) && p.re.test(texto)) tags.set(p.tag, p.etiqueta);
  if (tags.has("arma-fuego") || tags.has("arma-blanca")) tags.set("arma-tipo", tags.get("arma-fuego") || tags.get("arma-blanca"));
  const tagSet = { has: (t) => tags.has(t) || (t === "arma" && (tags.has("arma-fuego") || tags.has("arma-blanca"))) };

  // extracción
  $("#analisis-tags").innerHTML = tags.size
    ? [...tags.values()].filter((v, i, a) => a.indexOf(v) === i).map((e) => `<span class="tag-pill">${e}</span>`).join("")
    : '<p style="font-size:13px;color:var(--text-muted)">No se detectaron elementos típicos reconocibles. Añada más detalle sobre qué ocurrió, cómo y con qué medios.</p>';

  // faltantes
  const faltantes = [];
  if (!$("#caso-fecha").value) faltantes.push("Fecha del hecho (necesaria para determinar la norma vigente y la favorabilidad)");
  if (!$("#caso-lugar").value.trim()) faltantes.push("Lugar del hecho (necesario para la competencia territorial)");
  if (tagSet.has("arma") && !tags.has("arma-tipo")) faltantes.push("Tipo de arma empleada (fuego, blanca u objeto contundente)");
  if (tags.has("lesion")) faltantes.push("Certificado médico-legal y días de incapacidad (distingue lesiones leves, graves o falta)");
  if (tags.has("apoderamiento") && !$("#caso-valor").value) faltantes.push("Valor y propiedad de los bienes");
  if (tags.has("pluralidad")) faltantes.push("Participación específica de cada interviniente (autor, coautor, cómplice)");
  if (tags.has("drogas")) faltantes.push("Tipo y cantidad de la sustancia (define el artículo aplicable: 296, 297, 298 o 299)");
  if (tags.has("tentativa")) faltantes.push("Confirmar si el resultado llegó a producirse (consumación o tentativa)");
  faltantes.push("Afirmaciones que requieren prueba: el análisis no convierte la sospecha en hecho probado");
  $("#analisis-faltante").innerHTML = `<h4>Información faltante o por acreditar</h4><ul class="list-check">${faltantes.map((f) => `<li>${f}</li>`).join("")}</ul>`;

  // hipótesis
  const encontradas = [];
  const usados = new Set();
  for (const h of ANALIZADOR_HIPOTESIS) {
    if (usados.has(h.delitoId)) continue;
    if (h.soloSi && !h.soloSi(texto)) continue;
    let ok = false;
    try { ok = h.cuando(tagSet); } catch { ok = false; }
    if (ok) { encontradas.push(h); usados.add(h.delitoId); }
  }
  let principal = encontradas.find((h) => h.tipo === "principal") || encontradas[0] || null;
  const grupos = { principal: [], alternativa: [], conexo: [] };
  for (const h of encontradas) {
    if (h === principal) grupos.principal.push(h);
    else if (h.tipo === "conexo") grupos.conexo.push(h);
    else grupos.alternativa.push(h);
  }
  const hipoHTML = (h) => {
    const d = DELITOS.find((x) => x.id === h.delitoId);
    return `<div class="panel" style="padding:11px 13px;margin-bottom:8px"><p style="font-size:13px"><b>${d.nombre}</b> <small style="color:var(--text-muted)">(${d.articulo})</small></p><p style="font-size:12px;color:var(--text-muted)">${h.razon}</p></div>`;
  };
  $("#analisis-hipotesis").innerHTML = encontradas.length
    ? `${grupos.principal.length ? `<h4 style="font-size:12px;color:var(--green-600);text-transform:uppercase;margin-bottom:6px">Hipótesis principal</h4>${grupos.principal.map(hipoHTML).join("")}` : ""}
       ${grupos.alternativa.length ? `<h4 style="font-size:12px;color:var(--blue-600);text-transform:uppercase;margin:10px 0 6px">Hipótesis alternativas</h4>${grupos.alternativa.map(hipoHTML).join("")}` : ""}
       ${grupos.conexo.length ? `<h4 style="font-size:12px;color:var(--amber-600);text-transform:uppercase;margin:10px 0 6px">Delitos posiblemente conexos</h4>${grupos.conexo.map(hipoHTML).join("")}
       <p style="font-size:11.5px;color:var(--text-muted)">Un delito conexo puede quedar absorbido por el principal (concurso aparente) o concurrir con él (concurso real o ideal): requiere análisis jurídico.</p>` : ""}`
    : '<p style="font-size:13px;color:var(--text-muted)">Sin hipótesis claras. El relato puede no describir un delito o requerir más detalle.</p>';

  // matriz de tipicidad
  const filas = [];
  const estado = (cls, txt) => `<span class="estado ${cls}">${txt}</span>`;
  if (principal) {
    const d = DELITOS.find((x) => x.id === principal.delitoId);
    $("#matriz-sub").textContent = `${d.nombre} (${d.articulo}) — el estado de cada elemento explica por qué aparece o podría descartarse la hipótesis.`;
    if (d.familia === "Patrimonio") {
      filas.push(["Apoderamiento de bien mueble", tags.has("apoderamiento") ? "Descrito en el relato" : "No descrito", tags.has("apoderamiento") ? estado("confirmado", "Confirmado por la descripción") : estado("nodeterminado", "No determinado")]);
      filas.push(["Bien ajeno", "Se presume de la narración", estado("inferido", "Inferido")]);
      filas.push(["Finalidad de aprovechamiento", "Inferida del apoderamiento", estado("inferido", "Inferido")]);
      const va = tagSet.has("violencia") || tagSet.has("amenaza");
      filas.push(["Violencia o amenaza contra la persona", va ? [tags.get("violencia"), tags.get("amenaza")].filter(Boolean).join(" y ") : "No descrita", va ? estado("compatible", "Compatible") : estado("ausente", "Aparentemente ausente")]);
    }
    if (tagSet.has("pluralidad")) filas.push(["Pluralidad de agentes", tags.get("pluralidad"), estado("compatible", "Compatible")]);
    if (tagSet.has("arma")) filas.push(["Empleo de arma", tags.get("arma-tipo") || "Objeto no descrito con precisión", tags.has("arma-tipo") ? estado("compatible", "Compatible") : estado("nodeterminado", "Requiere precisión")]);
    if (tags.has("lesion")) filas.push(["Lesiones (posible delito autónomo)", tags.get("lesion"), estado("nodeterminado", "Requiere certificado médico-legal")]);
    if (tags.has("drogas")) filas.push(["Sustancia fiscalizada y cantidad", tags.get("drogas"), estado("nodeterminado", "Requiere pericia y pesaje")]);
    if (tags.has("engano")) filas.push(["Engaño y disposición patrimonial", tags.get("engano"), estado("compatible", "Compatible")]);
    if (tags.has("funcionario")) filas.push(["Condición de funcionario público", tags.get("funcionario"), estado("compatible", "Compatible — verificar cargo y vínculo funcional")]);
    filas.push(["Consumación", tags.has("tentativa") ? "El relato sugiere ejecución no completada" : "El relato sugiere hecho consumado", tags.has("tentativa") ? estado("contradictorio", "Posible tentativa — confirmar") : estado("inferido", "Probable")]);
  } else {
    $("#matriz-sub").textContent = "No hay hipótesis principal: la matriz se construye cuando el relato permite identificar un delito candidato.";
  }
  $("#tabla-matriz").innerHTML = filas.length
    ? filas.map((f) => `<tr><td><b>${f[0]}</b></td><td>${f[1]}</td><td>${f[2]}</td></tr>`).join("")
    : '<tr><td colspan="3">Sin elementos suficientes.</td></tr>';

  // cargar en calculadora
  $("#btn-cargar-calc").style.display = principal ? "inline-flex" : "none";
  $("#btn-cargar-calc").onclick = () => {
    if (!principal) return;
    const d = DELITOS.find((x) => x.id === principal.delitoId);
    $("#sel-familia").value = d.familia; fillDelitos();
    $("#sel-delito").value = d.id; fillModalidades();
    if (d.modalidades.some((m) => m.id === principal.modalidadId)) { $("#sel-modalidad").value = principal.modalidadId; renderAbstracta(); }
    if (tags.has("tentativa")) $("#sel-consumacion").value = "tentativa";
    goPage("calculo");
  };

  $("#analisis-wrap").style.display = "block";
  $("#analisis-wrap").scrollIntoView({ behavior: "smooth" });
});

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
});

// ---------- medidas ----------
$("#grid-medidas").innerHTML = MEDIDAS_COERCITIVAS.map(
  (m) => `<div class="panel"><h4 style="color:var(--navy-800)">${m.nombre}</h4><p style="font-size:12.5px;color:var(--text-muted)">${m.desc}</p></div>`
).join("");

// ---------- fiscalías ----------
$("#grid-fiscalias").innerHTML = FISCALIAS_LISTA.map(
  (f) => `<div class="panel blue" style="padding:12px 14px"><p style="font-size:13px"><b>${f}</b></p></div>`
).join("");
$("#tabla-condiciones").innerHTML = CONDICIONES_PERSONA.filter((c) => c.nota).map(
  (c) => `<tr><td><b>${c.label}</b></td><td>${c.nota}</td></tr>`
).join("");

// ---------- normativa ----------
$("#tabla-normas").innerHTML = NORMAS_BASE.map(
  (n) => `<tr><td style="white-space:nowrap"><b>${n.norma}</b></td><td>${n.contenido}</td></tr>`
).join("");
$("#tabla-normas-recientes").innerHTML = NORMAS_RECIENTES.map(
  (n) => `<tr><td style="white-space:nowrap"><span class="badge green">${n.norma}</span></td><td>${n.publicacion}</td><td>${n.materia}<br><small style="color:var(--text-muted)">Vigencia: ${n.vigencia}</small></td><td>${n.fuenteOficial}</td><td>${n.estado}</td><td>${n.verificacion}</td></tr>`
).join("");

// ---------- fuentes ----------
$("#grid-fuentes").innerHTML = FUENTES_OFICIALES.map(
  (f) => `<div class="panel src-card"><span class="lvl">${f.nivel}</span><h5>${f.nombre}</h5><p>${f.uso}</p><a href="${f.url}" target="_blank" rel="noopener">Visitar fuente oficial ↗</a></div>`
).join("");

// ---------- metodología ----------
$("#tabla-changelog").innerHTML = CHANGELOG.map(
  (c) => `<tr><td style="white-space:nowrap">${c.fecha}</td><td>${c.cambio}</td></tr>`
).join("");
