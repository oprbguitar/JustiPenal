/* JustiPenal — lógica del portal (referencial, sin dependencias) */

// ---------- utilidades ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function fmtAnios(v) {
  if (v == null) return "—";
  const anios = Math.floor(v);
  const meses = Math.round((v - anios) * 12);
  if (anios === 0 && meses > 0) return `${meses} meses`;
  if (meses === 0) return `${anios} ${anios === 1 ? "año" : "años"}`;
  return `${anios} ${anios === 1 ? "año" : "años"} y ${meses} meses`;
}

// ---------- navegación ----------
function goPage(id) {
  $$(".page").forEach((p) => p.classList.remove("active"));
  $$(".nav-item").forEach((n) => n.classList.remove("active"));
  const page = $("#page-" + id);
  const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
  if (page) page.classList.add("active");
  if (nav) nav.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
}
$$(".nav-item").forEach((btn) => btn.addEventListener("click", () => goPage(btn.dataset.page)));
$$(".topbar-links a").forEach((a) =>
  a.addEventListener("click", (e) => { e.preventDefault(); goPage(a.getAttribute("href").slice(1)); })
);
if (location.hash) {
  const id = location.hash.slice(1);
  if ($("#page-" + id)) goPage(id);
}

// ---------- inicio: stats y resúmenes ----------
const totalModalidades = DELITOS.reduce((n, d) => n + d.modalidades.length, 0);
const STATS = [
  { icon: "⚖️", color: "#dbeafe", num: DELITOS.length + "+", label: "Delitos frecuentes catalogados" },
  { icon: "🏛️", color: "#dcfce7", num: Object.keys(FISCALIAS).length, label: "Especialidades fiscales mapeadas" },
  { icon: "👥", color: "#f3e8ff", num: 3, label: "Niveles de jerarquía fiscal" },
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
$("#mini-medidas").innerHTML = MEDIDAS_COERCITIVAS.slice(0, 5).map((m) => `<li>${m.nombre}</li>`).join("");
$("#mini-normas").innerHTML = NORMAS_RECIENTES.map((n) => `<li><b>${n.norma}</b> — ${n.contenido}</li>`).join("");

// ---------- delitos: tabla con buscador ----------
function renderTablaDelitos(filtro = "") {
  const f = filtro.trim().toLowerCase();
  const rows = [];
  for (const d of DELITOS) {
    for (const m of d.modalidades) {
      const texto = `${d.familia} ${d.nombre} ${d.articulo} ${m.nombre}`.toLowerCase();
      if (f && !texto.includes(f)) continue;
      const pena = m.perpetua && m.min == null
        ? '<span class="badge red">Cadena perpetua</span>'
        : `${fmtAnios(m.min)} a ${fmtAnios(m.max)}` + (m.perpetua ? ' <span class="badge red">hasta perpetua</span>' : "");
      rows.push(
        `<tr><td><span class="badge">${d.familia}</span></td><td><b>${d.nombre}</b>${m.nota ? `<br><small style="color:var(--text-muted)">${m.nota}</small>` : ""}</td><td>${d.articulo}</td><td>${m.nombre}</td><td>${pena}</td></tr>`
      );
    }
  }
  $("#tabla-delitos tbody").innerHTML = rows.join("") || '<tr><td colspan="5">Sin resultados para la búsqueda.</td></tr>';
}
renderTablaDelitos();
$("#buscar-delito").addEventListener("input", (e) => renderTablaDelitos(e.target.value));

// ---------- calculadora de penas ----------
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
function renderAbstracta() {
  const { d, m } = getSeleccion();
  const organo = organoJudicial(m);
  const rango = m.perpetua && m.min == null
    ? '<span class="rng">Cadena perpetua</span>'
    : `<span class="rng">${fmtAnios(m.min)} a ${fmtAnios(m.max)}</span> <small>de pena privativa de libertad</small>`;
  $("#box-abstracta").innerHTML = `
    <h4 style="color:var(--blue-600);font-size:12px;letter-spacing:.5px">PENA ABSTRACTA DEL DELITO</h4>
    <p style="font-size:13px;margin:4px 0"><b>${d.articulo} — ${d.nombre}</b><br>${m.nombre}</p>
    <div style="margin:8px 0">${rango}</div>
    ${m.nota ? `<p style="font-size:12px;color:var(--text-muted)">${m.nota}</p>` : ""}
    <div class="panel green" style="margin:10px 0 0;padding:10px 12px">
      <h4 style="font-size:11px">Órgano judicial competente</h4>
      <p style="font-size:12.5px"><b>${organo}</b></p>
    </div>`;
}
function organoJudicial(m) {
  if (m.perpetua && m.min == null) return "Juzgado Penal Colegiado (3 jueces)";
  return m.min > 6
    ? "Juzgado Penal Colegiado — pena mínima mayor de 6 años"
    : "Juzgado Penal Unipersonal — pena mínima de hasta 6 años";
}
$("#sel-familia").addEventListener("change", fillDelitos);
$("#sel-delito").addEventListener("change", fillModalidades);
$("#sel-modalidad").addEventListener("change", renderAbstracta);
fillDelitos();

$("#chk-atenuantes").innerHTML = ATENUANTES.map(
  (a, i) => `<label class="check-row"><input type="checkbox" class="at" value="${i}"><span>${a}</span></label>`
).join("");
$("#chk-agravantes").innerHTML = AGRAVANTES.map(
  (a, i) => `<label class="check-row"><input type="checkbox" class="ag" value="${i}"><span>${a}</span></label>`
).join("");
$("#chk-reducciones").innerHTML = REDUCCIONES.map(
  (r) => `<label class="check-row"><input type="checkbox" class="red-chk" value="${r.id}"><span><b>${r.nombre}</b> — <small>${r.regla}</small></span></label>`
).join("");

function setStep(n) {
  for (let i = 1; i <= 4; i++) $("#st-" + i).classList.toggle("on", i <= n);
}
["sel-familia", "sel-delito", "sel-modalidad"].forEach((id) =>
  $("#" + id).addEventListener("change", () => setStep(2))
);
$("#chk-atenuantes").addEventListener("change", () => setStep(3));
$("#chk-agravantes").addEventListener("change", () => setStep(3));

$("#btn-calcular").addEventListener("click", () => {
  const { d, m } = getSeleccion();
  const at = [...$$("#chk-atenuantes input:checked")].map((c) => ATENUANTES[+c.value]);
  const ag = [...$$("#chk-agravantes input:checked")].map((c) => AGRAVANTES[+c.value]);
  const reinc = $("#sel-reincidencia").value;
  const tentativa = $("#sel-consumacion").value === "tentativa";
  const reds = [...$$("#chk-reducciones input:checked")].map((c) => REDUCCIONES.find((r) => r.id === c.value));

  setStep(4);
  $("#resultado-wrap").style.display = "block";

  // Caso cadena perpetua pura
  if (m.perpetua && m.min == null) {
    $("#res-rango").innerHTML = `<h4>Rango de pena</h4><div class="big-range">Cadena perpetua</div>
      <p style="font-size:12.5px;margin-top:6px">${m.nota || ""} El sistema de tercios no se aplica a la cadena perpetua.</p>`;
    $("#res-detalle").innerHTML = `<h4>Justificación</h4><p style="font-size:13px">La modalidad seleccionada contempla cadena perpetua. Cualquier variación depende de la calificación definitiva de los hechos y del debate judicial.</p>`;
    $("#res-escenarios").style.display = "none";
    renderCompetencia(d, m);
    $("#resultado-wrap").scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Sistema de tercios (art. 45-A)
  const span = m.max - m.min;
  const t = span / 3;
  let tercio, tMin, tMax, justif;
  if (ag.length > 0 && at.length === 0) {
    tercio = "Superior"; tMin = m.min + 2 * t; tMax = m.max;
    justif = "Solo circunstancias agravantes";
  } else if (ag.length > 0 && at.length > 0) {
    tercio = "Intermedio"; tMin = m.min + t; tMax = m.min + 2 * t;
    justif = "Concurren atenuantes y agravantes";
  } else {
    tercio = "Inferior"; tMin = m.min; tMax = m.min + t;
    justif = at.length > 0 ? "Solo circunstancias atenuantes" : "Ausencia de atenuantes y agravantes";
  }

  // Reincidencia / habitualidad (agravantes cualificadas — referencial)
  let notaReinc = "";
  if (reinc !== "no") {
    notaReinc = `<div class="kv"><span>Agravante cualificada</span><b>${reinc === "reincidencia" ? "Reincidencia (art. 46-B)" : "Habitualidad (art. 46-C)"}</b></div>
      <p style="font-size:12px;color:var(--amber-600);padding:6px 0">⚠️ Permite incrementar la pena por encima del máximo legal en la proporción prevista por la ley vigente. Verifique el texto actual de los arts. 46-B / 46-C.</p>`;
  }

  // Tentativa
  let notaTent = "";
  if (tentativa) {
    notaTent = `<div class="kv"><span>Grado de ejecución</span><b>Tentativa (art. 16)</b></div>
      <p style="font-size:12px;color:var(--amber-600);padding:6px 0">⚠️ El juez reduce prudencialmente la pena, pudiendo fijarse por debajo del mínimo. La Ley 32258 (2026) modificó el tratamiento de la tentativa: verifique el texto vigente.</p>`;
  }

  $("#res-rango").innerHTML = `<h4>Rango de pena</h4>
    <div class="big-range">${fmtAnios(tMin)} a ${fmtAnios(tMax)}</div>
    <small style="color:var(--text-muted)">de pena privativa de libertad${tentativa ? " (antes de la reducción por tentativa)" : ""}</small>
    <div style="margin-top:10px">
      <div class="kv"><span>Tercio aplicado</span><b>${tercio}</b></div>
      <div class="kv"><span>Justificación</span><b>${justif}</b></div>
    </div>`;

  $("#res-detalle").innerHTML = `<h4>Detalle del cálculo</h4>
    <div class="kv"><span>Pena abstracta</span><b>${fmtAnios(m.min)} a ${fmtAnios(m.max)}</b></div>
    <div class="kv"><span>Atenuantes marcadas</span><b>${at.length}</b></div>
    <div class="kv"><span>Agravantes marcadas</span><b>${ag.length}</b></div>
    ${notaReinc}${notaTent}
    ${m.perpetua ? '<p style="font-size:12px;color:var(--red-600);padding:6px 0">La modalidad admite supuestos de cadena perpetua según las circunstancias.</p>' : ""}
    <div class="kv"><span>Reparación civil</span><b>A determinar en juicio</b></div>`;

  // Escenarios con bonificaciones procesales
  if (reds.length > 0) {
    const media = (tMin + tMax) / 2;
    const items = reds.map((r) => {
      let est;
      if (r.sobre === "min") {
        est = `${fmtAnios(Math.max(0, m.min - m.min * r.factor))} (hasta 1/3 por debajo del mínimo legal)`;
      } else {
        est = `${fmtAnios(media * (1 - r.factor))} aprox. sobre una pena concreta media de ${fmtAnios(media)}`;
      }
      return `<div class="kv"><span><b>${r.nombre}</b><br><small style="color:var(--text-muted)">${r.regla}</small></span><b style="white-space:nowrap;margin-left:10px">≈ ${est}</b></div>`;
    });
    $("#res-escenarios").style.display = "block";
    $("#res-escenarios").innerHTML = `<h4>Escenarios con bonificación procesal</h4>${items.join("")}
      <p style="font-size:12px;padding-top:6px">Las bonificaciones no son automáticas: dependen de la oportunidad procesal, de la aprobación judicial y de las exclusiones legales.</p>`;
  } else {
    $("#res-escenarios").style.display = "none";
  }

  renderCompetencia(d, m);
  $("#resultado-wrap").scrollIntoView({ behavior: "smooth" });
});

function renderCompetencia(d, m) {
  const fis = FISCALIAS[d.fiscalia] || FISCALIAS["penal-comun"];
  $("#res-competencia").innerHTML = `<h4 style="color:var(--navy-800)">Competencia preliminar</h4>
    <div class="kv"><span>Fiscalía posiblemente competente</span></div>
    <p style="font-size:13.5px"><b>${fis.nombre}</b></p>
    <p style="font-size:12.5px;color:var(--text-muted)">${fis.desc}</p>
    <div class="kv" style="margin-top:8px"><span>Órgano de juzgamiento</span><b style="text-align:right">${organoJudicial(m)}</b></div>
    <p style="font-size:12px;color:var(--text-muted);padding-top:6px">La competencia definitiva depende del territorio, la condición de la persona y la etapa. Verifique el directorio oficial del distrito fiscal en gob.pe/mpfn.</p>`;

  $("#res-plazos").innerHTML = `<h4>Plazos aplicables (referenciales)</h4>
    <div class="kv"><span>Investigación preliminar</span><b>60 días</b></div>
    <div class="kv"><span>Investigación preparatoria</span><b>120 días (+60)</b></div>
    <div class="kv"><span>Caso complejo</span><b>8 meses (+8)</b></div>
    <div class="kv"><span>Criminalidad organizada</span><b>36 meses (+36)</b></div>
    <div class="kv"><span>Decisión fiscal final</span><b>15 días</b></div>
    <a href="#plazos" onclick="goPage('plazos');return false" style="font-size:12.5px">Ver calculadora de plazos →</a>`;
}

// ---------- procedimiento ----------
$("#flow-completo").innerHTML = PROCEDIMIENTO.map(
  (p) => `<div class="flow-step"><span class="ic">${p.icono}</span><b>${p.nombre}</b><span style="font-size:11.5px;color:var(--text-muted)">${p.desc}</span></div>`
).join('<div class="flow-arrow">→</div>');

// ---------- plazos ----------
$("#tabla-plazos").innerHTML = PLAZOS.map(
  (p) => `<tr><td><b>${p.etapa}</b></td><td><span class="badge">${p.plazo}</span></td><td>${p.prorroga}</td></tr>`
).join("");
$("#tabla-pp").innerHTML = PRISION_PREVENTIVA.map(
  (p) => `<tr><td>${p.tipo}</td><td><span class="badge amber">${p.plazo}</span></td></tr>`
).join("");

$("#inp-fecha-inicio").valueAsDate = new Date();

$("#btn-plazo").addEventListener("click", () => {
  const tipo = PLAZOS[+$("#sel-plazo-tipo").value];
  const inicioStr = $("#inp-fecha-inicio").value;
  const conProrroga = $("#chk-prorroga").checked;
  const panel = $("#res-plazo-panel");
  if (!inicioStr) {
    panel.innerHTML = '<div class="panel amber"><h4>Falta información</h4><p style="font-size:13px">Indique la fecha de inicio para calcular el vencimiento.</p></div>';
    return;
  }
  const inicio = new Date(inicioStr + "T00:00:00");
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

  panel.innerHTML = `
    <div class="panel green"><h4>Vencimiento estimado</h4>
      <div class="big-range" style="font-size:22px">${fmt(venc)}</div>
      <div style="margin-top:8px">
        <div class="kv"><span>Etapa</span><b>${tipo.etapa}</b></div>
        <div class="kv"><span>Plazo legal</span><b>${tipo.plazo}${conProrroga ? " + prórroga" : ""}</b></div>
        <div class="kv"><span>Días transcurridos</span><b>${transcurridos}</b></div>
        <div class="kv"><span>Días restantes</span><b style="color:${restantes < 0 ? "var(--red-600)" : restantes < 15 ? "var(--amber-600)" : "var(--green-600)"}">${restantes < 0 ? "Plazo vencido hace " + Math.abs(restantes) + " días" : restantes}</b></div>
      </div>
    </div>
    <div class="panel amber" style="font-size:12px"><h4>Advertencia</h4>
      El cómputo real puede variar por detención, suspensión, declaración de complejidad, nulidades o disposiciones fiscales que fijen un plazo distinto. Este resultado es solo una estimación con días naturales.</div>`;
});

// ---------- medidas ----------
$("#grid-medidas").innerHTML = MEDIDAS_COERCITIVAS.map(
  (m) => `<div class="panel"><h4 style="color:var(--navy-800)">${m.nombre}</h4><p style="font-size:12.5px;color:var(--text-muted)">${m.desc}</p></div>`
).join("");

// ---------- fiscalías ----------
$("#grid-fiscalias").innerHTML = FISCALIAS_LISTA.map(
  (f) => `<div class="panel blue" style="padding:12px 14px"><p style="font-size:13px"><b>${f}</b></p></div>`
).join("");

// ---------- normativa ----------
$("#tabla-normas").innerHTML = NORMAS_BASE.map(
  (n) => `<tr><td style="white-space:nowrap"><b>${n.norma}</b></td><td>${n.contenido}</td></tr>`
).join("");
$("#tabla-normas-recientes").innerHTML = NORMAS_RECIENTES.map(
  (n) => `<tr><td style="white-space:nowrap"><span class="badge green">${n.norma}</span></td><td>${n.contenido}</td></tr>`
).join("");

// ---------- fuentes ----------
$("#grid-fuentes").innerHTML = FUENTES_OFICIALES.map(
  (f) => `<div class="panel src-card"><span class="lvl">${f.nivel}</span><h5>${f.nombre}</h5><p>${f.uso}</p><a href="${f.url}" target="_blank" rel="noopener">Visitar fuente oficial ↗</a></div>`
).join("");
