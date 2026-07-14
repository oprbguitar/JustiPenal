import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadCatalog() {
  const code = await readFile(new URL("../js/professional-capabilities.js", import.meta.url), "utf8");
  const context = { window: {}, document: undefined };
  vm.runInNewContext(code, context);
  return context.window.JUSTIPENAL_PROFESSIONAL_CAPABILITIES;
}

test("el catálogo profesional usa mailto y no envía ni almacena solicitudes", async () => {
  const catalog = await loadCatalog();
  assert.equal(catalog.CAPABILITIES.length, 8);
  assert.equal(catalog.CONTACT_EMAIL, "contacto@andesnova.solutions");
  assert.ok(catalog.mailto.startsWith("mailto:contacto@andesnova.solutions?"));
  assert.match(decodeURIComponent(catalog.mailto), /Consulta sobre herramientas avanzadas para JustiPenal/);
  assert.match(catalog.BODY, /☐ IA local/);
});
