import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const HOST = "justipenal.andesnova.solutions";
const KEY_LOCATION = `https://${HOST}/ae96f50a6042d85573a67630ea8cb686.txt`;
const STATE_FILE = new URL("../.indexnow-last-submission", import.meta.url);

if (process.env.INDEXNOW_ENABLED !== "true") {
  console.log("IndexNow está desactivado. Configure INDEXNOW_ENABLED=true para habilitarlo.");
  process.exit(0);
}

const key = process.env.INDEXNOW_KEY || "";
if (key !== "ae96f50a6042d85573a67630ea8cb686") {
  throw new Error("INDEXNOW_KEY no coincide con el archivo de verificación publicado.");
}

const urls = [...new Set((process.env.INDEXNOW_CHANGED_URLS || "").split(",").map((value) => value.trim()).filter(Boolean))].sort();
if (!urls.length) throw new Error("Defina INDEXNOW_CHANGED_URLS con las URL canónicas que cambiaron materialmente.");

for (const value of urls) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== HOST || url.hash || url.pathname.startsWith("/api/")) {
    throw new Error(`URL no apta para IndexNow: ${value}`);
  }
}

const fingerprint = createHash("sha256").update(JSON.stringify({ key, urls })).digest("hex");
const previous = await readFile(STATE_FILE, "utf8").catch(() => "");
if (previous.trim() === fingerprint) {
  console.log("Sin cambios: estas URL ya fueron notificadas.");
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList: urls })
});
if (!response.ok) throw new Error(`IndexNow respondió HTTP ${response.status}.`);
await writeFile(STATE_FILE, `${fingerprint}\n`, "utf8");
console.log(`IndexNow recibió ${urls.length} URL(s) actualizada(s).`);
