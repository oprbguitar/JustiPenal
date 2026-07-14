import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadFiscalData() {
  const code = await readFile(new URL("../js/data.js", import.meta.url), "utf8");
  const context = {};
  vm.runInNewContext(`${code}\n;globalThis.__fiscalData = { FISCALIAS, FISCALIAS_UI_ORDER };`, context);
  return context.__fiscalData;
}

test("el directorio fiscal tiene una sola fuente ordenada con 15 especialidades reales", async () => {
  const { FISCALIAS, FISCALIAS_UI_ORDER } = await loadFiscalData();
  assert.equal(FISCALIAS_UI_ORDER.length, 15);
  assert.equal(new Set(FISCALIAS_UI_ORDER).size, FISCALIAS_UI_ORDER.length);
  for (const id of FISCALIAS_UI_ORDER) {
    assert.ok(FISCALIAS[id], `falta la especialidad ${id}`);
    assert.equal(FISCALIAS[id].showInDirectory, true, `${id} no está marcada para el directorio`);
    for (const field of ["nombre", "desc", "atiende", "necesidades", "herramientas", "baseNormativa"]) {
      assert.ok(FISCALIAS[id][field], `${id}: falta ${field}`);
    }
  }
  assert.equal(FISCALIAS["accion-privada"].showInDirectory, false);
  assert.ok(!FISCALIAS_UI_ORDER.includes("accion-privada"));
});

test("conserva las fuentes oficiales específicas solicitadas", async () => {
  const { FISCALIAS } = await loadFiscalData();
  assert.equal(FISCALIAS.corrupcion.fuenteEspecifica, "https://www.gob.pe/11414");
  assert.equal(FISCALIAS["extincion-dominio"].fuenteEspecifica, "https://www.gob.pe/16918");
});

test("la interfaz enlaza navegación interna, directorio oficial y contacto contextual", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../js/app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8")
  ]);
  for (const page of ["delitos", "analizar", "fiscalias", "plazos", "normativa"]) {
    assert.match(app, new RegExp(`page: "${page}"`));
  }
  assert.match(app, /FISCALIAS_UI_ORDER\.length/);
  assert.match(app, /directorio-fiscalias/);
  assert.match(app, /rel="noopener noreferrer"/);
  assert.match(app, /consultas@andesnova\.solutions/);
  assert.match(app, /No incluya nombres, DNI, expedientes ni información confidencial/);
  assert.doesNotMatch(html, /professional-capabilities\.js/);
});
