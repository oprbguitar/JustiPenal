import { cp, mkdir, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputRoot = resolve(projectRoot, ".vercel-static");

if (dirname(outputRoot) !== projectRoot || basename(outputRoot) !== ".vercel-static") {
  throw new Error("La ruta de salida está fuera del proyecto.");
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const directory of ["assets", "css", "data", "js", "public"]) {
  await cp(resolve(projectRoot, directory), resolve(outputRoot, directory), { recursive: true });
}

for (const file of [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "ae96f50a6042d85573a67630ea8cb686.txt"
]) {
  await cp(resolve(projectRoot, file), resolve(outputRoot, file));
}

console.log("Salida estática de Vercel preparada sin archivos internos ni metadatos del repositorio.");
