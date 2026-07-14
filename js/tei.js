/* JustiPenal — interfaz y verificador determinista de técnicas especiales. */
(function () {
  "use strict";
  const data = window.TEI_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
  const source = (id) => data.sources[id];
  const sourceLink = (id, label) => {
    const item = source(id);
    return item ? `<a class="btn small secondary tei-source" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" title="${esc(item.publisher)} — ${esc(item.status)}">${esc(label || item.title)} ↗</a>` : "";
  };
  const list = (items) => `<ul class="list-check">${(items || []).map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;

  function renderOverview() {
    const counts = data.records.reduce((result, item) => ((result[item.category] = (result[item.category] || 0) + 1), result), {});
    $("#tei-category-overview").innerHTML = Object.entries(data.CATEGORIES).map(([key, item]) => `
      <article class="card tei-category-card">
        <span class="tei-category-count">${counts[key] || 0}</span>
        <h4>${esc(item.short)}</h4><p>${esc(item.description)}</p>
        ${key === "proceso" ? '<strong>Colaboración eficaz no constituye una técnica especial de investigación.</strong>' : ""}
      </article>`).join("");
    $("#tei-filter-category").insertAdjacentHTML("beforeend", Object.entries(data.CATEGORIES).map(([key, value]) => `<option value="${key}">${esc(value.short)}</option>`).join(""));
  }

  function cardHTML(item) {
    const judicial = item.judicialAuthorization === "si" ? "Sí" : item.judicialAuthorization === "no" ? "No ordinariamente" : "Cuando se afecten derechos fundamentales";
    const category = data.CATEGORIES[item.category];
    return `<article class="tei-record" data-record="${esc(item.id)}">
      <div class="tei-record-head"><div><span class="badge ${item.category === "proceso" ? "amber" : item.category === "estricta" ? "green" : ""}">${esc(category.short)}</span><h4>${esc(item.name)}</h4></div><span class="tei-review">Revisión: ${esc(item.lastReviewed)}</span></div>
      <p>${esc(item.shortDefinition)}</p>
      ${item.aliases.length ? `<p class="tei-alias"><b>Término relacionado:</b> ${esc(item.aliases.join(", "))}. Es una denominación explicativa; no una técnica estatutaria independiente.</p>` : ""}
      <div class="tei-card-facts"><span><b>Base:</b> ${esc(item.legalBases.join("; "))}</span><span><b>Propone:</b> ${esc(item.proposingAuthority)}</span><span><b>Autoriza:</b> ${esc(item.authorizingAuthority)}</span><span><b>Control judicial:</b> ${esc(judicial)}</span></div>
      <div class="tei-card-actions">${item.officialSources.map((id, index) => sourceLink(id, index ? source(id)?.title : "Fuente oficial")).join("")}</div>
      <details><summary>Ver presupuestos, límites y tratamiento probatorio</summary>
        <div class="tei-details-grid"><div><h5>Casos comprendidos</h5>${list(item.applicableOffenses.length ? item.applicableOffenses : ["Depende del supuesto legal específico"])}<h5>Presupuestos centrales</h5>${list(item.prerequisites)}</div>
        <div><h5>Naturaleza jurídica</h5><p>${esc(item.legalNature)}</p><h5>Subsidiariedad y necesidad</h5><p>${esc(item.subsidiarityRequirement)}</p><h5>Duración y prórroga</h5><p>${esc(item.maximumDuration)} ${esc(item.extensionRules)}</p></div>
        <div><h5>Límites principales</h5>${list(item.operationalLimits)}<h5>Usos prohibidos</h5>${list(item.prohibitedUses)}</div>
        <div><h5>Prueba y cadena de custodia</h5>${list(item.evidenceRequirements)}<p>${esc(item.chainOfCustodyNotes)}</p><h5>Ley temporal</h5><p>${esc(item.temporalLawNotes)}</p></div></div>
        <div class="panel amber tei-public-limit"><b>Límite de contenido público:</b> ${esc(item.publicContentLimitations)}</div>
      </details>
    </article>`;
  }

  function renderRecords() {
    const query = $("#tei-search").value.trim().toLocaleLowerCase("es");
    const category = $("#tei-filter-category").value;
    const offense = $("#tei-filter-offense").value;
    const stage = $("#tei-filter-stage").value;
    const judicial = $("#tei-filter-judicial").value;
    const checkedTags = [...document.querySelectorAll("#tei-filters fieldset input:checked")].map((input) => input.value);
    const filtered = data.records.filter((item) => {
      const searchable = [item.name, item.shortDefinition, item.legalNature, ...item.legalBases, ...item.aliases].join(" ").toLocaleLowerCase("es");
      return (!query || searchable.includes(query)) && (!category || item.category === category) && (!offense || item.applicableOffenses.includes(offense)) && (!stage || item.proceduralStage.includes(stage)) && (!judicial || item.judicialAuthorization === judicial) && checkedTags.every((tag) => item.tags[tag]);
    });
    $("#tei-result-count").textContent = `${filtered.length} ${filtered.length === 1 ? "registro encontrado" : "registros encontrados"}.`;
    $("#tei-card-list").innerHTML = filtered.length ? filtered.map(cardHTML).join("") : '<div class="panel amber">No hay coincidencias. Quite uno o más filtros o revise el término de búsqueda.</div>';
  }

  function temporalWarning(date) {
    if (!date) return "No se indicó la fecha de los hechos: verifique la norma vigente y la regla temporal aplicable.";
    const value = new Date(`${date}T00:00:00`);
    const change = new Date("2024-08-09T00:00:00");
    if (value < change) return "Los hechos son anteriores a las reformas de 2024 de la Ley 30077. No aplique retroactivamente una definición desfavorable; verifique la norma temporal y la favorabilidad.";
    return "Verifique la definición y el catálogo de la Ley 30077 según las Leyes 32108 y 32138, sin inferir organización criminal solo por la participación de tres o más personas.";
  }

  function checkerValues() {
    const checked = (id) => $(id).checked;
    return {
      technique: $("#tei-technique").value, date: $("#tei-facts-date").value, stage: $("#tei-stage").value,
      offense: $("#tei-offense").value, penalty: $("#tei-penalty").value === "" ? null : Number($("#tei-penalty").value),
      band: checked("#tei-band"), org: checked("#tei-org"), trafficking: checked("#tei-trafficking"), publicOffense: checked("#tei-public"), extortion: checked("#tei-extortion"), goods: checked("#tei-goods"), digital: checked("#tei-digital"), transnational: checked("#tei-transnational"), conventional: checked("#tei-conventional"), rights: checked("#tei-rights"), home: checked("#tei-home"), comms: checked("#tei-comms"), financial: checked("#tei-financial"), danger: checked("#tei-danger"), flagrante: checked("#tei-flagrante"), device: checked("#tei-device"), insufficiency: $("#tei-insufficiency").value.trim()
    };
  }

  function evaluate(v) {
    const item = data.records.find((entry) => entry.id === v.technique);
    const missing = [], risks = [], warnings = [];
    let status = "Aplicable con condiciones";
    let fiscal = "Sí: actuación y motivación fiscal conforme a la norma específica.";
    let judicial = item.judicialAuthorization === "si" ? "Sí, autorización o confirmación judicial según el artículo aplicable." : "Cuando se afecten derechos fundamentales.";
    const art341 = ["agente-encubierto","agente-especial","agente-revelador","agente-virtual","informante"].includes(item.id);
    const eligible341 = v.band || v.org || v.trafficking || v.publicOffense || ["trata","corrupcion"].includes(v.offense);

    if (!v.stage || !v.offense) missing.push("Etapa procesal y delito sospechado");
    if (v.band && !v.org) warnings.push("Una banda criminal no equivale automáticamente a organización criminal; tampoco basta la participación de tres o más personas.");
    if (v.extortion && art341) warnings.push("El DS 009-2025-IN no autoriza automáticamente técnicas del art. 341: debe cumplirse su ámbito legal y todos sus presupuestos.");
    if (v.rights || v.home || v.comms || v.financial) risks.push("Posible afectación de derechos fundamentales: se exige control judicial en los supuestos legales; la urgencia no lo elimina.");
    if (v.home) risks.push("El ingreso o videovigilancia dentro de domicilio o lugar cerrado requiere autorización judicial.");
    if (v.comms) risks.push("Secreto de las comunicaciones y privacidad.");
    if (v.financial) risks.push("Secreto bancario o reserva tributaria: decisión judicial a solicitud fiscal.");

    if (art341) {
      if (!eligible341) { status = "No aparece jurídicamente sustentado"; missing.push("Ámbito del CPP art. 341: banda u organización criminal bajo Ley 30077, trata de personas o delito de los arts. 382–401 CP"); }
      if (!v.conventional) missing.push("Constancia de técnicas convencionales intentadas o evaluadas");
      if (v.insufficiency.length < 20) missing.push("Justificación suficiente de por qué los medios convencionales son insatisfactorios o insuficientes");
      warnings.push("La actuación debe ser idónea, necesaria e indispensable y requiere disposición fiscal motivada.", "El agente no puede provocar manifiestamente el delito; una exención solo cubre actos necesarios y proporcionales resultantes de la investigación autorizada.");
    } else if (item.id === "entrega-vigilada") {
      if (!v.goods) { status = "No aparece jurídicamente sustentado"; missing.push("Bien delictivo expresamente comprendido por el CPP art. 340"); }
      warnings.push("La autorización fiscal debe ser motivada y emitirse caso por caso. «Remesa controlada» no es una técnica estatutaria independiente.");
    } else if (item.id === "operaciones-encubiertas") {
      if (v.stage !== "preliminar") missing.push("Aplicación durante diligencias preliminares");
      if (!(v.org || v.trafficking || v.publicOffense || ["trata","corrupcion"].includes(v.offense))) { status = "No aparece jurídicamente sustentado"; missing.push("Crimen organizado, trata de personas o delito de los arts. 382–401 CP"); }
    } else if (item.id === "videovigilancia") {
      const violent = ["extorsion","sicariato","secuestro"].includes(v.offense);
      if (!(violent || v.org)) missing.push("Delito violento, grave o de organización criminal e indispensabilidad o seria dificultad investigativa");
      warnings.push("El CPP art. 207 no fija un umbral numérico de pena para «delito grave».");
      if (v.home) judicial = "Sí: videovigilancia dentro de domicilio o lugar cerrado requiere autorización judicial.";
    } else if (item.id === "comunicaciones") {
      if (v.penalty == null) missing.push("Pena legal aplicable"); else if (v.penalty <= 4) { status = "No aparece jurídicamente sustentado"; missing.push("Delito sancionado con pena superior a cuatro años"); }
      missing.push(...(!v.comms ? ["Necesidad concreta de interceptar comunicaciones"] : []));
      judicial = "Sí: requerimiento fiscal y autorización judicial. Máximo 60 días; prórrogas judiciales motivadas.";
      warnings.push("Deben existir suficientes elementos de convicción y necesidad absoluta. La vía urgente del art. 230 es solo la expresamente autorizada por ley.");
    } else if (item.id === "revision-dispositivos") {
      const eligible = ["extorsion","sicariato","secuestro"].includes(v.offense);
      if (!eligible) { status = "No aparece jurídicamente sustentado"; missing.push("Delito elegible: extorsión, sicariato o secuestro"); }
      if (!v.flagrante) { status = "No aparece jurídicamente sustentado"; missing.push("Flagrancia delictiva"); }
      if (!v.device) { status = "No aparece jurídicamente sustentado"; missing.push("Equipo informático incautado"); }
      judicial = "Autorización fiscal previa y confirmación judicial posterior; ambas son necesarias en el esquema del art. 230-A.";
      warnings.push("Debe justificarse indispensabilidad y preservarse la evidencia digital.");
    } else if (["secreto-bancario","reserva-tributaria"].includes(item.id)) {
      if (!v.financial) missing.push("Necesidad concreta y pertinencia de información financiera o tributaria");
      judicial = "Sí: resolución judicial a solicitud motivada del fiscal.";
    } else if (item.id === "clausura-vigilancia-inmovilizacion") {
      judicial = "Sí. En el supuesto urgente expreso del art. 241, confirmación judicial dentro de 24 horas.";
      warnings.push("La urgencia del art. 241 no se extiende por analogía a otras medidas.");
    } else if (item.id === "revelacion-delito") {
      warnings.push("Debe distinguirse de la entrega vigilada, los agentes del art. 341 y el agente provocador. Presupone un delito en curso o preexistente y no permite provocarlo.");
    } else if (item.id === "colaboracion-eficaz") {
      fiscal = "Conducción fiscal del proceso especial; el acuerdo se somete a aprobación judicial.";
      judicial = "Sí, para la aprobación del acuerdo y demás controles legalmente previstos.";
      warnings.push("Es un proceso especial, no una técnica especial ni una variante del agente encubierto.", "La información debe corroborarse; la declaración de un aspirante no se corrobora únicamente con la de otro aspirante.", "Aplican los límites temporales reformados entre 2024 y 2026.");
    }

    if (missing.length && status === "Aplicable con condiciones" && (!v.stage || !v.offense)) status = "Información insuficiente";
    if (!missing.length && status !== "No aparece jurídicamente sustentado") status = "Aplicable";
    return { item, status, missing:[...new Set(missing)], risks:[...new Set(risks)], warnings:[...new Set(warnings)], fiscal, judicial, temporal:temporalWarning(v.date) };
  }

  function renderEvaluation(result) {
    const tone = result.status === "Aplicable" ? "green" : result.status === "No aparece jurídicamente sustentado" ? "red" : "amber";
    return `<div class="panel ${tone}"><span class="tei-status">${esc(result.status)}</span><h4>${esc(result.item.name)}</h4><p><b>Base legal:</b> ${esc(result.item.legalBases.join("; "))}</p></div>
      <div class="tei-eval-grid"><div><h5>Ámbito legal aplicable</h5><p>${esc(result.item.legalNature)}</p><h5>Requisitos faltantes</h5>${result.missing.length ? list(result.missing) : "<p>No se identificaron faltantes en las respuestas; esto no sustituye la verificación del expediente.</p>"}</div>
      <div><h5>Autorización fiscal</h5><p>${esc(result.fiscal)}</p><h5>Autorización o confirmación judicial</h5><p>${esc(result.judicial)}</p></div>
      <div><h5>Advertencia temporal</h5><p>${esc(result.temporal)}</p><h5>Riesgos de derechos fundamentales</h5>${result.risks.length ? list(result.risks) : "<p>Evalúe de todos modos privacidad, inviolabilidad, defensa y proporcionalidad.</p>"}</div>
      <div><h5>Evidencia y cadena de custodia</h5><p>${esc(result.item.chainOfCustodyNotes)}</p>${list(result.warnings)}</div></div>
      <div class="tei-card-actions">${result.item.officialSources.map((id) => sourceLink(id)).join("")}</div>
      <div class="disclaimer"><b>Resultado educativo, no vinculante.</b> No constituye autorización ni asesoría legal. La decisión requiere análisis fiscal y, cuando corresponda, judicial del caso concreto. No ingrese ni conserve aquí información real o reservada.</div>`;
  }

  function renderMatrix() {
    $("#tei-matrix").innerHTML = `<table class="tbl"><thead><tr><th>Supuesto educativo</th><th>Posibles relaciones</th><th>Límite</th></tr></thead><tbody>${data.matrix.map((row) => `<tr><td><b>${esc(row.crime)}</b></td><td>${esc(row.techniques)}</td><td><span class="badge amber">Posible relación. No constituye autorización automática.</span></td></tr>`).join("")}</tbody></table>`;
  }
  function renderWorkflow() {
    $("#tei-workflow").innerHTML = data.workflow.map((step, index) => `<div class="tei-flow-step"><span>${index + 1}</span><b>${esc(step)}</b></div>`).join("");
  }
  function renderTimeline() {
    $("#tei-timeline").innerHTML = data.timeline.map((item) => `<article class="tei-time-item"><div class="tei-time-date">${esc(item.date)}</div><div><h4>${esc(item.norm)}</h4><p><b>${esc(item.topic)}.</b> ${esc(item.effect)}</p><p><b>Estado:</b> ${esc(item.status)}</p><small>Última revisión editorial: ${esc(item.reviewed)}${item.verify ? " · Requiere cotejo manual indicado en la entrega" : ""}</small><div class="tei-card-actions">${sourceLink(item.source, "Fuente oficial")}</div></div></article>`).join("");
  }

  renderOverview(); renderRecords(); renderMatrix(); renderWorkflow(); renderTimeline();
  $("#tei-filters").addEventListener("input", renderRecords);
  $("#tei-technique").innerHTML = data.records.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("");
  $("#tei-checker").addEventListener("submit", (event) => {
    event.preventDefault();
    const result = evaluate(checkerValues());
    const target = $("#tei-checker-result");
    target.innerHTML = renderEvaluation(result);
    target.focus({ preventScroll:true });
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"nearest" });
  });
  window.JustiPenalTEI = { evaluate };
})();
