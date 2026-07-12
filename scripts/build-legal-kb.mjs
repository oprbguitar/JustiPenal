import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "js", "data.js"), "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nthis.__JP_EXPORT__ = { VERIFICADO_AT, DELITOS, ATENUANTES, AGRAVANTES, REDUCCIONES, CONCURSO_INFO, FISCALIAS, CONDICIONES_PERSONA, PLAZOS, PRISION_PREVENTIVA, MEDIDAS_COERCITIVAS, NORMAS_BASE, NORMAS_RECIENTES, FUENTES_OFICIALES, PROCEDIMIENTO, TEORIA_ELEMENTOS, CHECKLIST_PROBATORIO, DEFENSAS, INSTITUCIONES, GLOSARIO };`, context);

const data = context.__JP_EXPORT__;
const sourceByName = Object.fromEntries(data.FUENTES_OFICIALES.map((item) => [item.nombre, item]));
const spij = sourceByName["SPIJ — Ministerio de Justicia y Derechos Humanos"];
const mpfn = sourceByName["Ministerio Público — Fiscalía de la Nación"];
const elPeruano = sourceByName["Diario Oficial El Peruano"];

const sourceEntry = (item) => ({ name: item.nombre, url: item.url });
const offenseAliases = {
  "hurto-simple": ["hurto", "sustracción sin violencia"],
  "hurto-agravado": ["hurto", "sustracción agravada"],
  "robo-simple": ["robo", "apoderamiento con violencia", "apoderamiento con amenaza"],
  "robo-agravado": ["robo", "asalto", "apoderamiento con arma"],
  lavado: ["lavado de activos", "lavado de dinero"],
  tid: ["tráfico ilícito de drogas", "drogas"],
  extorsion: ["extorsión", "cobro de cupos"]
};

const kb = {
  schemaVersion: 1,
  editorialVerificationDate: data.VERIFICADO_AT,
  scope: "Catálogo legal verificado y ya publicado por JustiPenal; no es exhaustivo.",
  offenses: data.DELITOS.map((offense) => ({
    id: offense.id,
    type: "offense",
    family: offense.familia,
    name: offense.nombre,
    article: offense.articulo,
    aliases: offenseAliases[offense.id] || [],
    verificationStatus: offense.sello,
    verifiedAt: data.VERIFICADO_AT,
    modalities: offense.modalidades,
    prosecutorialSpecialtyId: offense.fiscalia,
    prosecutorialNote: offense.fiscaliaNorma || null,
    effectiveNote: offense.vigenteDesde || null,
    sources: [{ name: offense.fuente.norma, url: offense.fuente.url }]
  })),
  sentencingRules: [
    {
      id: "penalty-thirds",
      type: "sentencing-rule",
      name: "Sistema de tercios",
      article: "Art. 45-A del Código Penal",
      aliases: ["tercios", "tercio inferior", "tercio intermedio", "tercio superior", "individualización de la pena"],
      text: "JustiPenal divide el marco penal en tres partes. Solo atenuantes o ninguna circunstancia computable ubican el rango en el tercio inferior; atenuantes y agravantes, en el intermedio; solo agravantes computables, en el superior. El resultado es un rango referencial, no una pena judicial concreta.",
      sources: [sourceEntry(spij)]
    },
    {
      id: "attempt",
      type: "sentencing-rule",
      name: "Tentativa",
      article: "Art. 16 del Código Penal; Ley 32258",
      aliases: ["tentativa", "delito intentado", "no consumado"],
      text: "La reducción es prudencial y exige decisión judicial motivada. JustiPenal no calcula automáticamente su magnitud ni reemplaza la valoración judicial.",
      sources: [sourceEntry(spij), sourceEntry(elPeruano)]
    },
    {
      id: "recidivism-habituality",
      type: "sentencing-rule",
      name: "Reincidencia y habitualidad",
      article: "Arts. 46-B y 46-C del Código Penal",
      aliases: ["reincidencia", "habitualidad", "antecedentes"],
      text: "Son agravantes cualificadas legalmente condicionadas. No se calculan sin antecedentes verificables y valoración judicial.",
      sources: [sourceEntry(spij)]
    },
    {
      id: "participation",
      type: "sentencing-rule",
      name: "Participación",
      article: "Código Penal",
      aliases: ["autor", "coautor", "cómplice", "participación"],
      text: "La participación específica de cada interviniente requiere información y prueba; el analizador local la trata como información faltante cuando detecta pluralidad de agentes.",
      sources: [sourceEntry(spij)]
    }
  ],
  concurrenceRules: Object.entries(data.CONCURSO_INFO).map(([id, rule]) => ({
    id,
    type: "concurrence-rule",
    name: rule.nombre,
    aliases: ["concurso", "concurrencia de delitos", id],
    text: rule.regla,
    sources: [sourceEntry(spij)]
  })),
  genericCircumstances: {
    mitigating: data.ATENUANTES,
    aggravating: data.AGRAVANTES,
    proceduralReductions: data.REDUCCIONES
  },
  proceduralDeadlines: data.PLAZOS.map((deadline, index) => ({
    id: `deadline-${index + 1}`,
    type: "procedural-deadline",
    name: deadline.etapa,
    aliases: [deadline.etapa, deadline.base, "plazo", "duración"],
    deadline: deadline.plazo,
    legalBasis: deadline.base,
    extension: deadline.prorroga,
    sources: [sourceEntry(spij)]
  })),
  preventiveDetentionDeadlines: data.PRISION_PREVENTIVA.map((deadline, index) => ({
    id: `preventive-detention-${index + 1}`,
    type: "preventive-detention-deadline",
    name: `Prisión preventiva — ${deadline.tipo}`,
    aliases: ["prisión preventiva", deadline.tipo],
    deadline: deadline.plazo,
    text: "La prisión preventiva es una medida excepcional, no una pena.",
    sources: [sourceEntry(spij)]
  })),
  prosecutorialSpecialties: Object.entries(data.FISCALIAS).map(([id, specialty]) => ({
    id,
    type: "prosecutorial-specialty",
    name: specialty.nombre,
    aliases: [id.replaceAll("-", " "), "fiscalía", "competencia fiscal"],
    text: specialty.desc,
    competenceRule: "La competencia depende de materia, territorio, condición personal y etapa procesal.",
    sources: [sourceEntry(mpfn)]
  })),
  personalJurisdictionConditions: data.CONDICIONES_PERSONA.filter((item) => item.nota).map((item) => ({
    id: item.id,
    type: "jurisdiction-condition",
    name: item.label,
    aliases: [item.label, "competencia"],
    text: item.nota,
    sources: [sourceEntry(mpfn)]
  })),
  proceduralStages: data.PROCEDIMIENTO.map((stage, index) => ({
    id: `stage-${index + 1}`,
    type: "procedural-stage",
    name: stage.nombre,
    aliases: [stage.nombre, "etapa procesal", "proceso penal"],
    text: stage.desc,
    sources: [sourceEntry(spij)]
  })),
  coerciveMeasures: data.MEDIDAS_COERCITIVAS.map((measure, index) => ({
    id: `measure-${index + 1}`,
    type: "coercive-measure",
    name: measure.nombre,
    aliases: [measure.nombre, "medida coercitiva", "coerción procesal"],
    text: measure.desc,
    sources: [sourceEntry(spij)]
  })),
  baseLegislation: data.NORMAS_BASE.map((law, index) => ({
    id: `base-law-${index + 1}`,
    type: "base-legislation",
    name: law.norma,
    aliases: [law.norma, "normativa", "base legal"],
    text: law.contenido,
    sources: [sourceEntry(spij), sourceEntry(elPeruano)]
  })),
  recentLegislation: data.NORMAS_RECIENTES.map((law, index) => ({
    id: `recent-law-${index + 1}`,
    type: "recent-legislation",
    name: law.norma,
    aliases: [law.norma, law.materia],
    publicationDate: law.publicacion,
    effectiveDate: law.vigencia,
    text: law.materia,
    status: law.estado,
    verifiedAt: law.verificacion,
    sources: [sourceEntry(elPeruano)]
  })),
  caseTheory: [
    {
      id: "case-theory",
      type: "case-theory",
      name: "Teoría del caso — elementos fáctico, jurídico y probatorio",
      aliases: ["teoría del caso", "elemento fáctico", "elemento jurídico", "elemento probatorio", "estrategia del caso"],
      text: data.TEORIA_ELEMENTOS.map((item) => `${item.nombre}: ${item.desc}`).join(" "),
      sources: [sourceEntry(spij)]
    },
    ...Object.entries(data.CHECKLIST_PROBATORIO).map(([familia, items], index) => ({
      id: `evidence-checklist-${index + 1}`,
      type: "evidence-checklist",
      name: `Medios de prueba típicos — ${familia}`,
      aliases: [familia, "prueba", "medios de prueba", "checklist probatorio", "evidencia"],
      text: `Medios de prueba que suelen sustentar los casos de la familia ${familia}: ${items.join("; ")}. Listado referencial: la estrategia probatoria concreta la define la defensa o la fiscalía según el caso.`,
      sources: [sourceEntry(mpfn)]
    })),
    ...data.DEFENSAS.map((item) => ({
      id: `defense-${item.id}`,
      type: "defense-theory",
      name: item.nombre,
      article: item.base,
      aliases: [item.nombre, "defensa", "eximente", "causa de justificación"],
      text: item.texto,
      sources: [sourceEntry(spij)]
    }))
  ],
  legalInstitutions: data.INSTITUCIONES.map((item) => ({
    id: item.id,
    type: "legal-institution",
    name: item.nombre,
    article: item.base,
    aliases: [item.nombre, item.categoria],
    verificationStatus: item.sello,
    verifiedAt: data.VERIFICADO_AT,
    text: item.texto,
    sources: [sourceEntry(spij), sourceEntry(elPeruano)]
  })),
  glossary: data.GLOSARIO.map((item, index) => ({
    id: `glossary-${index + 1}`,
    type: "glossary-term",
    name: item.termino,
    aliases: [item.termino, "glosario", "definición"],
    text: item.def,
    sources: [sourceEntry(spij)]
  })),
  officialSources: data.FUENTES_OFICIALES.map((item, index) => ({
    id: `official-source-${index + 1}`,
    type: "official-source",
    name: item.nombre,
    aliases: [item.nombre, item.nivel, "fuente oficial"],
    text: item.uso,
    level: item.nivel,
    sources: [sourceEntry(item)]
  }))
};

fs.mkdirSync(path.join(root, "data"), { recursive: true });
fs.writeFileSync(path.join(root, "data", "legal-kb.json"), `${JSON.stringify(kb, null, 2)}\n`);
console.log(`Base legal generada: ${kb.offenses.length} delitos; verificación ${kb.editorialVerificationDate}.`);
