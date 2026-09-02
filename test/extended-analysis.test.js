import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadData() {
  const code = await readFile(new URL("../js/data.js", import.meta.url), "utf8");
  const context = {};
  vm.runInNewContext(`${code}\n;globalThis.__extended = { DELITOS, FISCALIAS, FISCALIAS_UI_ORDER, PUBLIC_SUPPORT_RESOURCES };`, context);
  return context.__extended;
}

test("los 54 delitos incluyen una ficha segura y el artículo 122-B tiene perfil específico", async () => {
  const { DELITOS } = await loadData();
  const fields = ["estadoPerfil", "resumenTipo", "estructura", "sujetosContexto", "resultadoConsumacion", "penasAgravantes", "fuentes"];
  assert.equal(DELITOS.length, 54);
  for (const delito of DELITOS) {
    for (const field of fields) assert.ok(field in delito.analisis, `${delito.id}: falta ${field}`);
    assert.ok(delito.analisis.fuentes.every((source) => source.url.startsWith("https://") && source.articulo && source.ultimaVerificacion && source.estado));
    if (delito.id !== "agresiones-mujer") assert.match(delito.analisis.estadoPerfil, /pendiente de revisión artículo por artículo/i);
  }
  assert.equal(DELITOS.find((item) => item.id === "agresiones-mujer").analisis.estadoPerfil, "Contrastado con fuente oficial");
});

test("cada fiscalía incluye casuística, gestión y directorio oficial seguro", async () => {
  const { FISCALIAS, FISCALIAS_UI_ORDER } = await loadData();
  const fields = ["casuisticas", "documentosFrecuentes", "peritosYEspecialistas", "entidadesRelacionadas", "riesgosDeGestion", "controlesRecomendados", "directorioApoyo"];
  for (const id of FISCALIAS_UI_ORDER) {
    const fiscalia = FISCALIAS[id];
    for (const field of fields) assert.ok(Array.isArray(fiscalia[field]) && fiscalia[field].length, `${id}: falta ${field}`);
    assert.ok(fiscalia.casuisticas.length >= 3);
    for (const resource of fiscalia.directorioApoyo) {
      assert.match(resource.url, /^https:\/\//);
      assert.ok(resource.nombre && resource.rolReferencial && resource.categoria && resource.acceso && resource.ultimaVerificacion);
    }
  }
});

test("la interfaz y el simulador incorporan los controles solicitados", async () => {
  const [app, simulator, chat, html] = await Promise.all([
    readFile(new URL("../js/app.js", import.meta.url), "utf8"),
    readFile(new URL("../js/case-simulator.js", import.meta.url), "utf8"),
    readFile(new URL("../js/chat.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8")
  ]);
  assert.match(app, /Ver ficha jurídica/);
  assert.match(app, /Resultado y consumación/);
  assert.doesNotMatch(app, /Por qué podría no aplicar/);
  assert.match(simulator, /Estructura coordinada de cobros ilícitos y movimiento de fondos/);
  assert.match(simulator, /Persona A/);
  assert.match(simulator, /pluralidad de personas[\s\S]*no acreditan por sí solos/);
  assert.match(chat, /sessionStorage/);
  assert.match(html, /id="chat-expand"/);
  assert.match(html, /Privacidad y uso/);
});
