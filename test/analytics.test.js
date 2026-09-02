import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GoatCounter is loaded and allowed by the production CSP", async () => {
  const [html, app, vercel] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("js/app.js", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
  ]);

  assert.match(html, /data-goatcounter="https:\/\/oprbguitar\.goatcounter\.com\/count"/);
  assert.match(html, /src="https:\/\/gc\.zgo\.at\/count\.js"/);
  assert.match(app, /window\.goatcounter\.count\(\{ path: "\/" \+ id/);

  const config = JSON.parse(vercel);
  const csp = config.headers
    .flatMap((entry) => entry.headers)
    .find((header) => header.key === "Content-Security-Policy-Report-Only")?.value;

  assert.ok(csp?.includes("script-src 'self' https://unpkg.com https://cdn.jsdelivr.net https://gc.zgo.at"));
  assert.ok(csp?.includes("https://oprbguitar.goatcounter.com/count"));
});
