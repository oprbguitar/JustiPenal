import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadData() {
  const code = await readFile(new URL("../data/tei-data.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.runInNewContext(code, context);
  return context.window.TEI_DATA;
}

test("el catálogo TEI conserva la clasificación y todos los campos jurídicos", async () => {
  const data = await loadData();
  const required = [
    "id", "slug", "name", "category", "shortDefinition", "purpose", "legalNature", "legalBases",
    "applicableOffenses", "proceduralStage", "proposingAuthority", "authorizingAuthority",
    "judicialAuthorization", "prerequisites", "subsidiarityRequirement", "urgencyRules",
    "maximumDuration", "extensionRules", "operationalLimits", "prohibitedUses", "evidenceRequirements",
    "chainOfCustodyNotes", "protectionMeasures", "temporalLawNotes", "recentChanges", "officialSources",
    "lastReviewed", "verificationStatus", "publicContentLimitations"
  ];
  assert.equal(data.records.length, 18);
  assert.deepEqual(
    Object.fromEntries(Object.keys(data.CATEGORIES).map((key) => [key, data.records.filter((item) => item.category === key).length])),
    { estricta: 7, relacionada: 10, proceso: 1 }
  );
  for (const record of data.records) for (const field of required) assert.ok(field in record, `${record.id}: falta ${field}`);
});

test("incluye los términos y límites de clasificación requeridos", async () => {
  const data = await loadData();
  const virtual = data.records.find((item) => item.id === "agente-virtual");
  const delivery = data.records.find((item) => item.id === "entrega-vigilada");
  const collaboration = data.records.find((item) => item.id === "colaboracion-eficaz");
  assert.match(virtual.legalBases.join(" "), /art\. 341/);
  assert.ok(delivery.aliases.includes("remesa controlada"));
  assert.match(delivery.legalBases.join(" "), /art\. 340/);
  assert.equal(collaboration.category, "proceso");
  assert.match(collaboration.shortDefinition, /no constituye una técnica especial de investigación/i);
});
