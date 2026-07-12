/* ============================================================
   JustiPenal — Base de datos referencial
   Fuentes: Código Penal (D. Leg. 635) y modificatorias,
   Código Procesal Penal (D. Leg. 957), Ley 30077, DL 1106,
   Ley 30096, DL 813, DL 1735, Ley 32258, Ley 32130.
   Verificado contra fuentes oficiales al 12 de julio de 2026.
   Los rangos son REFERENCIALES: siempre debe verificarse el
   texto vigente en SPIJ / El Peruano a la fecha del hecho.
   ============================================================ */

const DELITOS = [
  // ---- Vida, el cuerpo y la salud ----
  { id: "hom-simple", familia: "Vida, el cuerpo y la salud", nombre: "Homicidio simple", articulo: "Art. 106",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 6, max: 20 } ],
    fiscalia: "penal-comun" },
  { id: "hom-calificado", familia: "Vida, el cuerpo y la salud", nombre: "Homicidio calificado (asesinato)", articulo: "Art. 108",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 15, max: 35, nota: "Determinadas modalidades pueden alcanzar cadena perpetua." } ],
    fiscalia: "penal-comun" },
  { id: "feminicidio", familia: "Vida, el cuerpo y la salud", nombre: "Feminicidio", articulo: "Art. 108-B",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 20, max: 35 },
      { id: "a", nombre: "Con agravantes", min: 30, max: 35, nota: "Determinadas concurrencias permiten cadena perpetua." } ],
    fiscalia: "violencia-mujer" },

  // ---- Integridad ----
  { id: "lesiones-leves", familia: "Vida, el cuerpo y la salud", nombre: "Lesiones leves", articulo: "Art. 122",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 2, max: 5 },
      { id: "a", nombre: "Con agravantes", min: 3, max: 6, nota: "Rango referencial; varía según la condición de la víctima." } ],
    fiscalia: "penal-comun" },
  { id: "lesiones-graves", familia: "Vida, el cuerpo y la salud", nombre: "Lesiones graves", articulo: "Art. 121",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 4, max: 8 },
      { id: "a", nombre: "Formas agravadas", min: 6, max: 12, nota: "Marco variable según el daño, la condición de la víctima, el medio empleado y el resultado." } ],
    fiscalia: "penal-comun" },

  // ---- Familia ----
  { id: "oaf", familia: "La familia", nombre: "Omisión de asistencia familiar", articulo: "Art. 149",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 0.25, max: 3, nota: "Hasta 3 años o prestación de servicios comunitarios, sin perjuicio del pago de alimentos." } ],
    fiscalia: "penal-comun" },

  // ---- Libertad ----
  { id: "secuestro", familia: "La libertad", nombre: "Secuestro", articulo: "Art. 152",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 20, max: 30 },
      { id: "a", nombre: "Formas agravadas", min: 30, max: 35, perpetua: true, nota: "Cadena perpetua en determinados supuestos agravados." } ],
    fiscalia: "crimen-organizado" },

  // ---- Libertad sexual ----
  { id: "violacion", familia: "Libertad sexual", nombre: "Violación sexual", articulo: "Art. 170",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 14, max: 20 },
      { id: "a", nombre: "Con agravantes", min: 20, max: 26 } ],
    fiscalia: "penal-comun" },
  { id: "violacion-menor", familia: "Libertad sexual", nombre: "Violación sexual de menor de 14 años", articulo: "Art. 173",
    modalidades: [ { id: "b", nombre: "Regulación Ley 30838", min: null, max: null, perpetua: true, nota: "Cadena perpetua bajo la regulación introducida por la Ley 30838." } ],
    fiscalia: "penal-comun" },

  // ---- Patrimonio ----
  { id: "hurto-simple", familia: "Patrimonio", nombre: "Hurto simple", articulo: "Art. 185",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 3 } ],
    fiscalia: "penal-comun" },
  { id: "hurto-agravado", familia: "Patrimonio", nombre: "Hurto agravado", articulo: "Art. 186",
    modalidades: [
      { id: "n1", nombre: "Primer nivel de agravación", min: 3, max: 6 },
      { id: "n2", nombre: "Segundo nivel de agravación", min: 4, max: 8 },
      { id: "n3", nombre: "Tercer nivel de agravación", min: 8, max: 15 } ],
    fiscalia: "penal-comun" },
  { id: "robo-simple", familia: "Patrimonio", nombre: "Robo simple", articulo: "Art. 188",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 3, max: 8 } ],
    fiscalia: "penal-comun" },
  { id: "robo-agravado", familia: "Patrimonio", nombre: "Robo agravado", articulo: "Art. 189",
    modalidades: [
      { id: "n1", nombre: "Primer nivel de agravación", min: 12, max: 20 },
      { id: "n2", nombre: "Segundo nivel de agravación", min: 20, max: 30 },
      { id: "n3", nombre: "Modalidad máxima", min: null, max: null, perpetua: true, nota: "Cadena perpetua cuando se causa muerte o lesiones graves, o como integrante de organización criminal." } ],
    fiscalia: "penal-comun" },
  { id: "receptacion", familia: "Patrimonio", nombre: "Receptación", articulo: "Art. 194",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 4, nota: "Además días-multa; aumenta según el bien y el delito de procedencia." } ],
    fiscalia: "penal-comun" },
  { id: "extorsion", familia: "Patrimonio", nombre: "Extorsión", articulo: "Art. 200 y DL 1735",
    modalidades: [
      { id: "b", nombre: "Modalidad básica (referencial)", min: 10, max: 15, nota: "Área sometida a sucesivas reformas; verificar el texto consolidado posterior a la reforma de 2026 (DL 1735)." },
      { id: "a", nombre: "Niveles agravados", min: 15, max: 30, perpetua: true, nota: "Algunos supuestos con cadena perpetua." } ],
    fiscalia: "extorsion" },
  { id: "usurpacion", familia: "Patrimonio", nombre: "Usurpación", articulo: "Arts. 202 y 204",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 2, max: 5 },
      { id: "a", nombre: "Formas agravadas", min: 5, max: 12, nota: "Según violencia, pluralidad y condición del inmueble." } ],
    fiscalia: "penal-comun" },

  // ---- Drogas ----
  { id: "tid", familia: "Drogas", nombre: "Tráfico ilícito de drogas", articulo: "Art. 296",
    modalidades: [ { id: "b", nombre: "Modalidad principal", min: 8, max: 15, nota: "Además multa e inhabilitación." } ],
    fiscalia: "drogas" },
  { id: "tid-agravado", familia: "Drogas", nombre: "TID — formas agravadas", articulo: "Art. 297",
    modalidades: [ { id: "b", nombre: "Formas agravadas", min: 15, max: 25, nota: "Existen supuestos de mayor gravedad." } ],
    fiscalia: "drogas" },

  // ---- Administración pública ----
  { id: "colusion", familia: "Administración pública", nombre: "Colusión", articulo: "Art. 384",
    modalidades: [
      { id: "s", nombre: "Colusión simple", min: 3, max: 6 },
      { id: "a", nombre: "Colusión agravada", min: 6, max: 15 } ],
    fiscalia: "corrupcion" },
  { id: "peculado", familia: "Administración pública", nombre: "Peculado", articulo: "Art. 387",
    modalidades: [
      { id: "b", nombre: "Modalidad principal", min: 4, max: 8 },
      { id: "a", nombre: "Formas agravadas", min: 8, max: 12 } ],
    fiscalia: "corrupcion" },
  { id: "cohecho", familia: "Administración pública", nombre: "Cohecho pasivo propio", articulo: "Art. 393",
    modalidades: [
      { id: "b", nombre: "Aceptar o recibir", min: 5, max: 8, nota: "Incluye inhabilitación y días-multa." },
      { id: "c", nombre: "Condicionar el acto funcional", min: 8, max: 10, nota: "Incluye inhabilitación y días-multa." } ],
    fiscalia: "corrupcion" },

  // ---- Lavado de activos ----
  { id: "lavado", familia: "Lavado de activos", nombre: "Lavado de activos", articulo: "D. Leg. 1106",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 8, max: 15 },
      { id: "a", nombre: "Formas agravadas", min: 10, max: 20, nota: "Las agravantes elevan el marco; ciertos supuestos alcanzan penas mayores." } ],
    fiscalia: "lavado" },

  // ---- Tributarios ----
  { id: "defraudacion", familia: "Delitos tributarios", nombre: "Defraudación tributaria", articulo: "D. Leg. 813",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 5, max: 8 },
      { id: "a", nombre: "Modalidades agravadas", min: 8, max: 12 } ],
    fiscalia: "tributarios" },

  // ---- Informáticos ----
  { id: "acceso-ilicito", familia: "Delitos informáticos", nombre: "Acceso ilícito", articulo: "Ley 30096, art. 2",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 4, nota: "Ley 30096, modificada entre otras por la Ley 32314 (empleo de IA)." } ],
    fiscalia: "ciber" },
  { id: "fraude-informatico", familia: "Delitos informáticos", nombre: "Fraude informático", articulo: "Ley 30096, art. 8",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 3, max: 8 },
      { id: "a", nombre: "Con agravantes", min: 5, max: 10 } ],
    fiscalia: "ciber" },

  // ---- Criminalidad organizada ----
  { id: "org-criminal", familia: "Criminalidad organizada", nombre: "Organización criminal", articulo: "Art. 317 y Ley 30077",
    modalidades: [
      { id: "b", nombre: "Integrante", min: 8, max: 15, nota: "Depende del rol, estructura, finalidad criminal y delito-fin." },
      { id: "l", nombre: "Líder / dirigente / cabecilla", min: 15, max: 20 } ],
    fiscalia: "crimen-organizado" }
];

/* ---- Circunstancias genéricas (art. 46 CP, referencial) ---- */
const ATENUANTES = [
  "Carencia de antecedentes penales",
  "Obrar por móviles nobles o altruistas",
  "Obrar en estado de emoción, temor o perturbación excusable",
  "Influencia de apremiantes circunstancias personales o familiares",
  "Procurar voluntariamente reparar el daño o disminuir sus consecuencias",
  "Presentarse voluntariamente a las autoridades",
  "Edad del imputado, cuando influyó en la conducta"
];

const AGRAVANTES = [
  "Ejecutar el hecho sobre bienes o recursos destinados a necesidades básicas",
  "Pluralidad de agentes en la ejecución",
  "Abuso de condiciones de superioridad o aprovechamiento de víctima vulnerable",
  "Emplear medios cuyo uso pueda generar peligro común",
  "Móvil abyecto, fútil o mediante precio, recompensa o promesa",
  "Abusar del cargo, posición económica, formación, poder o profesión",
  "Actuar por motivos de intolerancia o discriminación",
  "Utilizar a menores de edad o inimputables"
];

/* ---- Reducciones por bonificación procesal (escenarios, referencial) ---- */
const REDUCCIONES = [
  { id: "confesion", nombre: "Confesión sincera", regla: "Reducción de hasta un tercio por debajo del mínimo legal (art. 161 CPP). No procede en flagrancia ni ante evidencia suficiente.", factor: 1 / 3, sobre: "min" },
  { id: "terminacion", nombre: "Terminación anticipada", regla: "Reducción de un sexto de la pena concreta (art. 471 CPP), acumulable a la confesión sincera.", factor: 1 / 6, sobre: "concreta" },
  { id: "conclusion", nombre: "Conclusión anticipada del juicio", regla: "Reducción de un séptimo de la pena concreta (Acuerdo Plenario 5-2008/CJ-116).", factor: 1 / 7, sobre: "concreta" }
];

/* ---- Fiscalías por especialidad ---- */
const FISCALIAS = {
  "penal-comun": { nombre: "Fiscalía Provincial Penal Corporativa", desc: "Nivel operativo principal: recibe denuncias, conduce jurídicamente la investigación, formaliza, acusa y participa en juicio." },
  "corrupcion": { nombre: "Fiscalía Especializada en Delitos de Corrupción de Funcionarios", desc: "Delitos contra la administración pública cometidos por funcionarios: colusión, peculado, cohecho y conexos." },
  "crimen-organizado": { nombre: "Fiscalía Especializada contra la Criminalidad Organizada (FECOR)", desc: "Organizaciones criminales y delitos cometidos en ese contexto (Ley 30077)." },
  "lavado": { nombre: "Fiscalía Especializada en Lavado de Activos", desc: "Lavado de activos y pérdida de dominio (D. Leg. 1106)." },
  "drogas": { nombre: "Fiscalía Especializada en Tráfico Ilícito de Drogas", desc: "Delitos de los arts. 296 y siguientes del Código Penal." },
  "violencia-mujer": { nombre: "Fiscalía Especializada en Violencia contra la Mujer e Integrantes del Grupo Familiar", desc: "Ley 30364 y delitos conexos, incluido el feminicidio." },
  "extorsion": { nombre: "Subsistema Especializado contra la Extorsión y Delitos Conexos", desc: "Creado en 2026 mediante el Decreto Legislativo 1735." },
  "tributarios": { nombre: "Fiscalía Especializada en Delitos Tributarios y Aduaneros", desc: "Defraudación tributaria (D. Leg. 813) y delitos aduaneros (Ley 28008)." },
  "ciber": { nombre: "Fiscalía Especializada en Ciberdelincuencia", desc: "Delitos informáticos (Ley 30096), según la organización de cada distrito fiscal." }
};

const FISCALIAS_LISTA = [
  "Fiscalías penales comunes (corporativas)",
  "Corrupción de funcionarios",
  "Criminalidad organizada",
  "Lavado de activos",
  "Tráfico ilícito de drogas",
  "Terrorismo",
  "Trata de personas y explotación",
  "Delitos ambientales",
  "Violencia contra las mujeres e integrantes del grupo familiar",
  "Derechos humanos e interculturalidad",
  "Delitos aduaneros y contra la propiedad intelectual",
  "Ciberdelincuencia",
  "Extinción de dominio (procedimiento patrimonial autónomo)",
  "Subsistema especializado contra la extorsión y delitos conexos (DL 1735, 2026)"
];

/* ---- Plazos procesales (CPP, art. 334 y 342; Ley 30077) ---- */
const PLAZOS = [
  { etapa: "Diligencias preliminares", plazo: "60 días naturales", prorroga: "El fiscal puede fijar un plazo distinto según la complejidad; sujeto a control judicial. Se reduce si hay persona detenida.", dias: 60 },
  { etapa: "Investigación preparatoria — ordinaria", plazo: "120 días naturales", prorroga: "Prórroga fiscal por única vez hasta 60 días.", dias: 120, prorrogaDias: 60 },
  { etapa: "Investigación preparatoria — compleja", plazo: "8 meses", prorroga: "El juez puede conceder prórroga por igual plazo.", meses: 8, prorrogaMeses: 8 },
  { etapa: "Investigación preparatoria — criminalidad organizada", plazo: "36 meses", prorroga: "El juez puede conceder prórroga por igual plazo (Ley 30077).", meses: 36, prorrogaMeses: 36 },
  { etapa: "Decisión fiscal al concluir la investigación", plazo: "15 días", prorroga: "Plazo mayor en procesos complejos y de criminalidad organizada.", dias: 15 },
  { etapa: "Etapa intermedia y juicio oral", plazo: "Variable", prorroga: "Depende de la agenda judicial y de la complejidad del caso." }
];

const PRISION_PREVENTIVA = [
  { tipo: "Proceso ordinario", plazo: "9 meses", meses: 9 },
  { tipo: "Proceso complejo", plazo: "18 meses", meses: 18 },
  { tipo: "Criminalidad organizada", plazo: "36 meses", meses: 36 }
];

const MEDIDAS_COERCITIVAS = [
  { nombre: "Comparecencia simple", desc: "El imputado sigue el proceso en libertad, con la obligación de concurrir a las citaciones." },
  { nombre: "Comparecencia con restricciones", desc: "Libertad sujeta a reglas: no ausentarse, firmar periódicamente, caución u otras restricciones." },
  { nombre: "Impedimento de salida", desc: "Prohibición de salir del país o de la localidad, dispuesta judicialmente." },
  { nombre: "Detención preliminar judicial", desc: "Privación breve de libertad al inicio de la investigación, ordenada por el juez." },
  { nombre: "Prisión preventiva", desc: "Requiere graves y fundados elementos, prognosis de pena superior a 4 años y peligro procesal. No es una pena." },
  { nombre: "Arresto domiciliario", desc: "Alternativa a la prisión preventiva para supuestos legalmente previstos." },
  { nombre: "Embargo / incautación / inhibición", desc: "Medidas reales sobre bienes para asegurar la reparación civil o el decomiso." },
  { nombre: "Suspensión preventiva de derechos", desc: "Suspensión temporal de cargos o actividades vinculadas al delito." }
];

/* ---- Normativa base y reciente ---- */
const NORMAS_BASE = [
  { norma: "Constitución Política del Perú", contenido: "Libertad personal, debido proceso, función jurisdiccional y atribuciones del Ministerio Público (arts. 2.24, 139, 158 y 159)." },
  { norma: "Decreto Legislativo 635 — Código Penal", contenido: "Delitos, penas, tentativa, autoría, agravantes, atenuantes y determinación judicial de la pena." },
  { norma: "Decreto Legislativo 957 — Código Procesal Penal", contenido: "Investigación, acusación, juzgamiento, impugnaciones, medidas coercitivas y procesos especiales." },
  { norma: "Decreto Legislativo 052 — Ley Orgánica del Ministerio Público", contenido: "Organización y funciones de fiscales provinciales, superiores y supremos." },
  { norma: "Ley 30077 — Crimen organizado", contenido: "Criminalidad organizada, técnicas especiales de investigación y plazos especiales." },
  { norma: "Decreto Legislativo 1106", contenido: "Lucha eficaz contra el lavado de activos." },
  { norma: "Ley 30096 — Delitos informáticos", contenido: "Modificada, entre otras, por la Ley 32314 respecto del empleo de inteligencia artificial." },
  { norma: "Ley 30364", contenido: "Violencia contra las mujeres e integrantes del grupo familiar." },
  { norma: "Decreto Legislativo 813", contenido: "Ley Penal Tributaria." },
  { norma: "Ley 28008", contenido: "Delitos aduaneros." },
  { norma: "Decreto Ley 25475", contenido: "Delitos de terrorismo." }
];

const NORMAS_RECIENTES = [
  { norma: "Ley 32258 (2026)", contenido: "Modifica el tratamiento de la tentativa y amplía las restricciones para suspender la ejecución de determinadas penas." },
  { norma: "Decreto Legislativo 1735 (2026)", contenido: "Crea el Subsistema Especializado contra la Extorsión y sus Delitos Conexos." },
  { norma: "Ley 32130 y STC Exp. 00005-2025-PI/TC", contenido: "Distribución de funciones entre la Policía Nacional y el Ministerio Público en la investigación preliminar: la Policía investiga operativamente; el fiscal conserva la conducción jurídica." },
  { norma: "Ley 32314", contenido: "Incorpora el empleo de inteligencia artificial en los delitos informáticos (modifica la Ley 30096)." }
];

const FUENTES_OFICIALES = [
  { nivel: "Nivel 1", nombre: "Diario Oficial El Peruano", uso: "Texto oficialmente publicado, fechas de publicación y vigencia, derogaciones, fe de erratas, precedentes publicados.", url: "https://diariooficial.elperuano.pe/Normas" },
  { nivel: "Nivel 2", nombre: "SPIJ — Ministerio de Justicia y Derechos Humanos", uso: "Textos sistematizados, concordancias, modificaciones, normas vigentes y derogadas, legislación por materia.", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
  { nivel: "Nivel 3", nombre: "Congreso de la República — Archivo Digital", uso: "Textos originales de leyes y decretos legislativos, fichas técnicas, antecedentes y leyes modificatorias.", url: "https://leyes.congreso.gob.pe/" },
  { nivel: "Nivel 4", nombre: "Ministerio Público — Fiscalía de la Nación", uso: "Directorios por distrito fiscal, fiscalías especializadas, resoluciones de creación y reorganización, protocolos.", url: "https://www.gob.pe/mpfn" },
  { nivel: "Nivel 5", nombre: "Poder Judicial del Perú", uso: "Acuerdos plenarios, casaciones, doctrina jurisprudencial, ejecutorias vinculantes y criterios de determinación de la pena.", url: "https://www.pj.gob.pe/wps/wcm/connect/cij-juris/s_jurisprudencia_sistematizada" },
  { nivel: "Nivel 6", nombre: "Tribunal Constitucional", uso: "Debido proceso, legalidad penal, libertad personal, plazo razonable, retroactividad favorable.", url: "https://www.tc.gob.pe/" }
];

const PROCEDIMIENTO = [
  { icono: "📥", nombre: "Denuncia", desc: "Denuncia, noticia policial, flagrancia o actuación de oficio." },
  { icono: "🔍", nombre: "Investigación preliminar", desc: "60 días. PNP investiga operativamente; el fiscal conduce jurídicamente (Ley 32130)." },
  { icono: "📋", nombre: "Investigación preparatoria", desc: "120 días / 8 meses / 36 meses según el tipo de investigación." },
  { icono: "⚖️", nombre: "Etapa intermedia", desc: "Control judicial de la acusación, de la prueba y de los medios de defensa." },
  { icono: "🏛️", nombre: "Juicio oral", desc: "Unipersonal o colegiado según la pena mínima del delito (mayor de 6 años → colegiado)." },
  { icono: "📜", nombre: "Sentencia", desc: "Absolución o condena. Apelación ante la Sala Penal Superior y casación ante la Corte Suprema." }
];
