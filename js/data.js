/* ============================================================
   JustiPenal — Base de datos referencial (v2)
   Fuentes: Código Penal (D. Leg. 635) y modificatorias,
   Código Procesal Penal (D. Leg. 957), Ley 30077, DL 1106,
   Ley 30096, DL 813, Ley 32258 (14/03/2025), DL 1735 (12/02/2026).
   Última revisión editorial: 12 de julio de 2026.
   Los rangos son REFERENCIALES: siempre debe verificarse el
   texto vigente en SPIJ / El Peruano a la fecha del hecho.
   ============================================================ */

const VERIFICADO_AT = "12/07/2026";

/* Sellos de revisión editorial:
   verificado | pendiente | posiblemente-modificado */
const SELLOS = {
  "verificado": { label: "Revisión editorial", clase: "green" },
  "pendiente": { label: "Pendiente de revisión", clase: "amber" },
  "posiblemente-modificado": { label: "Posiblemente modificado", clase: "red" }
};

/* Cada modalidad puede declarar:
   - min / max (años). min: null => la norma no fija mínimo expreso
     (se informa el mínimo legal genérico de la PPL, art. 29 CP: 2 días).
   - perpetua: admite cadena perpetua.
   - elementos: tags constitutivos del tipo/modalidad, usados por la
     regla contra la doble valoración (una circunstancia que ya integra
     el tipo no vuelve a computarse como agravante genérica).
   - multa / inhab / alternativa: consecuencias adicionales.
   Cada delito declara fuente y versión referencial. */
const DELITOS = [
  // ================= VIDA, EL CUERPO Y LA SALUD =================
  { id: "hom-simple", familia: "Vida, el cuerpo y la salud", nombre: "Homicidio simple", articulo: "Art. 106",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado", vigenteDesde: "Texto con modificatorias; verificar versión a la fecha del hecho",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 6, max: 20, elementos: [] } ],
    fiscalia: "penal-comun" },
  { id: "hom-calificado", familia: "Vida, el cuerpo y la salud", nombre: "Homicidio calificado (asesinato)", articulo: "Art. 108",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 15, max: 35, elementos: ["alevosia"], nota: "Determinadas modalidades pueden alcanzar cadena perpetua." } ],
    fiscalia: "penal-comun" },
  { id: "sicariato", familia: "Vida, el cuerpo y la salud", nombre: "Sicariato", articulo: "Art. 108-C",
    fuente: { norma: "Código Penal, D. Leg. 635 (incorporado por D. Leg. 1181)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 25, max: 35, elementos: ["precio"], nota: "Matar por orden, encargo o acuerdo, con propósito de lucro." },
      { id: "a", nombre: "Formas agravadas", min: null, max: null, perpetua: true, elementos: ["precio", "pluralidad"], nota: "Cadena perpetua: víctima menor o vulnerable, dos o más personas, entre otros supuestos." } ],
    fiscalia: "crimen-organizado" },
  { id: "feminicidio", familia: "Vida, el cuerpo y la salud", nombre: "Feminicidio", articulo: "Art. 108-B",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 20, max: 35, elementos: [] },
      { id: "a", nombre: "Con agravantes", min: 30, max: 35, elementos: [], nota: "Determinadas concurrencias permiten cadena perpetua." } ],
    fiscalia: "violencia-mujer" },
  { id: "lesiones-graves", familia: "Vida, el cuerpo y la salud", nombre: "Lesiones graves", articulo: "Art. 121",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 4, max: 8, elementos: [] },
      { id: "a", nombre: "Formas agravadas", min: 6, max: 12, elementos: [], nota: "Marco variable según el daño, la condición de la víctima, el medio y el resultado." } ],
    fiscalia: "penal-comun" },
  { id: "lesiones-leves", familia: "Vida, el cuerpo y la salud", nombre: "Lesiones leves", articulo: "Art. 122",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 2, max: 5, elementos: [] },
      { id: "a", nombre: "Con agravantes", min: 3, max: 6, elementos: [], nota: "Rango referencial; varía según la condición de la víctima." } ],
    fiscalia: "penal-comun" },
  { id: "agresiones-mujer", familia: "Vida, el cuerpo y la salud", nombre: "Agresiones contra mujeres o integrantes del grupo familiar", articulo: "Art. 122-B",
    fuente: { norma: "Código Penal, D. Leg. 635 (Ley 30364 y modificatorias)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 3, elementos: [], inhab: "Inhabilitación conforme al art. 36 (incisos aplicables)." } ],
    fiscalia: "violencia-mujer" },

  // ================= LA FAMILIA =================
  { id: "oaf", familia: "La familia", nombre: "Omisión de asistencia familiar", articulo: "Art. 149",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: null, max: 3, minNoExpreso: true,
      alternativa: "Prestación de servicios comunitarios de 20 a 52 jornadas",
      nota: "Pena privativa de libertad no mayor de 3 años, o prestación de servicios comunitarios de 20 a 52 jornadas, sin perjuicio del pago de la pensión alimenticia. La norma no fija un mínimo expreso en este párrafo.", elementos: [] } ],
    fiscalia: "penal-comun" },

  // ================= EL HONOR (acción privada) =================
  { id: "injuria", familia: "El honor", nombre: "Injuria", articulo: "Art. 130",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    fiscaliaNorma: "Delito de ejercicio privado de la acción penal: se persigue mediante querella de la parte agraviada ante el juez penal unipersonal (arts. 459 y ss. CPP), sin intervención del Ministerio Público.",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: null, max: null,
      penaTexto: "Prestación de servicio comunitario de 10 a 40 jornadas o de 60 a 90 días-multa (sin pena privativa de libertad)", elementos: [],
      nota: "Ofensa o ultraje con palabras, gestos o vías de hecho. Rango referencial: verificar texto vigente." } ],
    fiscalia: "accion-privada" },
  { id: "calumnia", familia: "El honor", nombre: "Calumnia", articulo: "Art. 131",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    fiscaliaNorma: "Delito de ejercicio privado de la acción penal (querella, arts. 459 y ss. CPP).",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: null, max: null,
      penaTexto: "90 a 120 días-multa (sin pena privativa de libertad)", elementos: [],
      nota: "Atribuir falsamente a otro un delito. Rango referencial: verificar texto vigente." } ],
    fiscalia: "accion-privada" },
  { id: "difamacion", familia: "El honor", nombre: "Difamación", articulo: "Art. 132",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    fiscaliaNorma: "Delito de ejercicio privado de la acción penal (querella, arts. 459 y ss. CPP).",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: null, max: 2, minNoExpreso: true, elementos: [], multa: "30 a 120 días-multa (referencial).", nota: "Difundir ante varias personas una noticia que lesione el honor o la reputación." },
      { id: "m", nombre: "Por medio de comunicación social", min: 1, max: 3, elementos: [], multa: "120 a 365 días-multa (referencial).", nota: "Incluye libro, prensa u otro medio de comunicación social; verificar criterios sobre redes sociales." } ],
    fiscalia: "accion-privada" },

  // ================= LA LIBERTAD =================
  { id: "coaccion", familia: "La libertad", nombre: "Coacción", articulo: "Art. 151",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: null, max: 2, minNoExpreso: true, elementos: ["amenaza"], nota: "Obligar a otro, mediante amenaza o violencia, a hacer lo que la ley no manda o impedirle lo que ella no prohíbe." } ],
    fiscalia: "penal-comun" },
  { id: "secuestro", familia: "La libertad", nombre: "Secuestro", articulo: "Art. 152",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 20, max: 30, elementos: [] },
      { id: "a", nombre: "Formas agravadas", min: 30, max: 35, perpetua: true, elementos: ["pluralidad"], nota: "Cadena perpetua en determinados supuestos agravados." } ],
    fiscalia: "crimen-organizado" },
  { id: "trata", familia: "La libertad", nombre: "Trata de personas", articulo: "Art. 153",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 8, max: 15, elementos: [] },
      { id: "a", nombre: "Formas agravadas (art. 153-A)", min: 12, max: 20, elementos: ["pluralidad"], nota: "Supuestos de mayor gravedad pueden superar este marco." } ],
    fiscalia: "trata" },

  // ================= LIBERTAD SEXUAL =================
  { id: "violacion", familia: "Libertad sexual", nombre: "Violación sexual", articulo: "Art. 170",
    fuente: { norma: "Código Penal, D. Leg. 635 (Ley 30838)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 14, max: 20, elementos: ["amenaza"] },
      { id: "a", nombre: "Con agravantes", min: 20, max: 26, elementos: ["amenaza", "pluralidad", "arma"] } ],
    fiscalia: "penal-comun" },
  { id: "violacion-menor", familia: "Libertad sexual", nombre: "Violación sexual de menor de 14 años", articulo: "Art. 173",
    fuente: { norma: "Código Penal, D. Leg. 635 (Ley 30838)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Regulación Ley 30838", min: null, max: null, perpetua: true, elementos: [], nota: "Cadena perpetua bajo la regulación introducida por la Ley 30838." } ],
    fiscalia: "penal-comun" },

  // ================= PATRIMONIO =================
  { id: "hurto-simple", familia: "Patrimonio", nombre: "Hurto simple", articulo: "Art. 185",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 3, elementos: [] } ],
    fiscalia: "penal-comun" },
  { id: "hurto-agravado", familia: "Patrimonio", nombre: "Hurto agravado", articulo: "Art. 186",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "n1", nombre: "Primer nivel de agravación", min: 3, max: 6, elementos: ["pluralidad", "nocturnidad"] },
      { id: "n2", nombre: "Segundo nivel de agravación", min: 4, max: 8, elementos: ["pluralidad"] },
      { id: "n3", nombre: "Tercer nivel de agravación", min: 8, max: 15, elementos: ["organizacion"] } ],
    fiscalia: "penal-comun" },
  { id: "robo-simple", familia: "Patrimonio", nombre: "Robo simple", articulo: "Art. 188",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 3, max: 8, elementos: ["violencia", "amenaza"] } ],
    fiscalia: "penal-comun" },
  { id: "robo-agravado", familia: "Patrimonio", nombre: "Robo agravado", articulo: "Art. 189",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "n1", nombre: "Primer nivel de agravación", min: 12, max: 20, elementos: ["violencia", "amenaza", "arma", "pluralidad", "nocturnidad"], nota: "Incluye supuestos como mano armada, concurso de dos o más personas, en vivienda o durante la noche." },
      { id: "n2", nombre: "Segundo nivel de agravación", min: 20, max: 30, elementos: ["violencia", "amenaza", "arma", "pluralidad"], nota: "Incluye lesiones a la integridad, abuso de incapacidad de la víctima, entre otros." },
      { id: "n3", nombre: "Modalidad máxima", min: null, max: null, perpetua: true, elementos: ["violencia", "organizacion"], nota: "Cadena perpetua cuando se causa muerte o lesiones graves, o como integrante de organización criminal." } ],
    fiscalia: "penal-comun" },
  { id: "apropiacion", familia: "Patrimonio", nombre: "Apropiación ilícita", articulo: "Art. 190",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 2, max: 4, elementos: [], multa: "Días-multa conforme al tipo." } ],
    fiscalia: "penal-comun" },
  { id: "receptacion", familia: "Patrimonio", nombre: "Receptación", articulo: "Art. 194",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 4, elementos: [], multa: "30 a 90 días-multa (referencial).", nota: "Aumenta según el bien y el delito de procedencia." } ],
    fiscalia: "penal-comun" },
  { id: "estafa", familia: "Patrimonio", nombre: "Estafa", articulo: "Art. 196",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 1, max: 6, elementos: ["engano"] },
      { id: "a", nombre: "Formas agravadas (art. 196-A)", min: 4, max: 8, elementos: ["engano", "pluralidad"], nota: "Pluralidad de víctimas, bienes de primera necesidad, entre otros." } ],
    fiscalia: "penal-comun" },
  { id: "extorsion", familia: "Patrimonio", nombre: "Extorsión", articulo: "Art. 200",
    fuente: { norma: "Código Penal, D. Leg. 635 — verificar texto consolidado con reformas de 2025-2026", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "posiblemente-modificado",
    fiscaliaNorma: "La competencia corresponde al Subsistema Especializado contra la Extorsión y sus Delitos Conexos, creado por el D. Leg. 1735 (publicado el 12/02/2026). El DL 1735 es una norma organizativa: no establece la pena del delito.",
    modalidades: [
      { id: "b", nombre: "Modalidad básica (referencial)", min: 10, max: 15, elementos: ["violencia", "amenaza"], nota: "Área sometida a sucesivas reformas: verificar el texto vigente del art. 200 y sus leyes modificatorias a la fecha del hecho." },
      { id: "a", nombre: "Niveles agravados", min: 15, max: 30, perpetua: true, elementos: ["violencia", "amenaza", "pluralidad", "arma"], nota: "Algunos supuestos con cadena perpetua." } ],
    fiscalia: "extorsion" },
  { id: "usurpacion", familia: "Patrimonio", nombre: "Usurpación", articulo: "Arts. 202 y 204",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 2, max: 5, elementos: ["violencia"] },
      { id: "a", nombre: "Formas agravadas", min: 5, max: 12, elementos: ["violencia", "pluralidad", "arma"], nota: "Según violencia, pluralidad y condición del inmueble." } ],
    fiscalia: "penal-comun" },
  { id: "danos", familia: "Patrimonio", nombre: "Daños", articulo: "Art. 205",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: null, max: 3, minNoExpreso: true, elementos: [], multa: "30 a 60 días-multa (referencial)." } ],
    fiscalia: "penal-comun" },

  // ================= SEGURIDAD PÚBLICA / ARMAS =================
  { id: "tenencia-armas", familia: "Seguridad pública", nombre: "Fabricación y tenencia ilegal de armas", articulo: "Art. 279-G",
    fuente: { norma: "Código Penal, D. Leg. 635 (D. Leg. 1244)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Tenencia ilegal de armas de fuego", min: 6, max: 10, elementos: ["arma"], nota: "Fabricación, comercialización o tenencia ilegal de armas, municiones y explosivos tiene rangos propios." } ],
    fiscalia: "penal-comun" },
  { id: "conduccion-ebriedad", familia: "Seguridad pública", nombre: "Conducción en estado de ebriedad o drogadicción", articulo: "Art. 274",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 0.5, max: 2, elementos: [], inhab: "Inhabilitación para conducir conforme al art. 36.7.", alternativa: "Prestación de servicios comunitarios (supuestos legales)." } ],
    fiscalia: "penal-comun" },

  // ================= DROGAS (arts. 296 a 299) =================
  { id: "tid", familia: "Drogas", nombre: "Promoción o favorecimiento al tráfico ilícito de drogas", articulo: "Art. 296",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad principal", min: 8, max: 15, elementos: [], multa: "180 a 365 días-multa.", inhab: "Inhabilitación conforme al art. 36 (incisos aplicables)." } ],
    fiscalia: "drogas" },
  { id: "tid-insumos", familia: "Drogas", nombre: "Tráfico de insumos químicos y productos fiscalizados", articulo: "Art. 296-B",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Comercialización o desvío de insumos para elaboración ilegal de drogas", min: 5, max: 10, elementos: [], multa: "60 a 120 días-multa (referencial).", inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "drogas" },
  { id: "tid-agravado", familia: "Drogas", nombre: "TID — formas agravadas", articulo: "Art. 297",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Formas agravadas", min: 15, max: 25, elementos: ["pluralidad", "organizacion"], multa: "180 a 365 días-multa.", inhab: "Inhabilitación conforme al art. 36.", nota: "Agravantes: funcionario, docente, tres o más personas, entre otros." },
      { id: "c", nombre: "Cabecilla o dirigente de organización dedicada al TID", min: 25, max: 35, elementos: ["organizacion"], multa: "Días-multa conforme al tipo." } ],
    fiscalia: "drogas" },
  { id: "microcomercializacion", familia: "Drogas", nombre: "Microcomercialización o microproducción", articulo: "Art. 298",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Pequeñas cantidades (límites del art. 298)", min: 3, max: 7, elementos: [], multa: "180 a 360 días-multa (referencial).", nota: "La posesión no punible para consumo propio se rige por el art. 299." } ],
    fiscalia: "drogas" },

  // ================= AMBIENTAL (arts. 304 a 314) =================
  { id: "contaminacion", familia: "Ambiental", nombre: "Contaminación del ambiente", articulo: "Art. 304",
    fuente: { norma: "Código Penal, D. Leg. 635 (Ley 29263 y modificatorias)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad dolosa", min: 4, max: 6, elementos: [], multa: "100 a 600 días-multa (referencial).", nota: "Infracción de límites máximos permisibles con perjuicio o alteración al ambiente. Formas agravadas en el art. 305." } ],
    fiscalia: "ambiental" },
  { id: "mineria-ilegal", familia: "Ambiental", nombre: "Minería ilegal", articulo: "Art. 307-A",
    fuente: { norma: "Código Penal, D. Leg. 635 (D. Leg. 1102 y modificatorias)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 4, max: 8, elementos: [], multa: "100 a 600 días-multa (referencial)." },
      { id: "a", nombre: "Formas agravadas (art. 307-B)", min: 8, max: 10, elementos: ["organizacion"], nota: "Zonas prohibidas, áreas naturales protegidas, uso de dragas, entre otros supuestos." } ],
    fiscalia: "ambiental" },
  { id: "delitos-forestales", familia: "Ambiental", nombre: "Delitos contra los bosques o formaciones boscosas (tala ilegal)", articulo: "Art. 310",
    fuente: { norma: "Código Penal, D. Leg. 635 (Ley 29263 y modificatorias)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 4, max: 6, elementos: [], nota: "Destrucción, quema o tala sin permiso. Tráfico de productos forestales y agravantes en los arts. 310-A a 310-C." } ],
    fiscalia: "ambiental" },

  // ================= ADMINISTRACIÓN PÚBLICA =================
  { id: "colusion", familia: "Administración pública", nombre: "Colusión", articulo: "Art. 384",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "s", nombre: "Colusión simple", min: 3, max: 6, elementos: ["cargo"], multa: "180 a 365 días-multa.", inhab: "Inhabilitación conforme al art. 36." },
      { id: "a", nombre: "Colusión agravada", min: 6, max: 15, elementos: ["cargo"], multa: "365 a 730 días-multa.", inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },
  { id: "peculado", familia: "Administración pública", nombre: "Peculado", articulo: "Art. 387",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad principal", min: 4, max: 8, elementos: ["cargo"], multa: "180 a 365 días-multa.", inhab: "Inhabilitación conforme al art. 36." },
      { id: "a", nombre: "Formas agravadas", min: 8, max: 12, elementos: ["cargo"], multa: "365 a 730 días-multa.", inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },
  { id: "cohecho", familia: "Administración pública", nombre: "Cohecho pasivo propio", articulo: "Art. 393",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Aceptar o recibir", min: 5, max: 8, elementos: ["cargo"], multa: "180 a 365 días-multa.", inhab: "Inhabilitación conforme al art. 36." },
      { id: "c", nombre: "Condicionar el acto funcional", min: 8, max: 10, elementos: ["cargo"], multa: "365 a 730 días-multa.", inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },
  { id: "malversacion", familia: "Administración pública", nombre: "Malversación de fondos", articulo: "Art. 389",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 1, max: 4, elementos: ["cargo"], inhab: "Inhabilitación conforme al art. 36.", nota: "Dar al dinero o bienes públicos una aplicación definitiva distinta de la destinada." },
      { id: "a", nombre: "Fondos asistenciales o de apoyo social", min: 3, max: 8, elementos: ["cargo"], inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },
  { id: "negociacion-incompatible", familia: "Administración pública", nombre: "Negociación incompatible", articulo: "Art. 399",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 4, max: 6, elementos: ["cargo"], multa: "180 a 365 días-multa (referencial).", inhab: "Inhabilitación conforme al art. 36.", nota: "Interesarse indebidamente, en provecho propio o de tercero, en contratos u operaciones en que interviene por razón del cargo." } ],
    fiscalia: "corrupcion" },
  { id: "trafico-influencias", familia: "Administración pública", nombre: "Tráfico de influencias", articulo: "Art. 400",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 4, max: 6, elementos: [], multa: "180 a 365 días-multa (referencial)." },
      { id: "a", nombre: "Cometido por funcionario o servidor público", min: 4, max: 8, elementos: ["cargo"], multa: "365 a 730 días-multa (referencial).", inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },
  { id: "enriquecimiento-ilicito", familia: "Administración pública", nombre: "Enriquecimiento ilícito", articulo: "Art. 401",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 5, max: 10, elementos: ["cargo"], multa: "365 a 730 días-multa (referencial).", inhab: "Inhabilitación conforme al art. 36.", nota: "Incremento patrimonial no justificado en el ejercicio de la función pública." },
      { id: "a", nombre: "Alto funcionario (art. 99 de la Constitución)", min: 10, max: 15, elementos: ["cargo"], inhab: "Inhabilitación conforme al art. 36." } ],
    fiscalia: "corrupcion" },

  // ================= FE PÚBLICA =================
  { id: "falsedad-doc", familia: "Fe pública", nombre: "Falsificación de documentos", articulo: "Art. 427",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "pub", nombre: "Documento público", min: 2, max: 10, elementos: [], multa: "Días-multa conforme al tipo." },
      { id: "priv", nombre: "Documento privado", min: 2, max: 4, elementos: [] } ],
    fiscalia: "penal-comun" },
  { id: "falsedad-ideologica", familia: "Fe pública", nombre: "Falsedad ideológica", articulo: "Art. 428",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 3, max: 6, elementos: [], multa: "180 a 365 días-multa (referencial).", nota: "Insertar o hacer insertar declaraciones falsas en instrumento público, sobre hechos que deban probarse con el documento." } ],
    fiscalia: "penal-comun" },
  { id: "falsedad-generica", familia: "Fe pública", nombre: "Falsedad genérica", articulo: "Art. 438",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 2, max: 4, elementos: ["engano"], nota: "Tipo residual: alteración de la verdad en perjuicio de tercero, por palabras, hechos o usurpando nombre o calidad, cuando no encaje en otro tipo de falsedad." } ],
    fiscalia: "penal-comun" },

  // ================= ADMINISTRACIÓN DE JUSTICIA =================
  { id: "encubrimiento-p", familia: "Administración de justicia", nombre: "Encubrimiento personal", articulo: "Art. 404",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 3, max: 6, elementos: [], nota: "Agravado si el delito encubierto es grave (marco superior)." } ],
    fiscalia: "penal-comun" },
  { id: "encubrimiento-r", familia: "Administración de justicia", nombre: "Encubrimiento real", articulo: "Art. 405",
    fuente: { norma: "Código Penal, D. Leg. 635", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 2, max: 4, elementos: [] } ],
    fiscalia: "penal-comun" },

  // ================= LAVADO DE ACTIVOS (ley especial) =================
  { id: "lavado", familia: "Lavado de activos", nombre: "Actos de conversión y transferencia", articulo: "D. Leg. 1106, art. 1",
    fuente: { norma: "Decreto Legislativo 1106", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 8, max: 15, elementos: [], multa: "120 a 350 días-multa." },
      { id: "a", nombre: "Formas agravadas (art. 4)", min: 10, max: 20, elementos: ["organizacion", "cargo"], multa: "365 a 730 días-multa.", nota: "Integrante de organización criminal o funcionario: marco superior. Ciertos supuestos alcanzan penas mayores." } ],
    fiscalia: "lavado" },

  // ================= DELITOS TRIBUTARIOS =================
  { id: "defraudacion", familia: "Delitos tributarios", nombre: "Defraudación tributaria", articulo: "D. Leg. 813",
    fuente: { norma: "Decreto Legislativo 813 — Ley Penal Tributaria", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 5, max: 8, elementos: ["engano"], multa: "365 a 730 días-multa." },
      { id: "a", nombre: "Modalidades agravadas", min: 8, max: 12, elementos: ["engano"], multa: "730 a 1460 días-multa." } ],
    fiscalia: "tributarios" },

  // ================= DELITOS INFORMÁTICOS =================
  { id: "acceso-ilicito", familia: "Delitos informáticos", nombre: "Acceso ilícito", articulo: "Ley 30096, art. 2",
    fuente: { norma: "Ley 30096, modificada entre otras por la Ley 32314 (empleo de IA)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 1, max: 4, elementos: [], multa: "30 a 90 días-multa." } ],
    fiscalia: "ciber" },
  { id: "fraude-informatico", familia: "Delitos informáticos", nombre: "Fraude informático", articulo: "Ley 30096, art. 8",
    fuente: { norma: "Ley 30096, modificada entre otras por la Ley 32314", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 3, max: 8, elementos: ["engano"], multa: "60 a 120 días-multa." },
      { id: "a", nombre: "Con agravantes", min: 5, max: 10, elementos: ["engano"], multa: "80 a 140 días-multa." } ],
    fiscalia: "ciber" },
  { id: "suplantacion", familia: "Delitos informáticos", nombre: "Suplantación de identidad", articulo: "Ley 30096, art. 9",
    fuente: { norma: "Ley 30096", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [ { id: "b", nombre: "Modalidad básica", min: 3, max: 5, elementos: [] } ],
    fiscalia: "ciber" },

  // ================= CRIMINALIDAD ORGANIZADA =================
  { id: "org-criminal", familia: "Criminalidad organizada", nombre: "Organización criminal", articulo: "Art. 317",
    fuente: { norma: "Código Penal, D. Leg. 635; Ley 30077 (norma procesal y de técnicas especiales)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "verificado",
    modalidades: [
      { id: "b", nombre: "Integrante", min: 8, max: 15, elementos: ["organizacion"], nota: "Depende del rol, estructura, finalidad criminal y delito-fin." },
      { id: "l", nombre: "Líder / dirigente / cabecilla", min: 15, max: 20, elementos: ["organizacion"] } ],
    fiscalia: "crimen-organizado" }
];

/* ---- Circunstancias genéricas (art. 46 CP, referencial) ----
   tag: permite aplicar la prohibición de doble valoración contra
   los "elementos" de la modalidad seleccionada. */
const ATENUANTES = [
  { texto: "Carencia de antecedentes penales", tag: null },
  { texto: "Obrar por móviles nobles o altruistas", tag: null },
  { texto: "Obrar en estado de emoción, temor o perturbación excusable", tag: null },
  { texto: "Influencia de apremiantes circunstancias personales o familiares", tag: null },
  { texto: "Procurar voluntariamente reparar el daño o disminuir sus consecuencias", tag: null },
  { texto: "Presentarse voluntariamente a las autoridades", tag: null },
  { texto: "Edad del imputado, cuando influyó en la conducta", tag: null }
];

const AGRAVANTES = [
  { texto: "Ejecutar el hecho sobre bienes o recursos destinados a necesidades básicas", tag: null },
  { texto: "Pluralidad de agentes en la ejecución", tag: "pluralidad" },
  { texto: "Abuso de condiciones de superioridad o aprovechamiento de víctima vulnerable", tag: null },
  { texto: "Emplear armas o medios cuyo uso pueda generar peligro común", tag: "arma" },
  { texto: "Móvil abyecto, fútil o mediante precio, recompensa o promesa", tag: "precio" },
  { texto: "Abusar del cargo, posición económica, formación, poder o profesión", tag: "cargo" },
  { texto: "Actuar por motivos de intolerancia o discriminación", tag: null },
  { texto: "Utilizar a menores de edad o inimputables", tag: null }
];

/* ---- Bonificaciones procesales (escenarios, referencial) ---- */
const REDUCCIONES = [
  { id: "confesion", nombre: "Confesión sincera", regla: "Reducción de hasta un tercio por debajo del mínimo legal (art. 161 CPP). No procede en flagrancia ni ante evidencia suficiente.", factor: 1 / 3, sobre: "min" },
  { id: "terminacion", nombre: "Terminación anticipada", regla: "Reducción de un sexto de la pena concreta individualizada (art. 471 CPP), acumulable a la confesión sincera.", factor: 1 / 6, sobre: "concreta" },
  { id: "conclusion", nombre: "Conclusión anticipada del juicio", regla: "Reducción de un séptimo de la pena concreta individualizada (Acuerdo Plenario 5-2008/CJ-116).", factor: 1 / 7, sobre: "concreta" }
];

/* ---- Reglas de concurso (arts. 48 a 50 CP, referencial) ---- */
const CONCURSO_INFO = {
  real: { nombre: "Concurso real (art. 50)", regla: "Se suman las penas que fije el juez para cada delito, hasta un máximo del doble de la pena del delito más grave, sin exceder de 35 años. Si un delito tiene cadena perpetua, se aplica únicamente esta." },
  ideal: { nombre: "Concurso ideal (art. 48)", regla: "Una sola conducta configura dos o más delitos: se aplica la pena del delito más grave, pudiendo incrementarse hasta en una cuarta parte por encima de su máximo, sin exceder de 35 años." },
  continuado: { nombre: "Delito continuado (art. 49)", regla: "Violaciones de la misma ley penal en momentos diversos con actos ejecutivos de la misma resolución criminal: se sanciona con la pena del delito más grave; si hay pluralidad de personas perjudicadas, puede aumentarse en un tercio del máximo." },
  aparente: { nombre: "Concurso aparente de leyes", regla: "Solo se aplica el tipo penal que absorbe el desvalor total del hecho (especialidad, subsidiariedad, consunción). Las demás conductas no se sancionan por separado." }
};

/* ---- Fiscalías por especialidad ---- */
const FISCALIAS = {
  "penal-comun": { nombre: "Fiscalía Provincial Penal Corporativa", desc: "Nivel operativo principal: recibe denuncias, conduce jurídicamente la investigación, formaliza, acusa y participa en juicio." },
  "corrupcion": { nombre: "Fiscalía Especializada en Delitos de Corrupción de Funcionarios", desc: "Delitos contra la administración pública cometidos por funcionarios: colusión, peculado, cohecho y conexos." },
  "crimen-organizado": { nombre: "Fiscalía Especializada contra la Criminalidad Organizada (FECOR)", desc: "Organizaciones criminales y delitos cometidos en ese contexto (Ley 30077)." },
  "lavado": { nombre: "Fiscalía Especializada en Lavado de Activos", desc: "Lavado de activos y pérdida de dominio (D. Leg. 1106)." },
  "drogas": { nombre: "Fiscalía Especializada en Tráfico Ilícito de Drogas", desc: "Delitos de los arts. 296 y siguientes del Código Penal." },
  "violencia-mujer": { nombre: "Fiscalía Especializada en Violencia contra la Mujer e Integrantes del Grupo Familiar", desc: "Ley 30364 y delitos conexos, incluido el feminicidio." },
  "trata": { nombre: "Fiscalía Especializada en Trata de Personas", desc: "Trata de personas y explotación (arts. 153 y siguientes)." },
  "extorsion": { nombre: "Subsistema Especializado contra la Extorsión y Delitos Conexos", desc: "Norma organizativa: Decreto Legislativo 1735, publicado el 12 de febrero de 2026. No establece penas sustantivas." },
  "tributarios": { nombre: "Fiscalía Especializada en Delitos Tributarios y Aduaneros", desc: "Defraudación tributaria (D. Leg. 813) y delitos aduaneros (Ley 28008)." },
  "ciber": { nombre: "Fiscalía Especializada en Ciberdelincuencia", desc: "Delitos informáticos (Ley 30096), según la organización de cada distrito fiscal." },
  "ambiental": { nombre: "Fiscalía Especializada en Materia Ambiental (FEMA)", desc: "Delitos ambientales de los arts. 304 a 314 del Código Penal: contaminación, minería ilegal, delitos forestales y contra la fauna." },
  "accion-privada": { nombre: "No interviene el Ministerio Público — acción privada", desc: "Los delitos contra el honor se persiguen mediante querella de la parte agraviada directamente ante el juez penal unipersonal (arts. 459 y ss. CPP), sin fiscal ni investigación preparatoria." }
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
  "Subsistema especializado contra la extorsión y delitos conexos (DL 1735, 12/02/2026)"
];

/* Condiciones personales que alteran la competencia */
const CONDICIONES_PERSONA = [
  { id: "ninguna", label: "Ninguna condición especial", nota: null },
  { id: "funcionario", label: "Funcionario o servidor público", nota: "Puede activar la competencia de la Fiscalía Especializada en Corrupción de Funcionarios o procedimientos por razón de la función." },
  { id: "aforado", label: "Alto funcionario con prerrogativa (congresista, ministro, juez supremo…)", nota: "Puede requerir antejuicio o proceso especial por razón de la función ante la Fiscalía de la Nación y la Corte Suprema." },
  { id: "policia-militar", label: "Efectivo policial o militar", nota: "Si el hecho es delito de función, puede corresponder al fuero militar-policial; los delitos comunes van al fuero ordinario." },
  { id: "adolescente", label: "Adolescente (menor de 18 años)", nota: "No se aplica el Código Penal de adultos: rige el Código de Responsabilidad Penal de Adolescentes (D. Leg. 1348), con fiscalías y juzgados de familia especializados." }
];

/* ---- Plazos procesales (CPP, arts. 334 y 342; Ley 30077) ---- */
const PLAZOS = [
  { etapa: "Diligencias preliminares", plazo: "60 días naturales (referencia general)", base: "Art. 334.2 CPP", prorroga: "Puede variar conforme al CPP, el control judicial, la complejidad y los regímenes especiales. Se reduce si hay persona detenida.", dias: 60 },
  { etapa: "Investigación preparatoria — ordinaria", plazo: "120 días naturales", base: "Art. 342.1 CPP", prorroga: "Prórroga fiscal por única vez hasta 60 días.", dias: 120, prorrogaDias: 60 },
  { etapa: "Investigación preparatoria — compleja", plazo: "8 meses", base: "Art. 342.2 CPP", prorroga: "El juez puede conceder prórroga por igual plazo.", meses: 8, prorrogaMeses: 8 },
  { etapa: "Investigación preparatoria — criminalidad organizada", plazo: "36 meses", base: "Art. 342.2 CPP (Ley 30077)", prorroga: "El juez puede conceder prórroga por igual plazo.", meses: 36, prorrogaMeses: 36 },
  { etapa: "Decisión fiscal al concluir la investigación", plazo: "15 días", base: "Art. 344.1 CPP", prorroga: "Plazo mayor en procesos complejos y de criminalidad organizada.", dias: 15 },
  { etapa: "Etapa intermedia y juicio oral", plazo: "Variable", base: "Arts. 351 y ss. CPP", prorroga: "Depende de la agenda judicial y de la complejidad del caso." }
];

const ACTOS_INICIO = [
  { id: "disposicion", label: "Disposición fiscal de apertura de diligencias preliminares" },
  { id: "formalizacion", label: "Disposición de formalización de la investigación preparatoria" },
  { id: "detencion", label: "Detención (el cómputo puede correr desde la detención)" },
  { id: "denuncia", label: "Denuncia (referencial: el plazo corre desde la disposición fiscal, no desde la denuncia)" }
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
  { norma: "Decreto Ley 25475", contenido: "Delitos de terrorismo." },
  { norma: "Decreto Legislativo 1348", contenido: "Código de Responsabilidad Penal de Adolescentes." }
];

/* Estructura: número, publicación, vigencia, materia, fuente, estado, revisión editorial */
const NORMAS_RECIENTES = [
  { norma: "Ley 32258", publicacion: "14/03/2025", vigencia: "Verificar disposición correspondiente", materia: "Modifica el tratamiento de la tentativa y amplía las restricciones para suspender la ejecución de determinadas penas.", fuenteOficial: "El Peruano", estado: "Vigente", verificacion: VERIFICADO_AT },
  { norma: "Decreto Legislativo 1735", publicacion: "12/02/2026", vigencia: "Conforme a su texto", materia: "Norma organizativa: crea el Subsistema Especializado contra la Extorsión y sus Delitos Conexos. No establece penas sustantivas.", fuenteOficial: "El Peruano", estado: "Vigente", verificacion: VERIFICADO_AT },
  { norma: "Ley 32130 y STC Exp. 00005-2025-PI/TC", publicacion: "2024 / sentencia 2026", vigencia: "Conforme a su texto e interpretación del TC", materia: "Distribución de funciones entre la Policía Nacional y el Ministerio Público en la investigación preliminar: la Policía investiga operativamente; el fiscal conserva la conducción jurídica.", fuenteOficial: "El Peruano / TC", estado: "Vigente (interpretada)", verificacion: VERIFICADO_AT },
  { norma: "Ley 32314", publicacion: "2025", vigencia: "Conforme a su texto", materia: "Incorpora el empleo de inteligencia artificial en los delitos informáticos (modifica la Ley 30096).", fuenteOficial: "El Peruano", estado: "Vigente", verificacion: VERIFICADO_AT }
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
  { icono: "🔍", nombre: "Investigación preliminar", desc: "60 días como referencia general; puede variar conforme al CPP, el control judicial o regímenes especiales." },
  { icono: "📋", nombre: "Investigación preparatoria", desc: "120 días / 8 meses / 36 meses según el tipo de investigación." },
  { icono: "⚖️", nombre: "Etapa intermedia", desc: "Control judicial de la acusación, de la prueba y de los medios de defensa." },
  { icono: "🏛️", nombre: "Juicio oral", desc: "Unipersonal o colegiado según la pena mínima del delito (mayor de 6 años → colegiado)." },
  { icono: "📜", nombre: "Sentencia", desc: "Absolución o condena. Apelación ante la Sala Penal Superior y casación ante la Corte Suprema." }
];

/* ---- Analizador de casos: reglas heurísticas (sin IA externa;
   todo el texto se procesa localmente en el navegador) ---- */
const ANALIZADOR_PATRONES = [
  { tag: "arma-fuego", re: /pistola|rev[oó]lver|arma de fuego|escopeta|fusil|bal[ae]|dispar/i, etiqueta: "Arma de fuego" },
  { tag: "arma-blanca", re: /cuchill|navaj|machete|pu[ñn]al|verduguillo/i, etiqueta: "Arma blanca" },
  { tag: "arma", re: /\barma\b|armad[oa]s?\b/i, etiqueta: "Arma (tipo no precisado)" },
  { tag: "amenaza", re: /amenaz|intimid|extorsion(?!ar[íi])|cupo|advirti[oó] que|si no pagas?/i, etiqueta: "Amenaza o intimidación" },
  { tag: "violencia", re: /golpe|patad|pu[ñn]etazo|empuj|agredi|forcejeo|redujeron|maniat/i, etiqueta: "Violencia física" },
  { tag: "lesion", re: /lesi[oó]n|herid|descanso m[eé]dico|incapacidad|fractur|sangr|hospital/i, etiqueta: "Lesiones" },
  { tag: "muerte", re: /muri[oó]|falleci|mat[oó]|asesin|sin vida|cad[aá]ver/i, etiqueta: "Resultado muerte" },
  { tag: "apoderamiento", re: /rob(?!o de identidad)|sustra|apoder|(?:se )?llev(?:[oó]|aron)|arrebat|hurt|despoj|tom(?:[oó]|aron)\s|cogi(?:[oó]|eron)|sac(?:[oó]|aron)/i, etiqueta: "Apoderamiento de bienes" },
  { tag: "engano", re: /enga[ñn]|estaf|fingi|se hizo pasar|falso dep[oó]sito|promes[ao] fals/i, etiqueta: "Engaño o ardid" },
  { tag: "drogas", re: /droga|coca[íi]na|marihuana|pbc|clorhidrato|ketes?|paquetes? de/i, etiqueta: "Sustancias fiscalizadas" },
  { tag: "insumos", re: /insumo|precursor|acetona|[aá]cido sulf[uú]rico|kerosene/i, etiqueta: "Insumos químicos" },
  { tag: "funcionario", re: /funcionari|servidor p[uú]blico|alcalde|regidor|municipalidad|gobierno regional|licitaci[oó]n|obra p[uú]blica|coima|soborno/i, etiqueta: "Contexto de función pública" },
  { tag: "informatico", re: /hacke|inform[aá]tic|contrase[ñn]a|cuenta bancaria.*(acced|vulner)|phishing|transferencia no autorizada|suplantaci[oó]n/i, etiqueta: "Medio informático" },
  { tag: "sexual", re: /viol[oó] sexual|violaci[oó]n|tocamient|acoso sexual|abus[oó] sexual/i, etiqueta: "Connotación sexual" },
  { tag: "secuestro", re: /secuestr|retuvieron|privaron de.*libertad|no la dejaron salir/i, etiqueta: "Privación de libertad" },
  { tag: "usurpacion", re: /invadi|usurp|se meti[oó] al terreno|despojo del inmueble|lote/i, etiqueta: "Ocupación de inmueble" },
  { tag: "alimentos", re: /pensi[oó]n de alimentos|no paga.*alimentos|alimentista|demanda de alimentos/i, etiqueta: "Obligación alimentaria" },
  { tag: "falsedad", re: /document[oa].*fals|falsific|adulter[oó]|firma falsa/i, etiqueta: "Documento falso" },
  { tag: "lavado", re: /lavado de (activos|dinero)|dinero de origen il[ií]cito|testaferr/i, etiqueta: "Posible lavado de activos" },
  { tag: "organizacion", re: /banda|organizaci[oó]n criminal|mafia|red criminal/i, etiqueta: "Posible actuación organizada" },
  { tag: "pluralidad", re: /dos (personas|sujetos|hombres|mujeres|individuos)|tres |cuatro |varios sujetos|un grupo/i, etiqueta: "Pluralidad de agentes" },
  { tag: "tentativa", re: /intent[oó]|no logr[oó]|no pudo|frustrad|fue detenido antes|no lleg[oó] a/i, etiqueta: "Posible tentativa" },
  { tag: "lugar-comercio", re: /tienda|local|bodega|farmacia|establecimiento|negocio|minimarket/i, etiqueta: "Establecimiento comercial" },
  { tag: "lugar-vivienda", re: /casa|vivienda|domicilio|departamento/i, etiqueta: "Vivienda" },
  { tag: "nocturnidad", re: /de noche|madrugada|noche/i, etiqueta: "Horario nocturno" },
  { tag: "vehiculo", re: /auto|veh[ií]culo|mototaxi|moto|cami[oó]n|combi/i, etiqueta: "Vehículo involucrado" }
];

/* Hipótesis: condiciones sobre los tags detectados → delito candidato */
const ANALIZADOR_HIPOTESIS = [
  { delitoId: "robo-agravado", modalidadId: "n1", tipo: "principal",
    cuando: (t) => t.has("apoderamiento") && (t.has("violencia") || t.has("amenaza")) && (t.has("arma") || t.has("arma-fuego") || t.has("arma-blanca") || t.has("pluralidad") || t.has("nocturnidad")),
    razon: "Apoderamiento con violencia o amenaza, más al menos una circunstancia agravante del art. 189 (arma, pluralidad de agentes u horario nocturno)." },
  { delitoId: "robo-simple", modalidadId: "b", tipo: "alternativa",
    cuando: (t) => t.has("apoderamiento") && (t.has("violencia") || t.has("amenaza")),
    razon: "Apoderamiento mediante violencia o amenaza; si no se confirma ninguna agravante específica, la calificación bajaría al art. 188." },
  { delitoId: "hurto-agravado", modalidadId: "n1", tipo: "alternativa",
    cuando: (t) => t.has("apoderamiento") && !t.has("violencia") && !t.has("amenaza") && (t.has("pluralidad") || t.has("nocturnidad") || t.has("lugar-vivienda")),
    razon: "Apoderamiento sin violencia ni amenaza contra la persona, con circunstancias del art. 186." },
  { delitoId: "hurto-simple", modalidadId: "b", tipo: "alternativa",
    cuando: (t) => t.has("apoderamiento") && !t.has("violencia") && !t.has("amenaza"),
    razon: "Apoderamiento sin violencia ni amenaza contra la persona." },
  { delitoId: "lesiones-leves", modalidadId: "b", tipo: "conexo",
    cuando: (t) => t.has("lesion") && !t.has("muerte"),
    razon: "Se mencionan lesiones: puede constituir delito autónomo o quedar absorbida en el delito principal, según la gravedad médico-legal (concurso aparente o real)." },
  { delitoId: "hom-simple", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("muerte"),
    razon: "Se menciona un resultado muerte: la calificación exacta (homicidio simple, calificado, o robo con muerte del art. 189 in fine) depende del contexto y del dolo." },
  { delitoId: "extorsion", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("amenaza") && !t.has("apoderamiento") && /cupo|pago peri[oó]dico|si no pagas?/i.test("" ) === false && t.has("amenaza"),
    razon: "Amenaza dirigida a obtener una ventaja económica sin apoderamiento directo: evaluar extorsión (art. 200) frente a coacción (art. 151)." ,
    soloSi: (texto) => /cupo|extorsion|pago para (no|que)|amenaza.*pag|si no paga/i.test(texto) },
  { delitoId: "tid", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("drogas"),
    razon: "Se mencionan sustancias fiscalizadas: la calificación depende de la cantidad (art. 296, 297 o microcomercialización del art. 298; la posesión para consumo propio se rige por el art. 299)." },
  { delitoId: "tid-insumos", modalidadId: "b", tipo: "conexo",
    cuando: (t) => t.has("insumos"),
    razon: "Se mencionan insumos químicos o precursores (art. 296-B)." },
  { delitoId: "estafa", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("engano") && !t.has("informatico"),
    razon: "Disposición patrimonial inducida por engaño (art. 196)." },
  { delitoId: "fraude-informatico", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("informatico"),
    razon: "Interferencia o manipulación de sistemas o datos informáticos con perjuicio patrimonial (Ley 30096, art. 8)." },
  { delitoId: "violacion", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("sexual"),
    razon: "Connotación sexual descrita: la calificación exacta depende de la edad de la víctima y las circunstancias (arts. 170 a 177)." },
  { delitoId: "secuestro", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("secuestro"),
    razon: "Privación de la libertad personal descrita (art. 152); diferenciarla de la retención momentánea propia del robo." },
  { delitoId: "usurpacion", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("usurpacion"),
    razon: "Ocupación o despojo de inmueble (arts. 202 y 204)." },
  { delitoId: "oaf", modalidadId: "b", tipo: "principal",
    cuando: (t) => t.has("alimentos"),
    razon: "Incumplimiento de obligación alimentaria establecida en resolución judicial (art. 149)." },
  { delitoId: "falsedad-doc", modalidadId: "pub", tipo: "conexo",
    cuando: (t) => t.has("falsedad"),
    razon: "Documento presuntamente falsificado o adulterado (art. 427)." },
  { delitoId: "lavado", modalidadId: "b", tipo: "conexo",
    cuando: (t) => t.has("lavado"),
    razon: "Posibles actos de conversión o transferencia de activos de origen ilícito (D. Leg. 1106)." },
  { delitoId: "org-criminal", modalidadId: "b", tipo: "conexo",
    cuando: (t) => t.has("organizacion"),
    razon: "Posible pertenencia a organización criminal (art. 317); requiere estructura, permanencia y reparto de roles." },
  { delitoId: "tenencia-armas", modalidadId: "b", tipo: "conexo",
    cuando: (t) => t.has("arma-fuego"),
    razon: "El empleo de arma de fuego puede configurar además tenencia ilegal (art. 279-G) si no existe licencia." },
  { delitoId: "coaccion", modalidadId: "b", tipo: "alternativa",
    cuando: (t) => t.has("amenaza") && !t.has("apoderamiento"),
    razon: "Si la amenaza no persigue ventaja económica, la conducta podría ser coacción (art. 151) y no extorsión." }
];

/* ============================================================
   Teoría del caso e instituciones (referencial; verificar
   siempre el texto vigente en SPIJ / El Peruano)
   ============================================================ */

/* Los tres elementos clásicos de la teoría del caso */
const TEORIA_ELEMENTOS = [
  { id: "factico", icono: "📖", nombre: "Elemento fáctico", desc: "Qué pasó: la reconstrucción de los hechos en orden cronológico, con personas, lugares, fechas y circunstancias. El analizador de casos de JustiPenal extrae estos elementos de su relato." },
  { id: "juridico", icono: "⚖️", nombre: "Elemento jurídico", desc: "Qué norma encaja: la calificación del hecho en un tipo penal concreto (tipicidad), verificando cada requisito legal. La matriz de tipicidad del portal compara sus hechos con los requisitos del delito." },
  { id: "probatorio", icono: "🔬", nombre: "Elemento probatorio", desc: "Con qué se demuestra: los medios de prueba que acreditan cada afirmación de hecho (documentos, pericias, testigos, actas). Sin prueba, la mejor teoría jurídica no prospera en juicio." }
];

/* Medios de prueba típicos por familia de delito (referencial) */
const CHECKLIST_PROBATORIO = {
  "Vida, el cuerpo y la salud": ["Certificado médico-legal o protocolo de necropsia", "Pericia balística o de arma empleada", "Acta de levantamiento de cadáver y escena del crimen", "Declaraciones de testigos presenciales", "Cámaras de seguridad de la zona", "Pericia de absorción atómica (residuos de disparo)"],
  "El honor": ["Publicación, audio o video que contiene la frase ofensiva", "Constatación notarial o acta fiscal de la publicación (capturas certificadas)", "Testigos de la difusión ante varias personas", "Pericia informática de autoría de la cuenta o medio", "Prueba de la falsedad de la imputación (en calumnia)"],
  "La familia": ["Resolución judicial que fija la pensión alimenticia", "Liquidación de pensiones devengadas aprobada", "Notificación válida del requerimiento de pago", "Reporte de depósitos o su ausencia", "Capacidad económica del obligado (boletas, RUC, movimientos)"],
  "La libertad": ["Certificado médico-legal de la víctima", "Registro de comunicaciones (llamadas, mensajes de los captores)", "Geolocalización y cámaras del recorrido", "Declaración de la víctima con entrevista única cuando corresponda", "Testigos de la privación de libertad o del rescate"],
  "Libertad sexual": ["Certificado médico-legal (integridad sexual)", "Entrevista única en cámara Gesell", "Pericia psicológica de afectación", "Pericia biológica y de ADN", "Registro de comunicaciones previas entre las partes", "Cadena de custodia de prendas y muestras"],
  "Patrimonio": ["Preexistencia del bien (facturas, fotos, boletas)", "Certificado médico-legal si hubo violencia", "Cámaras de seguridad del lugar", "Acta de incautación o hallazgo del bien", "Pericia de valorización de lo sustraído", "Registro de comunicaciones en extorsión (audios, chats de cobro)"],
  "Seguridad pública": ["Acta de intervención policial", "Pericia balística y verificación de licencia (SUCAMEC)", "Dosaje etílico o examen toxicológico", "Certificado del retén o cadena de custodia del arma", "Video del control de tránsito o intervención"],
  "Drogas": ["Acta de incautación y prueba de campo", "Pericia química de la sustancia (tipo y peso neto)", "Cadena de custodia", "Pesaje en presencia del fiscal", "Registro de vigilancias y seguimientos", "Levantamiento del secreto de comunicaciones autorizado"],
  "Ambiental": ["Informe fundamentado de la autoridad ambiental (OEFA, SERFOR, ANA)", "Pericia de límites máximos permisibles o muestreo de laboratorio", "Acta de inspección en el lugar", "Imágenes satelitales o de drones de la zona afectada", "Verificación de permisos, concesiones o licencias ambientales"],
  "Administración pública": ["Informe de control de la Contraloría", "Documentación del proceso de contratación observado", "Pericia contable o financiera", "Registro de visitas y comunicaciones del funcionario", "Levantamiento del secreto bancario y tributario", "Declaraciones juradas de bienes y rentas"],
  "Fe pública": ["Documento cuestionado en original", "Pericia grafotécnica o documentoscópica", "Cotejo con registros oficiales (RENIEC, SUNARP, notaría)", "Declaración del supuesto emisor del documento", "Trazabilidad del uso del documento falso"],
  "Administración de justicia": ["Registro del proceso judicial o investigación obstruida", "Comunicaciones con el favorecido", "Testigos del ocultamiento o ayuda", "Documentación de los bienes ocultados"],
  "Lavado de activos": ["Pericia contable y financiera del desbalance", "Levantamiento del secreto bancario y bursátil", "Reportes de la UIF (Unidad de Inteligencia Financiera)", "Trazabilidad de las operaciones y testaferros", "Vinculación con la actividad criminal previa (no requiere condena previa)"],
  "Delitos tributarios": ["Informe motivado de SUNAT", "Pericia contable tributaria", "Comprobantes y libros contables observados", "Determinación de la deuda defraudada"],
  "Delitos informáticos": ["Pericia informática forense de equipos y cuentas", "Preservación de evidencia digital (hash, imagen forense)", "Registros de conexión (IP, logs) solicitados al proveedor", "Trazabilidad de transferencias electrónicas", "Capturas certificadas de la actividad ilícita"],
  "Criminalidad organizada": ["Levantamiento del secreto de comunicaciones", "Agente encubierto o colaborador eficaz corroborado", "Vigilancias y seguimientos documentados", "Pericia financiera de la estructura", "Organigrama probado de roles y permanencia"]
};

/* Qué podría alegar la defensa (art. 20 CP y conexos) */
const DEFENSAS = [
  { id: "atipicidad", nombre: "Atipicidad", base: "Art. 11 CP y tipo penal concreto", texto: "El hecho no reúne todos los requisitos del delito imputado: falta un elemento del tipo (p. ej. no hubo violencia en el supuesto robo, o el bien era propio). La matriz de tipicidad muestra qué elementos están sin confirmar." },
  { id: "legitima-defensa", nombre: "Legítima defensa", base: "Art. 20.3 CP", texto: "Quien obra en defensa de bienes jurídicos propios o de terceros no responde penalmente, si hubo agresión ilegítima, necesidad racional del medio empleado y falta de provocación suficiente." },
  { id: "estado-necesidad", nombre: "Estado de necesidad", base: "Arts. 20.4 y 20.5 CP", texto: "Se sacrifica un bien jurídico para salvar otro de mayor valor ante un peligro actual e insuperable de otro modo (justificante), o de igual valor en situaciones extremas (exculpante)." },
  { id: "miedo-insuperable", nombre: "Miedo insuperable", base: "Art. 20.7 CP", texto: "Quien obra compelido por miedo insuperable de un mal igual o mayor queda exento de responsabilidad; el miedo debe anular la capacidad de decidir de un ciudadano medio." },
  { id: "error-tipo", nombre: "Error de tipo", base: "Art. 14, primer párrafo, CP", texto: "El agente desconocía un elemento del tipo penal (p. ej. creía que el bien era suyo). Si el error es invencible excluye el dolo y la culpa; si es vencible, subsiste solo la modalidad culposa cuando la ley la prevé." },
  { id: "error-prohibicion", nombre: "Error de prohibición", base: "Art. 14, segundo párrafo, CP", texto: "El agente creía que su conducta era lícita. Invencible: exime de responsabilidad; vencible: atenúa la pena." },
  { id: "inimputabilidad", nombre: "Inimputabilidad", base: "Art. 20.1 y 20.2 CP", texto: "Anomalía psíquica, grave alteración de la conciencia o de la percepción, o minoría de edad (los menores de 18 se rigen por el D. Leg. 1348)." },
  { id: "consentimiento", nombre: "Consentimiento", base: "Art. 20.10 CP", texto: "Exime de responsabilidad cuando el titular del bien jurídico de libre disposición consintió válidamente la conducta." },
  { id: "prueba-insuficiente", nombre: "Insuficiencia probatoria / in dubio pro reo", base: "Art. 2.24.e Constitución; art. II TP CPP", texto: "La presunción de inocencia exige prueba de cargo suficiente, lícita y actuada con garantías. La duda razonable favorece al imputado. No es una 'defensa de fondo' sino un estándar que la acusación debe superar." }
];

/* Instituciones del proceso y de la pena */
const INSTITUCIONES = [
  { id: "principio-oportunidad", categoria: "Salidas alternativas", nombre: "Principio de oportunidad", base: "Art. 2 CPP", sello: "pendiente",
    texto: "El fiscal puede abstenerse de ejercer la acción penal en delitos de mínima gravedad, escasa culpabilidad o cuando el agente resultó afectado por su propio delito, generalmente previo acuerdo de reparación con la víctima. Evita el proceso: la pregunta ciudadana típica '¿puedo evitar el juicio?' suele empezar aquí." },
  { id: "acuerdo-reparatorio", categoria: "Salidas alternativas", nombre: "Acuerdo reparatorio", base: "Art. 2.6 CPP", sello: "pendiente",
    texto: "En delitos determinados por ley (p. ej. lesiones leves, hurto simple, daños) el fiscal propicia un acuerdo entre imputado y víctima; cumplida la reparación, se abstiene de ejercer la acción penal." },
  { id: "terminacion-anticipada", categoria: "Salidas alternativas", nombre: "Terminación anticipada", base: "Arts. 468 a 471 CPP", sello: "verificado",
    texto: "Acuerdo entre fiscal e imputado sobre pena y reparación civil, aprobado por el juez de investigación preparatoria antes de la acusación. Otorga la reducción de un sexto de la pena concreta, acumulable a la confesión sincera. Ya integrada en la calculadora como bonificación." },
  { id: "suspension-ejecucion", categoria: "Ejecución de la pena", nombre: "Suspensión de la ejecución de la pena", base: "Arts. 57 a 61 CP (restricciones ampliadas por Ley 32258)", sello: "pendiente",
    texto: "Responde a la pregunta más frecuente: '¿iré a la cárcel?'. El juez puede suspender la ejecución si la pena concreta no supera 4 años, el agente no es reincidente ni habitual y el pronóstico es favorable, imponiendo reglas de conducta por un periodo de prueba. Numerosos delitos están legalmente excluidos y la Ley 32258 amplió esas exclusiones: una condena de 4 años o menos NO se suspende automáticamente." },
  { id: "reserva-fallo", categoria: "Ejecución de la pena", nombre: "Reserva del fallo condenatorio", base: "Arts. 62 a 67 CP", sello: "pendiente",
    texto: "El juez declara la culpabilidad pero se abstiene de dictar la parte condenatoria, sujetando al agente a un régimen de prueba. Procede en supuestos de penas menores establecidos por ley y no genera antecedentes si se supera el periodo de prueba." },
  { id: "conversion-penas", categoria: "Ejecución de la pena", nombre: "Conversión de penas y vigilancia electrónica", base: "Art. 52 CP; D. Leg. 1300; D. Leg. 1514", sello: "pendiente",
    texto: "Penas privativas de libertad de corta duración pueden convertirse en prestación de servicios, limitación de días libres o multa; la vigilancia electrónica personal permite cumplir la pena o la comparecencia fuera del penal en supuestos legales." },
  { id: "beneficios-penitenciarios", categoria: "Ejecución de la pena", nombre: "Beneficios penitenciarios", base: "Código de Ejecución Penal (D. Leg. 654) y modificatorias", sello: "pendiente",
    texto: "Semilibertad, liberación condicional y redención de pena por trabajo o educación permiten egresar antes del cumplimiento total, según el delito y el cómputo. Advertencia clave: numerosos delitos graves (violación, extorsión, sicariato, corrupción agravada, entre otros) están excluidos o tienen cómputos más exigentes; la ley aplicable es la vigente al momento de solicitar el beneficio." },
  { id: "prescripcion", categoria: "Extinción de la acción", nombre: "Prescripción de la acción penal y de la pena", base: "Arts. 80 a 88 CP; art. 41 Constitución", sello: "pendiente",
    texto: "La acción penal prescribe ordinariamente en un plazo igual al máximo de la pena del delito (tope general de 20 años; 30 en cadena perpetua) y extraordinariamente cuando transcurre ese plazo más su mitad. Se suspende e interrumpe por actuaciones fiscales y judiciales. Para delitos contra la administración pública cometidos por funcionarios el plazo se duplica, y la reforma constitucional estableció supuestos de imprescriptibilidad en los casos más graves. El cómputo concreto exige análisis técnico." },
  { id: "reparacion-civil", categoria: "Consecuencias civiles", nombre: "Reparación civil y tercero civilmente responsable", base: "Arts. 92 a 101 CP", sello: "pendiente",
    texto: "Comprende la restitución del bien o su valor y la indemnización de daños y perjuicios. Se fija junto con la pena, puede ejecutarse contra el condenado y contra el tercero civilmente responsable (p. ej. la empresa dueña del vehículo), y subsiste aunque la pena se suspenda." },
  { id: "flagrancia-detencion", categoria: "Detención", nombre: "Flagrancia y detención", base: "Arts. 259 a 264 CPP; art. 2.24.f Constitución", sello: "pendiente",
    texto: "Hay flagrancia cuando el agente es sorprendido cometiendo el delito, inmediatamente después, o es identificado o encontrado con efectos del delito dentro de las 24 horas. La detención policial en flagrancia y la detención preliminar judicial duran hasta 48 horas (prorrogables por decisión judicial); hasta 15 días en terrorismo, espionaje, TID y criminalidad organizada. La flagrancia habilita además el proceso inmediato." },
  { id: "adolescentes", categoria: "Regímenes especiales", nombre: "Adolescentes en conflicto con la ley penal", base: "Código de Responsabilidad Penal de Adolescentes — D. Leg. 1348", sello: "pendiente",
    texto: "Los menores de 18 años no responden bajo el Código Penal de adultos: se aplican medidas socioeducativas (desde amonestación hasta internación en centro juvenil) con fiscales y jueces especializados de familia, enfoque restaurativo y plazos propios. La internación procede solo en los supuestos más graves y con topes de duración según la edad." },
  { id: "jurisprudencia-vinculante", categoria: "Jurisprudencia", nombre: "Acuerdos plenarios y doctrina jurisprudencial", base: "Corte Suprema de Justicia — art. 116 LOPJ; art. 433.3 CPP", sello: "pendiente",
    texto: "Los Acuerdos Plenarios de las Salas Penales de la Corte Suprema y las casaciones con doctrina jurisprudencial fijan cómo se aplican las normas: por ejemplo, el AP 5-2008/CJ-116 sobre conclusión anticipada, o la Casación 626-2013-Moquegua y el AP 01-2019/CIJ-116 sobre los presupuestos de la prisión preventiva. Dan el salto del 'texto de la ley' a 'cómo se aplica'; se consultan en el portal del Poder Judicial." }
];

/* Jurisprudencia vinculante y de referencia (Corte Suprema) */
const JURISPRUDENCIA = [
  { id: "ap-5-2008", nombre: "Acuerdo Plenario 5-2008/CJ-116", organo: "Salas Penales de la Corte Suprema", anio: "2008", sello: "pendiente",
    materia: "Conclusión anticipada del juicio oral",
    texto: "Fija los alcances de la conformidad procesal: el acusado que acepta los cargos al inicio del juicio obtiene una reducción de un séptimo de la pena concreta. Es la base de la bonificación por conclusión anticipada que muestra la calculadora.",
    relacionadoCon: ["conclusión anticipada", "conformidad", "bonificaciones procesales"] },
  { id: "ap-1-2011", nombre: "Acuerdo Plenario 1-2011/CJ-116", organo: "Salas Penales de la Corte Suprema", anio: "2011", sello: "pendiente",
    materia: "Apreciación de la prueba en delitos contra la libertad sexual",
    texto: "La declaración de la víctima puede constituir prueba de cargo suficiente si cumple garantías de certeza: ausencia de incredibilidad subjetiva, verosimilitud corroborada periféricamente y persistencia en la incriminación. Orienta la actividad probatoria en violación sexual y delitos conexos.",
    relacionadoCon: ["violación sexual", "declaración de la víctima", "prueba"] },
  { id: "ap-3-2010", nombre: "Acuerdo Plenario 3-2010/CJ-116", organo: "Salas Penales de la Corte Suprema", anio: "2010", sello: "pendiente",
    materia: "Lavado de activos: autonomía y prueba indiciaria",
    texto: "El lavado de activos es un delito autónomo: no requiere condena previa por el delito fuente, cuya existencia puede acreditarse mediante prueba indiciaria (desbalance patrimonial, operaciones inusuales, vínculos con la actividad ilícita).",
    relacionadoCon: ["lavado de activos", "delito fuente", "prueba indiciaria"] },
  { id: "cas-626-2013", nombre: "Casación 626-2013-Moquegua", organo: "Sala Penal Permanente de la Corte Suprema", anio: "2015", sello: "pendiente",
    materia: "Prisión preventiva: audiencia y presupuestos",
    texto: "Doctrina jurisprudencial sobre la audiencia de prisión preventiva: debate ordenado por cada presupuesto (fundados y graves elementos, prognosis de pena, peligro procesal), motivación reforzada y discusión expresa de la proporcionalidad y la duración de la medida.",
    relacionadoCon: ["prisión preventiva", "peligro procesal", "medidas coercitivas"] },
  { id: "ap-1-2019", nombre: "Acuerdo Plenario 01-2019/CIJ-116", organo: "XI Pleno Jurisdiccional — Salas Penales de la Corte Suprema", anio: "2019", sello: "pendiente",
    materia: "Prisión preventiva: presupuestos y requisitos",
    texto: "Actualiza y sistematiza la doctrina sobre la prisión preventiva: reafirma su carácter excepcional y subsidiario, desarrolla el peligro de fuga y de obstaculización, y exige que la duración fijada sea proporcional y esté motivada.",
    relacionadoCon: ["prisión preventiva", "excepcionalidad", "peligro de fuga"] }
];

/* Glosario penal (pseudo-wiki) */
const GLOSARIO = [
  { termino: "Tipicidad", def: "Correspondencia exacta entre el hecho real y la descripción del delito en la ley. Si falta un elemento, el hecho es atípico y no hay delito." },
  { termino: "Antijuridicidad", def: "El hecho típico además debe ser contrario al derecho: no lo es si existe una causa de justificación (legítima defensa, estado de necesidad, cumplimiento de un deber)." },
  { termino: "Culpabilidad", def: "Juicio de reproche personal al autor: exige imputabilidad, conocimiento de la antijuridicidad y exigibilidad de otra conducta." },
  { termino: "Dolo", def: "Conocimiento y voluntad de realizar el hecho delictivo. La mayoría de delitos solo se sancionan en su forma dolosa." },
  { termino: "Culpa", def: "Infracción del deber de cuidado que produce un resultado previsible y evitable (negligencia, imprudencia). Solo es punible cuando la ley lo prevé expresamente." },
  { termino: "Tentativa", def: "Comienzo de la ejecución del delito que no se consuma por causas ajenas a la voluntad del agente. El juez reduce prudencialmente la pena (art. 16 CP, modificado por la Ley 32258)." },
  { termino: "Flagrancia", def: "Ser sorprendido cometiendo el delito o inmediatamente después con los efectos del mismo (hasta 24 horas). Permite la detención policial sin orden judicial y el proceso inmediato." },
  { termino: "Imputado", def: "Persona señalada como presunto autor o partícipe de un delito. Goza de presunción de inocencia durante todo el proceso." },
  { termino: "Agraviado", def: "Quien resulta directamente ofendido o perjudicado por el delito. Puede constituirse en actor civil para reclamar la reparación." },
  { termino: "Querella", def: "Demanda penal que la propia víctima presenta ante el juez en los delitos de acción privada (honor), sin intervención del fiscal." },
  { termino: "Disposición fiscal", def: "Decisión motivada del fiscal (abrir diligencias, formalizar investigación, archivar). Marca el inicio de los plazos de investigación." },
  { termino: "Formalización", def: "Disposición con la que el fiscal comunica al juez que continúa la investigación preparatoria contra persona determinada. Suspende la prescripción." },
  { termino: "Sobreseimiento", def: "Resolución judicial que archiva definitivamente el proceso porque el hecho no existió, no es delito, el imputado no participó o no hay prueba suficiente." },
  { termino: "Acusación", def: "Requerimiento fiscal que pide ir a juicio: describe el hecho, la calificación jurídica, la prueba ofrecida, la pena y la reparación civil solicitadas." },
  { termino: "Etapa intermedia", def: "Audiencia de control ante el juez de investigación preparatoria donde se depura la acusación y se admite la prueba antes del juicio." },
  { termino: "Prisión preventiva", def: "Medida excepcional de encarcelamiento durante el proceso. Exige graves elementos de convicción, prognosis de pena mayor a 4 años y peligro de fuga u obstaculización. No es una condena." },
  { termino: "Comparecencia", def: "Situación procesal de libertad durante el proceso, simple o con restricciones (reglas de conducta, caución, control biométrico)." },
  { termino: "Reparación civil", def: "Suma que el condenado (y el tercero civilmente responsable) debe pagar a la víctima: restitución del bien más indemnización del daño." },
  { termino: "Principio de oportunidad", def: "Facultad del fiscal de no ejercer la acción penal en delitos leves, generalmente previo acuerdo reparatorio con la víctima." },
  { termino: "Terminación anticipada", def: "Acuerdo fiscal-imputado sobre pena y reparación, homologado por el juez antes de la acusación; premia con la reducción de un sexto de la pena." },
  { termino: "Colaboración eficaz", def: "Proceso especial en el que quien aporta información corroborada sobre una organización criminal recibe beneficios premiales (reducción, exención o remisión de pena)." },
  { termino: "Casación", def: "Recurso extraordinario ante la Corte Suprema contra sentencias de las salas superiores, por infracción normativa o apartamiento de doctrina jurisprudencial." },
  { termino: "Acuerdo plenario", def: "Criterio interpretativo adoptado por los jueces supremos penales reunidos en pleno, que orienta y en su caso vincula a todos los jueces del país." },
  { termino: "Presunción de inocencia", def: "Toda persona es inocente mientras no se declare judicialmente su responsabilidad mediante sentencia firme (art. 2.24.e de la Constitución)." },
  { termino: "In dubio pro reo", def: "Ante duda razonable sobre la prueba de cargo, el juez debe absolver: la incertidumbre favorece al imputado." },
  { termino: "Cosa juzgada", def: "Prohibición de perseguir dos veces a la misma persona por el mismo hecho una vez que existe resolución firme (ne bis in idem)." }
];

/* ---- Registro de cambios (política de actualización) ---- */
const CHANGELOG = [
  { fecha: "12/07/2026", cambio: "Jurisprudencia vinculante en Normativa y en la base del asistente (AP 5-2008, AP 3-2010, AP 1-2011, Casación 626-2013-Moquegua, AP 01-2019). El asistente cita los plenarios por su denominación cuando son pertinentes." },
  { fecha: "12/07/2026", cambio: "Sugerencias de preguntas del asistente ahora contextuales según la página activa (calculadora, plazos, medidas, teoría del caso, etc.)." },
  { fecha: "12/07/2026", cambio: "Estadísticas anónimas de visitas con GoatCounter: sin cookies, sin IPs, solo agregados por página, país y dispositivo. Declarado en el Aviso Legal §5." },
  { fecha: "12/07/2026", cambio: "Nuevo módulo «Teoría del Caso»: tres elementos, checklist probatorio por familia de delito, perspectiva de la defensa (art. 20 y 14 CP), instituciones del proceso y de la pena, y glosario penal. Contenido nuevo con sello «pendiente de revisión» hasta su verificación editorial en SPIJ." },
  { fecha: "12/07/2026", cambio: "Ampliación del catálogo: delitos contra el honor (arts. 130-132, acción privada), ambientales (arts. 304, 307-A, 310 — FEMA), administración pública ampliada (arts. 389, 399, 400, 401) y fe pública (arts. 428, 438). Sello «pendiente de revisión»." },
  { fecha: "12/07/2026", cambio: "Corrección de la fecha de la Ley 32258: publicada el 14 de marzo de 2025 (antes figuraba 2026)." },
  { fecha: "12/07/2026", cambio: "Separación del D. Leg. 1735 del marco penal de la extorsión: el tipo penal es el art. 200 CP; el DL 1735 es norma organizativa del subsistema fiscal." },
  { fecha: "12/07/2026", cambio: "Revisión del art. 149 (omisión de asistencia familiar): se eliminó el mínimo inventado de 3 meses; la norma no fija mínimo expreso y contempla pena alternativa de 20 a 52 jornadas." },
  { fecha: "12/07/2026", cambio: "Renombrado el resultado a «Rango referencial de individualización de la pena» (antes «pena concreta sugerida»)." },
  { fecha: "12/07/2026", cambio: "Bonificaciones procesales: escenarios A/B/C sobre extremos e hipótesis media del tercio, en lugar de un promedio único." },
  { fecha: "12/07/2026", cambio: "Ampliación del catálogo de delitos: drogas (arts. 296, 296-B, 297, 298), armas (279-G), fe pública (427), encubrimiento (404, 405), trata (153), estafa (196), sicariato (108-C) y otros." },
  { fecha: "12/07/2026", cambio: "Nuevos módulos: Analizar Caso, cálculo multi-delito con reglas de concurso, informe descargable, aviso legal y metodología." }
];
