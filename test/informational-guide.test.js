import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

test("retira el analizador público y conserva el redireccionamiento histórico", async () => {
  const [html, app] = await Promise.all([readFile(new URL("index.html", root), "utf8"), readFile(new URL("js/app.js", root), "utf8")]);
  for (const pattern of [/Analizar Caso/i, /Analizar un caso/i, /Analizar mi caso/i, /Análisis de casos?/i, /Analizador de casos/i, /Patrones del analizador/i, /page-analizar/i, /data-page="analizar"/i, /href="#analizar"/i]) assert.doesNotMatch(html, pattern);
  assert.match(app, /location\.hash === "#analizar"/);
  assert.match(app, /history\.replaceState\(null, "", "#guia"\)/);
});

test("la guía incluye las seis etapas y navegación accesible", async () => {
  const [html, data, app] = await Promise.all([readFile(new URL("index.html", root), "utf8"), readFile(new URL("js/data.js", root), "utf8"), readFile(new URL("js/app.js", root), "utf8")]);
  assert.match(html, /id="page-guia"/); assert.match(html, /data-page="guia"/); assert.match(html, /Empezar recorrido/); assert.match(html, /El contenido es educativo y referencial/);
  for (let i = 1; i <= 6; i++) assert.match(data, new RegExp(`titulo: "${i}\\.`));
  assert.match(app, /aria-current/);
});

test("el artículo 122-B usa un perfil específico contrastado", async () => {
  const source = await readFile(new URL("js/data.js", root), "utf8");
  const context = {}; vm.createContext(context); vm.runInContext(`${source}\nthis.result={DELITOS,PERFILES_JURIDICOS_ESPECIFICOS,FUENTES_OFICIALES};`, context);
  const delito = context.result.DELITOS.find((item) => item.id === "agresiones-mujer"); const profile = context.result.PERFILES_JURIDICOS_ESPECIFICOS["agresiones-mujer"];
  assert.match(profile.estructura.join(" "), /Verbo rector: causar/); assert.doesNotMatch(profile.estructura.join(" "), /Verbo rector: (matar|agredir)/);
  assert.match(profile.estructura.join(" "), /Resultado físico/); assert.match(profile.estructura.join(" "), /Resultado no físico/); assert.equal(delito.modalidades[0].min, 1); assert.equal(delito.modalidades[1].min, 2);
  assert.match(profile.penasAgravantes.join(" "), /7\) comisión/); assert.match(profile.penasAgravantes.join(" "), /numerales 5 y 11/); assert.match(JSON.stringify(profile.fuentes), /Ley 30819|13 de julio de 2018/);
});

test("las fuentes usan categorías y el validador limita los dominios", async () => {
  const [data, app] = await Promise.all([readFile(new URL("js/data.js", root), "utf8"), readFile(new URL("js/app.js", root), "utf8")]);
  assert.doesNotMatch(data, /Nivel [1-6]/); assert.match(data, /categoria: "Publicación oficial"/); assert.match(data, /ayuda:/);
  assert.match(app, /busquedas\.elperuano\.pe/); assert.match(app, /url\.hostname === host \|\| url\.hostname\.endsWith/); assert.doesNotMatch(app, /officialHosts[^;]*example\.com/);
});
