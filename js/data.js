/* ============================================================
   JustiPenal — Base de datos referencial (v2)
   Fuentes: Código Penal (D. Leg. 635) y modificatorias,
   Código Procesal Penal (D. Leg. 957), Ley 30077, DL 1106,
   Ley 30096, DL 813, Ley 32258 (14/03/2025), D. Leg. 1731, 1733,
   1734 y 1735 (12/02/2026), Ley 32684 (02/07/2026) y Ley 32735
   (21/07/2026).
   Última revisión editorial: 1 de septiembre de 2026.
   Los rangos son REFERENCIALES: siempre debe verificarse el
   texto vigente en SPIJ / El Peruano a la fecha del hecho.
   ============================================================ */

const VERIFICADO_AT = "01/09/2026";

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
  { id: "agresiones-mujer", familia: "Vida, el cuerpo y la salud", nombre: "Agresiones en contra de las mujeres o integrantes del grupo familiar", articulo: "Art. 122-B",
    fuente: { norma: "Código Penal — Decreto Legislativo 635, artículo 122-B; modificado por Ley 30819", url: "https://www2.congreso.gob.pe/sicr/cendocbib/con6_uibd.nsf/DB60F84B5D157DD605258AB3005DEC4B/%24FILE/codigo_penal.pdf" },
    sello: "verificado", vigenteDesde: "Ley 30819, publicada el 13 de julio de 2018; texto consolidado contrastado con fuente oficial",
    verificacion: { penaRevisada: true, estructuraTipicaRevisada: true, fuenteOficialRevisada: true, fechaRevision: VERIFICADO_AT, estado: "Contrastado con fuente oficial" },
    modalidades: [
      { id: "b", nombre: "Modalidad básica", min: 1, max: 3, elementos: [], inhab: "Inhabilitación conforme a los numerales 5 y 11 del artículo 36 del Código Penal y a los artículos 75 y 77 del Código de los Niños y Adolescentes, según corresponda." },
      { id: "a", nombre: "Forma agravada", min: 2, max: 3, elementos: [], inhab: "Inhabilitación conforme a los numerales 5 y 11 del artículo 36 del Código Penal y a los artículos 75 y 77 del Código de los Niños y Adolescentes, según corresponda." }
    ],
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
      { id: "a", nombre: "Niveles agravados", min: 15, max: 30, perpetua: true, elementos: ["violencia", "amenaza", "pluralidad", "arma"], nota: "Algunos supuestos con cadena perpetua." },
      { id: "penal", nombre: "Agravante desde establecimiento penitenciario (Ley 32684)", min: 15, max: 25, elementos: ["amenaza"], nota: "La Ley 32684 (publicada el 02/07/2026) incorporó como supuesto agravado del art. 200 el empleo de los servicios de telefonía autorizados del establecimiento penitenciario, con pena privativa de libertad e inhabilitación. Verificar el texto consolidado del art. 200 y el numeral aplicable a la fecha del hecho." } ],
    fiscalia: "extorsion" },
  { id: "exigencia-extorsiva", familia: "Patrimonio", nombre: "Exigencia extorsiva", articulo: "Art. 200-A",
    fuente: { norma: "Código Penal, D. Leg. 635, artículo incorporado por el D. Leg. 1731 (12/02/2026)", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
    sello: "pendiente",
    fiscaliaNorma: "Delito conexo a la extorsión: la competencia puede corresponder al Subsistema Especializado contra la Extorsión y sus Delitos Conexos (D. Leg. 1735).",
    modalidades: [
      { id: "b", nombre: "Modalidad básica (referencial)", min: 9, max: 12, elementos: ["violencia", "amenaza"], nota: "Conducta previa y autónoma a la extorsión: exigir o requerir sin derecho, mediante violencia o amenaza explícita o implícita, una ventaja económica u de otra índole indebida. Contenido pendiente de revisión editorial: verificar el texto vigente del art. 200-A en SPIJ antes de usarlo." } ],
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
  "penal-comun": {
    nombre: "Fiscalías Penales Corporativas o Comunes", showInDirectory: true,
    desc: "Atienden los delitos que no han sido asignados a una fiscalía especializada y constituyen el nivel operativo ordinario de investigación penal.",
    atiende: "Reciben denuncias, delimitan los hechos investigados, disponen diligencias, solicitan medidas judiciales, formalizan investigaciones, formulan acusación cuando corresponde y participan en audiencias y juicio.",
    necesidades: "Clasificación inicial de denuncias, distribución equilibrada de casos, control de plazos, agenda de diligencias y audiencias, seguimiento de detenidos, gestión de víctimas y testigos, organización de evidencias y control de carga.",
    herramientas: "Registro único del caso, bandeja de pendientes, alertas procesales, matrices de hechos y elementos del delito, plantillas fiscales, control de disposiciones y requerimientos, reportes de carga y trazabilidad documental.",
    baseNormativa: "Constitución Política del Perú; Decreto Legislativo 052; Código Penal, Decreto Legislativo 635; Código Procesal Penal, Decreto Legislativo 957."
  },
  "corrupcion": {
    nombre: "Fiscalías Especializadas en Delitos de Corrupción de Funcionarios", showInDirectory: true,
    desc: "Investigan delitos contra la administración pública vinculados con funcionarios, servidores públicos, recursos estatales, contrataciones y decisiones adoptadas en ejercicio de una función pública.",
    atiende: "Colusión, peculado, cohecho, negociación incompatible, concusión, tráfico de influencias, enriquecimiento ilícito y otros delitos contra la administración pública, según la competencia asignada.",
    necesidades: "Organizar contratos, expedientes de contratación, órdenes de servicio, comprobantes, informes de control, roles funcionales, decisiones administrativas, flujos de dinero y vínculos entre funcionarios y particulares.",
    herramientas: "Matriz de contratación pública, línea de tiempo de decisiones, mapa de funcionarios y proveedores, control de pericias contables, seguimiento de levantamientos de secreto bancario y reportes para coordinaciones superiores.",
    baseNormativa: "Código Penal, delitos contra la administración pública; Código Procesal Penal; Ley Orgánica del Ministerio Público; normativa especial y resoluciones institucionales aplicables.", fuenteEspecifica: "https://www.gob.pe/11414"
  },
  "crimen-organizado": {
    nombre: "Fiscalías Especializadas contra la Criminalidad Organizada", showInDirectory: true,
    desc: "Intervienen cuando existen elementos que permiten investigar una estructura criminal con permanencia, organización, reparto de roles y actuación coordinada para cometer delitos.",
    atiende: "Organizaciones criminales y delitos cometidos dentro de ese contexto. La participación de varias personas no debe presentarse automáticamente como organización criminal.",
    necesidades: "Identificar integrantes, roles, jerarquías, permanencia, comunicaciones, operaciones, fuentes de financiamiento, bienes, empresas vinculadas y delitos ejecutados por la estructura.",
    herramientas: "Mapa de red criminal, línea de tiempo, matriz de roles, vínculos entre hechos y personas, control de técnicas especiales de investigación, gestión de información reservada y planificación segura de operativos.",
    baseNormativa: "Ley 30077; artículo 317 y normas conexas del Código Penal; Código Procesal Penal; resoluciones de organización del Ministerio Público."
  },
  "lavado": {
    nombre: "Fiscalías Especializadas en Delitos de Lavado de Activos", showInDirectory: true,
    desc: "Investigan operaciones destinadas a convertir, transferir, ocultar, transportar, adquirir, utilizar o mantener activos de posible origen ilícito.",
    atiende: "Flujos patrimoniales, operaciones financieras, utilización de empresas, testaferros, beneficiarios finales, adquisiciones sin sustento económico y vinculación con actividades criminales generadoras de activos.",
    necesidades: "Reconstrucción patrimonial, análisis bancario, contable, societario, registral y tributario, identificación de beneficiarios finales y seguimiento de operaciones nacionales o internacionales.",
    herramientas: "Mapa patrimonial, matriz de operaciones, comparación de ingresos y adquisiciones, trazabilidad de activos, cronología financiera, registro de pericias y seguimiento de medidas sobre bienes.",
    baseNormativa: "Decreto Legislativo 1106 y modificatorias; Código Procesal Penal; normativa sobre cooperación, información financiera y medidas patrimoniales."
  },
  "drogas": {
    nombre: "Fiscalías Especializadas en Tráfico Ilícito de Drogas", showInDirectory: true,
    desc: "Atienden delitos relacionados con la producción, promoción, favorecimiento, transporte, comercialización y tráfico de drogas, así como determinadas conductas relacionadas con insumos químicos y precursores.",
    atiende: "Promoción o favorecimiento del tráfico, comercialización, posesión destinada al tráfico, microcomercialización, formas agravadas, insumos químicos, rutas, centros de producción y actuaciones vinculadas con organizaciones criminales.",
    necesidades: "Controlar incautaciones, prueba de campo, pesaje, pericia química, peso neto, cadena de custodia, muestras, comunicaciones, rutas, inmuebles, vehículos, activos, fuentes de información y coordinación de operativos.",
    herramientas: "Registro de sustancias y muestras, trazabilidad de cadena de custodia, mapa de rutas, matriz de investigados y roles, control de informes periciales, planificación de operativos, seguimiento de bienes incautados y tablero de carga por despacho.",
    baseNormativa: "Artículos 296 a 299 y normas conexas del Código Penal; Decreto Legislativo 1241; Código Procesal Penal; Ley 30077 cuando corresponda criminalidad organizada."
  },
  "violencia-mujer": {
    nombre: "Fiscalías Especializadas en Violencia contra las Mujeres y los Integrantes del Grupo Familiar", showInDirectory: true,
    desc: "Investigan hechos de violencia contra las mujeres o integrantes del grupo familiar, con enfoque de protección, debida diligencia y atención de riesgos para la víctima.",
    atiende: "Agresiones físicas o psicológicas, violencia sexual, feminicidio y otros delitos vinculados, de acuerdo con la competencia territorial y funcional del despacho.",
    necesidades: "Evaluación inmediata de riesgo, medidas de protección, certificados médico-legales, pericias psicológicas, entrevista única, antecedentes de violencia, protección de víctimas y coordinación con Policía, Poder Judicial, MIMP y servicios de asistencia.",
    herramientas: "Alertas de riesgo, cronología de episodios, control de medidas de protección, agenda prioritaria, seguimiento de víctimas, registro de pericias y coordinación con el Programa de Asistencia a Víctimas y Testigos.",
    baseNormativa: "Ley 30364 y modificatorias; Código Penal; Código Procesal Penal; protocolos y resoluciones institucionales aplicables."
  },
  "familia": {
    nombre: "Fiscalías de Familia", showInDirectory: true,
    desc: "Protegen la legalidad y los derechos de niñas, niños, adolescentes, personas incapaces y otros sujetos especialmente protegidos en las materias asignadas por la legislación.",
    atiende: "Intervención fiscal en materias de familia, protección, tutela, derechos de menores y responsabilidad penal de adolescentes, según el nivel, territorio y competencia del despacho.",
    distincion: "No debe confundirse la Fiscalía de Familia con la Fiscalía Especializada en Violencia contra las Mujeres y los Integrantes del Grupo Familiar. Tienen competencias y procedimientos diferenciados.",
    necesidades: "Control de medidas de protección, audiencias, informes sociales y psicológicos, entrevistas, situación familiar, seguimiento de adolescentes, coordinación interdisciplinaria y protección del interés superior del niño.",
    herramientas: "Ficha integral familiar, alertas de protección, agenda de audiencias, registro de informes multidisciplinarios, seguimiento de medidas y coordinación con entidades de protección.",
    baseNormativa: "Decreto Legislativo 052; Código de los Niños y Adolescentes; Decreto Legislativo 1348; legislación de familia y protección aplicable."
  },
  "trata": {
    nombre: "Fiscalías Especializadas en Trata de Personas", showInDirectory: true,
    desc: "Investigan la captación, transporte, traslado, acogida o recepción de personas con finalidad de explotación.",
    atiende: "Explotación sexual o laboral, esclavitud, servidumbre, mendicidad, extracción de órganos y otras finalidades previstas legalmente, incluidas redes de captación y traslado.",
    necesidades: "Protección de víctimas, identificación de captadores, transportistas y explotadores, rutas, establecimientos, comunicaciones, pagos, documentación migratoria y evidencia digital.",
    herramientas: "Mapa de rutas, matriz de actores y etapas, control de medidas de protección, seguimiento de víctimas, coordinación migratoria y laboral, y trazabilidad de evidencia financiera y digital.",
    baseNormativa: "Artículos 153 y siguientes del Código Penal; Código Procesal Penal; normas de protección de víctimas y resoluciones institucionales."
  },
  "ambiental": {
    nombre: "Fiscalías Especializadas en Materia Ambiental", showInDirectory: true,
    desc: "Investigan delitos que afectan el ambiente, los recursos naturales, los bosques, la fauna, el agua, el suelo y otros componentes ambientales.",
    atiende: "Contaminación, minería ilegal, tala ilegal, tráfico de especies, afectación de recursos naturales y delitos ambientales conexos.",
    necesidades: "Ubicación geográfica exacta, imágenes satelitales, inspecciones, muestras, informes técnicos, permisos, concesiones, límites territoriales y coordinación con OEFA, SERFOR, ANA, gobiernos regionales y Policía.",
    herramientas: "Mapa georreferenciado, comparación temporal de imágenes, control de informes técnicos, registro de muestras, planificación de operativos y matriz de afectación ambiental.",
    baseNormativa: "Artículos 304 a 314 del Código Penal; normativa ambiental sectorial; Código Procesal Penal; reglamentos y resoluciones institucionales."
  },
  "ciber": {
    nombre: "Fiscalías Especializadas en Ciberdelincuencia", showInDirectory: true,
    desc: "Investigan delitos cometidos contra sistemas, datos y servicios informáticos o mediante tecnologías digitales, conforme a la competencia establecida en cada distrito fiscal.",
    atiende: "Acceso ilícito, ataques a datos o sistemas, fraude informático, suplantación, interceptación y otras conductas previstas en la Ley de Delitos Informáticos.",
    necesidades: "Preservación inmediata de evidencia, registros de conexión, direcciones IP, cuentas, dispositivos, imágenes forenses, hashes, solicitudes a proveedores y trazabilidad de transferencias.",
    herramientas: "Registro de evidencia digital, control de solicitudes de preservación, línea de tiempo tecnológica, mapa de cuentas y dispositivos, seguimiento de pericias y cadena de custodia digital.",
    baseNormativa: "Ley 30096 y modificatorias; Código Procesal Penal; convenios y normativa aplicable a cooperación y evidencia digital."
  },
  "tributarios": {
    nombre: "Fiscalías Especializadas en Delitos Tributarios, Aduaneros y Materias Afines", showInDirectory: true,
    desc: "Atienden delitos tributarios, aduaneros y, cuando la organización institucional lo determine, materias relacionadas con propiedad intelectual.",
    atiende: "Defraudación tributaria, contrabando, defraudación de rentas de aduana, receptación aduanera y otras conductas asignadas por norma o resolución.",
    necesidades: "Organizar libros contables, comprobantes, declaraciones, operaciones de importación o exportación, valorizaciones, mercancías, rutas y documentos aduaneros.",
    herramientas: "Matriz contable y tributaria, cronología de operaciones, registro de mercancías, control de pericias, comparación documental y seguimiento de coordinación con SUNAT, Aduanas y titulares de derechos.",
    baseNormativa: "Decreto Legislativo 813; Ley 28008; Código Penal; legislación de propiedad intelectual aplicable y resoluciones institucionales."
  },
  "terrorismo": {
    nombre: "Fiscalías Especializadas en Delitos de Terrorismo", showInDirectory: true,
    desc: "Atienden investigaciones sometidas al régimen especial de delitos de terrorismo, dentro de los límites de la legalidad, el debido proceso y la competencia establecida institucionalmente.",
    atiende: "Delitos de terrorismo, colaboración, financiamiento y otras conductas previstas en la legislación especial, según la competencia asignada.",
    necesidades: "Separar información de inteligencia de evidencia procesal, gestionar comunicaciones, fuentes, movimientos financieros, documentación, pericias y coordinación interinstitucional.",
    herramientas: "Gestión segura de expedientes, control de accesos, matriz de hechos y elementos, registro de fuentes, trazabilidad documental y planificación de diligencias.",
    baseNormativa: "Decreto Ley 25475 y modificatorias; Código Procesal Penal; Constitución y normativa especial aplicable."
  },
  "derechos-humanos": {
    nombre: "Fiscalías Especializadas en Derechos Humanos e Interculturalidad", showInDirectory: true,
    desc: "Atienden investigaciones relacionadas con graves afectaciones de derechos humanos y casos que requieren un tratamiento intercultural, conforme a la competencia asignada.",
    atiende: "Casos vinculados con afectaciones graves de derechos fundamentales, comunidades indígenas, contextos interculturales y otras materias definidas mediante resolución institucional.",
    necesidades: "Protección de víctimas y testigos, intérpretes, contexto histórico y territorial, evidencia forense, documentación institucional y coordinación con comunidades y entidades públicas.",
    herramientas: "Registro de víctimas, gestión de intérpretes, mapa territorial, cronología histórica, control de pericias forenses y protocolos de comunicación intercultural.",
    baseNormativa: "Constitución Política; tratados de derechos humanos; Código Procesal Penal; Ley Orgánica del Ministerio Público y resoluciones institucionales."
  },
  "extincion-dominio": {
    nombre: "Fiscalías Especializadas en Extinción de Dominio", showInDirectory: true,
    desc: "Intervienen en el proceso patrimonial autónomo dirigido a bienes que podrían provenir de actividades ilícitas o estar destinados a ellas.",
    atiende: "Bienes, activos, productos, ganancias, instrumentos o efectos relacionados con actividades ilícitas, con independencia del resultado de un proceso penal.",
    necesidades: "Identificación de bienes, titularidad real, registros públicos, cuentas, empresas, medidas cautelares, administración y trazabilidad patrimonial.",
    herramientas: "Inventario patrimonial, mapa de titularidad y beneficiarios, control de medidas cautelares, cronología de adquisiciones, seguimiento registral y tablero de bienes.",
    baseNormativa: "Decreto Legislativo 1373 y su reglamento; normativa procesal de extinción de dominio.", fuenteEspecifica: "https://www.gob.pe/16918"
  },
  "extorsion": {
    nombre: "Subsistema Especializado contra la Extorsión y Delitos Conexos", showInDirectory: true,
    desc: "Atiende hechos en los que se emplean amenazas, violencia o intimidación para obtener una ventaja económica indebida, incluidos cobros de cupos y delitos conexos.",
    atiende: "Extorsión, amenazas vinculadas con cobros, utilización de líneas telefónicas, mensajería, cuentas financieras, intermediarios y estructuras dedicadas a esta actividad.",
    necesidades: "Protección de víctimas, preservación de llamadas y mensajes, identificación de líneas, IMEI, cuentas receptoras, geolocalización, entregas controladas y coordinación de intervenciones.",
    herramientas: "Matriz de comunicaciones, mapa de teléfonos y cuentas, cronología de amenazas, registro de pagos, alertas de riesgo, planificación de operativos y seguimiento de evidencia digital.",
    baseNormativa: "Artículo 200 del Código Penal; Código Procesal Penal; Decreto Legislativo 1735 como norma organizativa del subsistema y demás normas aplicables."
  },
  "accion-privada": { nombre: "No interviene el Ministerio Público — acción privada", showInDirectory: false, desc: "Los delitos contra el honor se persiguen mediante querella de la parte agraviada directamente ante el juez penal unipersonal (arts. 459 y ss. CPP), sin fiscal ni investigación preparatoria." }
};

const FISCALIAS_UI_ORDER = [
  "penal-comun", "corrupcion", "crimen-organizado", "lavado", "drogas",
  "violencia-mujer", "familia", "trata", "ambiental", "ciber", "tributarios",
  "terrorismo", "derechos-humanos", "extincion-dominio", "extorsion"
];

/* ---- Perfiles jurídicos extendidos ----
   La capa extendida se construye desde los artículos y fuentes ya registrados.
   Cuando no se ha contrastado el texto consolidado artículo por artículo, el
   perfil lo declara expresamente en vez de completar información por inferencia. */
function construirAnalisisDelito(delito) {
  return {
    estadoPerfil: "Orientación general pendiente de revisión artículo por artículo",
    resumenTipo: `Ficha general de ${delito.nombre}. Consulte el texto completo de ${delito.articulo} antes de emplear esta referencia.`,
    estructura: ["La estructura típica específica está pendiente de revisión individual."],
    sujetosContexto: ["Los sujetos y contextos deben obtenerse del artículo y de sus remisiones expresas."],
    resultadoConsumacion: ["El resultado, la consumación y la tentativa requieren revisión específica del tipo penal."],
    penasAgravantes: delito.modalidades.map((m) => `${m.nombre}: ${m.perpetua ? "cadena perpetua" : `${m.min ?? "sin mínimo expreso"} a ${m.max ?? "—"} años`}. ${m.inhab || m.nota || ""}`),
    fuentes: [{ nombre: delito.fuente.norma, articulo: delito.articulo, url: delito.fuente.url, ultimaVerificacion: VERIFICADO_AT, estado: "Pendiente de revisión específica" }]
  };
}

const PERFILES_JURIDICOS_ESPECIFICOS = {
  "agresiones-mujer": {
    estadoPerfil: "Contrastado con fuente oficial",
    resumenTipo: "El artículo 122-B sanciona a quien causa lesiones corporales leves o una afectación psicológica, cognitiva o conductual, en alguno de los contextos expresamente remitidos al artículo 108-B.",
    estructura: ["Verbo rector: causar.", "Resultado físico: lesiones corporales que requieran menos de diez días de asistencia o descanso, según prescripción facultativa, o algún tipo de afectación física que no alcance el nivel de daño psíquico previsto por la norma.", "Resultado no físico: afectación psicológica, cognitiva o conductual que no califique como daño psíquico."],
    sujetosContexto: ["Primera alternativa de sujeto pasivo: una mujer, por su condición de tal.", "Segunda alternativa de sujeto pasivo: un integrante del grupo familiar.", "Contextos del primer párrafo del artículo 108-B: violencia familiar; coacción, hostigamiento o acoso sexual; abuso de poder, confianza o cualquier posición o relación que confiera autoridad al agente; y cualquier forma de discriminación contra la mujer, exista o no una relación conyugal o de convivencia."],
    resultadoConsumacion: ["Elemento subjetivo: conducta dolosa; el conocimiento y la voluntad deben abarcar los elementos objetivos y el contexto típico.", "Consumación: se produce con la causación del resultado físico o de la afectación psicológica, cognitiva o conductual exigida por la disposición.", "Tentativa: su admisibilidad requiere cautela y debe examinarse conforme al iter de ejecución y a la naturaleza del resultado atribuido; la ficha no adopta una conclusión automática."],
    penasAgravantes: ["Modalidad básica: pena privativa de libertad no menor de uno ni mayor de tres años.", "Forma agravada: pena privativa de libertad no menor de dos ni mayor de tres años.", "Agravantes específicas: 1) uso de arma, objeto contundente o instrumento que ponga en riesgo la vida; 2) ensañamiento o alevosía; 3) víctima embarazada; 4) víctima menor de edad, adulta mayor, con discapacidad o con enfermedad terminal, cuando el agente se aprovecha de esa condición; 5) intervención de dos o más personas; 6) contravención de una medida de protección emitida por la autoridad competente; 7) comisión del acto en presencia de una niña, niño o adolescente.", "Inhabilitación: conforme a los numerales 5 y 11 del artículo 36 del Código Penal y a los artículos 75 y 77 del Código de los Niños y Adolescentes, según corresponda."],
    fuentes: [
      { nombre: "Código Penal — Decreto Legislativo 635", articulo: "Artículo 122-B", url: "https://www2.congreso.gob.pe/sicr/cendocbib/con6_uibd.nsf/DB60F84B5D157DD605258AB3005DEC4B/%24FILE/codigo_penal.pdf", ultimaVerificacion: VERIFICADO_AT, estado: "Texto consolidado contrastado con fuente oficial" },
      { nombre: "Ley 30819", articulo: "Publicada el 13 de julio de 2018", url: "https://busquedas.elperuano.pe/dispositivo/NL/1669642-1", ultimaVerificacion: VERIFICADO_AT, estado: "Publicación oficial" }
    ]
  }
};

DELITOS.forEach((delito) => { delito.analisis = PERFILES_JURIDICOS_ESPECIFICOS[delito.id] || construirAnalisisDelito(delito); });

/* Recursos públicos comprobados como páginas oficiales. No representan acceso
   a registros internos ni a información reservada. */
const PUBLIC_SUPPORT_RESOURCES = {
  mpfn: { nombre: "Ministerio Público", rolReferencial: "Directorio público de fiscalías.", recurso: "Directorio institucional", categoria: "directorio", url: "https://www.gob.pe/institucion/mpfn/directorio-fiscalias", acceso: "público", advertencia: "Verifique competencia territorial y funcional vigente.", ultimaVerificacion: VERIFICADO_AT },
  iml: { nombre: "Instituto de Medicina Legal y Ciencias Forenses", rolReferencial: "Directorio público del servicio forense del Ministerio Público.", recurso: "Directorio del IML", categoria: "directorio", url: "https://www.gob.pe/institucion/mpfn/informes-publicaciones/6312812-directorio-del-instituto-de-medicina-legal", acceso: "público", advertencia: "No concede acceso a informes periciales ni datos de personas.", ultimaVerificacion: VERIFICADO_AT },
  pj: { nombre: "Poder Judicial", rolReferencial: "Información institucional y servicios públicos.", recurso: "Portal institucional", categoria: "consulta pública", url: "https://www.pj.gob.pe/", acceso: "público", advertencia: "Los expedientes y actuaciones se sujetan a sus propias reglas de acceso.", ultimaVerificacion: VERIFICADO_AT },
  pnp: { nombre: "Policía Nacional del Perú", rolReferencial: "Información institucional y orientación pública.", recurso: "Portal institucional", categoria: "orientación", url: "https://www.gob.pe/pnp", acceso: "público", advertencia: "No brinda acceso a sistemas policiales internos.", ultimaVerificacion: VERIFICADO_AT },
  defensa: { nombre: "Defensa Pública", rolReferencial: "Orientación y asistencia legal pública según requisitos.", recurso: "Servicios de Defensa Pública", categoria: "orientación", url: "https://www.gob.pe/defensapublica", acceso: "requiere identificación", advertencia: "La atención depende de evaluación y requisitos del servicio.", ultimaVerificacion: VERIFICADO_AT },
  sunat: { nombre: "SUNAT", rolReferencial: "Normativa, orientación y consultas públicas tributarias y aduaneras.", recurso: "Portal institucional", categoria: "consulta pública", url: "https://www.sunat.gob.pe/", acceso: "público", advertencia: "La información protegida requiere legitimación y autenticación.", ultimaVerificacion: VERIFICADO_AT },
  uif: { nombre: "UIF-Perú / SBS", rolReferencial: "Información pública sobre prevención de lavado de activos.", recurso: "Reseña institucional UIF-Perú", categoria: "orientación", url: "https://www.sbs.gob.pe/prevencion-de-lavado-activos/resena-de-la-unidad-de-inteligencia-financiera-del-peru/Acuerdos-Suscritos/Internacionales", acceso: "público", advertencia: "No ofrece acceso público a reportes de inteligencia financiera.", ultimaVerificacion: VERIFICADO_AT },
  contraloria: { nombre: "Contraloría General de la República", rolReferencial: "Información pública de control gubernamental.", recurso: "Portal institucional", categoria: "consulta pública", url: "https://www.gob.pe/contraloria", acceso: "público", advertencia: "No sustituye la solicitud formal de documentación.", ultimaVerificacion: VERIFICADO_AT },
  oece: { nombre: "OECE", rolReferencial: "Orientación y fuentes públicas sobre contratación estatal.", recurso: "Información institucional", categoria: "consulta pública", url: "https://www.gob.pe/institucion/oece/institucional", acceso: "público", advertencia: "Los sistemas autenticados mantienen sus propias condiciones de acceso.", ultimaVerificacion: VERIFICADO_AT },
  linea100: { nombre: "MIMP — Línea 100", rolReferencial: "Orientación y soporte frente a violencia.", recurso: "Campaña oficial Línea 100", categoria: "orientación", url: "https://www.gob.pe/institucion/mimp/campa%C3%B1as/23869-buscas-ayuda-llama-a-la-linea-100", acceso: "público", advertencia: "Canal de orientación; una emergencia exige acudir a los servicios competentes.", ultimaVerificacion: VERIFICADO_AT },
  oefa: { nombre: "OEFA", rolReferencial: "Información y orientación pública en fiscalización ambiental.", recurso: "Portal institucional", categoria: "consulta pública", url: "https://www.gob.pe/oefa", acceso: "público", advertencia: "No concede acceso a expedientes restringidos.", ultimaVerificacion: VERIFICADO_AT },
  serfor: { nombre: "SERFOR", rolReferencial: "Información pública forestal y de fauna silvestre.", recurso: "Portal institucional", categoria: "consulta pública", url: "https://www.gob.pe/serfor", acceso: "público", advertencia: "La emisión de información técnica puede requerir trámite formal.", ultimaVerificacion: VERIFICADO_AT },
  pronabi: { nombre: "PRONABI", rolReferencial: "Información pública sobre gestión de bienes bajo su competencia.", recurso: "Información institucional", categoria: "consulta pública", url: "https://www.gob.pe/institucion/pronabi/institucional", acceso: "público", advertencia: "No autoriza acceso ni disposición de bienes; los trámites siguen reglas propias.", ultimaVerificacion: VERIFICADO_AT }
};

const FISCALIA_SUPPORT_MAP = {
  "penal-comun": ["mpfn", "iml", "pj", "pnp", "defensa"], corrupcion: ["mpfn", "contraloria", "oece", "pj"],
  "crimen-organizado": ["mpfn", "pnp", "pj", "uif"], lavado: ["mpfn", "uif", "sunat", "pronabi"], drogas: ["mpfn", "iml", "pnp"],
  "violencia-mujer": ["mpfn", "iml", "linea100", "defensa"], familia: ["mpfn", "iml", "defensa"], trata: ["mpfn", "iml", "pnp", "defensa"],
  ambiental: ["mpfn", "oefa", "serfor"], ciber: ["mpfn", "pnp"], tributarios: ["mpfn", "sunat"], terrorismo: ["mpfn", "pnp", "pj"],
  "derechos-humanos": ["mpfn", "iml", "defensa"], "extincion-dominio": ["mpfn", "pronabi", "pj"], extorsion: ["mpfn", "pnp", "uif"]
};

const FISCALIA_CASE_PATTERNS = {
  "penal-comun": ["Sustracción ficticia de un bien con modalidad por determinar.", "Agresión ficticia con alcance médico-legal aún no establecido.", "Documento ficticio presuntamente alterado cuya autenticidad requiere pericia."],
  corrupcion: ["Contratación pública ficticia con posible concertación por corroborar.", "Entrega ficticia de una ventaja vinculada a un acto funcional.", "Uso ficticio de fondos públicos con destino documentalmente controvertido."],
  "crimen-organizado": ["Pluralidad ficticia con continuidad y estructura todavía no acreditadas.", "Hechos ilícitos ficticios conexos con roles que requieren individualización.", "Comunicaciones ficticias compatibles con coordinación, sujetas a explicaciones alternativas."],
  lavado: ["Conversión ficticia de fondos cuyo origen y conocimiento requieren corroboración.", "Incremento patrimonial ficticio con documentación de respaldo controvertida.", "Transferencias ficticias entre empresas con finalidad económica por esclarecer."],
  drogas: ["Sustancia ficticia incautada pendiente de pericia química y peso neto.", "Posesión ficticia cuya finalidad de tráfico no está determinada.", "Traslado ficticio de paquetes con conocimiento y participación por individualizar."],
  "violencia-mujer": ["Agresión física ficticia con evaluación de riesgo y pericia pendientes.", "Violencia psicológica ficticia que requiere contexto y corroboración especializada.", "Incumplimiento ficticio de medidas de protección sujeto a verificación documental."],
  familia: ["Situación ficticia de desprotección que requiere evaluación interdisciplinaria.", "Conflicto familiar ficticio con interés superior de una persona menor por proteger.", "Medida de protección ficticia cuyo seguimiento institucional debe verificarse."],
  trata: ["Captación laboral ficticia con finalidad de explotación aún no acreditada.", "Traslado ficticio de una persona con consentimiento y contexto controvertidos.", "Alojamiento ficticio vinculado a posible explotación que requiere corroboración."],
  ambiental: ["Vertimiento ficticio con impacto ambiental pendiente de medición técnica.", "Extracción forestal ficticia con permisos y origen por verificar.", "Actividad minera ficticia con ubicación, autorización y afectación controvertidas."],
  ciber: ["Acceso ficticio a una cuenta sin autorización pendiente de atribución técnica.", "Transferencia ficticia posiblemente inducida mediante suplantación digital.", "Alteración ficticia de datos con integridad y cadena de custodia por verificar."],
  tributarios: ["Declaración tributaria ficticia con omisión y dolo por determinar.", "Ingreso ficticio de mercancías con documentación aduanera controvertida.", "Operaciones ficticias sustentadas por comprobantes cuya autenticidad requiere revisión."],
  terrorismo: ["Aporte ficticio cuya finalidad y conocimiento requieren prueba suficiente.", "Material ficticio cuya relevancia penal depende del contexto legal vigente.", "Vinculación ficticia basada en contactos que no acredita por sí sola responsabilidad."],
  "derechos-humanos": ["Afectación ficticia de derechos con contexto territorial por documentar.", "Intervención ficticia que requiere enfoque intercultural e interpretación.", "Hecho histórico ficticio con evidencia forense y documental aún incompleta."],
  "extincion-dominio": ["Bien ficticio con origen patrimonial pendiente de trazabilidad.", "Activo ficticio presuntamente instrumental con uso lícito alternativo por evaluar.", "Titularidad ficticia controvertida que requiere contraste registral y financiero."],
  extorsion: ["Amenaza ficticia vinculada a un cobro cuya autoría requiere corroboración.", "Mensajes ficticios y cuenta receptora que no acreditan por sí solos participación.", "Cobro ficticio mediante intermediario con conocimiento y rol por individualizar."]
};

const FISCALIA_EXPERTS = {
  "penal-comun": ["medicina legal", "balística", "documentoscopía"], corrupcion: ["contabilidad forense", "contratación y gestión pública", "documentoscopía"],
  "crimen-organizado": ["análisis financiero", "informática forense", "telecomunicaciones"], lavado: ["contabilidad forense", "análisis financiero", "informática forense"],
  drogas: ["química y toxicología", "telecomunicaciones", "balística, cuando corresponda"], "violencia-mujer": ["medicina legal", "psicología", "trabajo social"],
  familia: ["psicología", "trabajo social", "medicina legal, cuando corresponda"], trata: ["psicología", "medicina legal", "traducción e interpretación"],
  ambiental: ["ingeniería ambiental", "forestal o minería, según los hechos", "biología"], ciber: ["informática forense", "telecomunicaciones", "análisis financiero, cuando corresponda"],
  tributarios: ["contabilidad forense", "tributación y aduanas", "documentoscopía"], terrorismo: ["informática forense", "telecomunicaciones", "análisis financiero"],
  "derechos-humanos": ["medicina legal", "antropología", "traducción e interpretación"], "extincion-dominio": ["contabilidad forense", "análisis financiero", "valoración especializada"],
  extorsion: ["informática forense", "telecomunicaciones", "análisis financiero"]
};

FISCALIAS_UI_ORDER.forEach((id) => {
  const fiscalia = FISCALIAS[id];
  fiscalia.casuisticas = FISCALIA_CASE_PATTERNS[id];
  fiscalia.documentosFrecuentes = ["disposiciones y providencias", "actas e informes incorporados legalmente", "requerimientos y oficios, según la etapa"];
  fiscalia.peritosYEspecialistas = FISCALIA_EXPERTS[id].map((item) => `Puede requerir ${item}, según los hechos.`);
  fiscalia.entidadesRelacionadas = (FISCALIA_SUPPORT_MAP[id] || ["mpfn", "pj"]).map((key) => PUBLIC_SUPPORT_RESOURCES[key].nombre);
  fiscalia.riesgosDeGestion = ["vencimientos sin alerta", "documentos sin trazabilidad", "distribución sin criterios verificables"];
  fiscalia.controlesRecomendados = ["control de plazos", "registro de accesos y cambios", "revisión humana y respeto de la autonomía funcional"];
  fiscalia.directorioApoyo = (FISCALIA_SUPPORT_MAP[id] || ["mpfn", "pj"]).map((key) => PUBLIC_SUPPORT_RESOURCES[key]);
});

/* Condiciones personales que alteran la competencia */
const CONDICIONES_PERSONA = [
  { id: "ninguna", label: "Ninguna condición especial", nota: null },
  { id: "funcionario", label: "Funcionario o servidor público", nota: "Puede activar la competencia de la Fiscalía Especializada en Corrupción de Funcionarios o procedimientos por razón de la función." },
  { id: "aforado", label: "Alto funcionario con prerrogativa (congresista, ministro, juez supremo…)", nota: "Puede requerir antejuicio o proceso especial por razón de la función ante la Fiscalía de la Nación y la Corte Suprema." },
  { id: "policia-militar", label: "Efectivo policial o militar", nota: "Si el hecho es delito de función, puede corresponder al fuero militar-policial; los delitos comunes van al fuero ordinario. La Ley 32735 (21/07/2026) redefinió el delito de función y amplió la competencia militar policial respecto de hechos ocurridos en actividades de prevención e investigación del delito: verificar el criterio vigente y su control constitucional." },
  { id: "adolescente", label: "Adolescente (menor de 18 años)", nota: "No se aplica el Código Penal de adultos: rige el Código de Responsabilidad Penal de Adolescentes (D. Leg. 1348), con fiscalías y juzgados de familia especializados. El Tribunal Constitucional declaró inconstitucional (sentencia publicada el 16/01/2026) el juzgamiento de adolescentes de 16 y 17 años bajo el régimen penal ordinario." }
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

const MEDIDAS_REVISION_NORMATIVA = "16 de julio de 2026";

const MEDIDAS_PRINCIPIOS = [
  { id: "legalidad", nombre: "Legalidad", desc: "La restricción debe estar expresamente autorizada por la ley." },
  { id: "finalidad", nombre: "Finalidad procesal", desc: "La medida debe perseguir una finalidad concreta vinculada al proceso." },
  { id: "idoneidad", nombre: "Idoneidad", desc: "La medida debe ser apta para controlar el riesgo identificado." },
  { id: "necesidad", nombre: "Necesidad", desc: "Debe descartarse una alternativa menos restrictiva igualmente eficaz." },
  { id: "proporcionalidad", nombre: "Proporcionalidad", desc: "La intensidad de la medida debe guardar equilibrio con el riesgo procesal." },
  { id: "temporalidad", nombre: "Temporalidad", desc: "La medida solo puede mantenerse durante el tiempo estrictamente necesario." },
  { id: "motivacion", nombre: "Motivación", desc: "La decisión debe explicar hechos, riesgos, fundamentos y duración." },
  { id: "revision", nombre: "Revisión judicial", desc: "La medida debe poder ser revisada, sustituida, variada o cesada cuando cambien sus presupuestos." }
];

const MEDIDAS_TEST_LEGITIMIDAD = [
  "¿La medida está expresamente prevista por la ley?",
  "¿Existe una finalidad procesal concreta?",
  "¿La medida es idónea para controlar el riesgo identificado?",
  "¿Existe una medida menos gravosa igualmente eficaz?",
  "¿La intensidad de la restricción resulta proporcional?",
  "¿El plazo está individualmente motivado?",
  "¿Se ha previsto su control o revisión judicial?"
];

const MEDIDAS_COERCITIVAS = [
  {
    id: "detencion", categoria: "personal", nombre: "Detención", intensidad: "alta",
    desc: "Privación temporal de libertad sometida a supuestos legales, control de plazo y control judicial.",
    finalidad: "Asegurar la sujeción inmediata al procedimiento en los supuestos expresamente habilitados.",
    detalles: [
      ["Presupuestos esenciales", ["Detención policial en flagrancia.", "Arresto ciudadano.", "Detención preliminar judicial.", "Detención judicial en los casos legalmente previstos.", "Incomunicación excepcional."]],
      ["Autoridad competente", "Depende de la modalidad: intervención policial o ciudadana en los supuestos permitidos y decisión judicial cuando la ley la exige."],
      ["Duración o control temporal", "Se sujeta al límite y al control previstos para cada modalidad; no existe un plazo único aplicable a todas."],
      ["Alternativas o medidas relacionadas", ["Comparecencia.", "Impedimento de salida.", "Otras restricciones idóneas según el riesgo."]],
      ["Revisión, variación o cese", "Debe cesar al vencer el plazo o desaparecer el supuesto habilitante, sin perjuicio del control judicial correspondiente."],
      ["Base normativa", "Código Procesal Penal: régimen de detención e incomunicación."],
      ["Criterio práctico", "Identificar primero la modalidad concreta, su presupuesto habilitante, la autoridad y el inicio del cómputo."]
    ],
    advertencias: ["La modalidad, el plazo y la autoridad competente dependen del supuesto legal aplicable."]
  },
  {
    id: "prision-preventiva", categoria: "personal", nombre: "Prisión preventiva", intensidad: "máxima",
    desc: "Medida excepcional de privación cautelar de libertad aplicable cuando otras medidas resultan insuficientes para controlar el peligro procesal.",
    finalidad: "Controlar un peligro concreto de fuga u obstaculización que no pueda neutralizarse con una medida menos gravosa.",
    detalles: [
      ["Presupuestos esenciales", ["Fundados y graves elementos de convicción.", "Prognosis de pena conforme al umbral legal vigente.", "Peligro de fuga o peligro de obstaculización.", "Necesidad e insuficiencia de alternativas menos gravosas.", "Proporcionalidad.", "Plazo individualmente motivado."]],
      ["Análisis del peligro procesal", ["Arraigo domiciliario, familiar y laboral.", "Conducta procesal.", "Facilidades para abandonar el país o permanecer oculto.", "Posibilidad concreta de influir en testigos, peritos o coimputados.", "Riesgo de destruir, ocultar, alterar o falsificar elementos de prueba."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, previa solicitud y audiencia conforme al régimen procesal aplicable."],
      ["Plazos", ["Proceso común: dentro del límite legal vigente y con motivación individual.", "Proceso complejo: conforme a su régimen específico.", "Criminalidad organizada: conforme a su régimen específico.", "Prolongación: exige presupuesto y decisión judicial propios.", "Adecuación o modificación: según el régimen aplicable.", "Revisión periódica: debe comprobar la subsistencia de los presupuestos."]],
      ["Alternativas a examinar", ["Comparecencia con restricciones.", "Caución.", "Vigilancia electrónica personal.", "Prohibición de comunicación.", "Restricciones de desplazamiento.", "Impedimento de salida.", "Detención domiciliaria, cuando corresponda."]],
      ["Control judicial", "Puede ser revisada, variada, sustituida, prolongada o cesada según subsistan o cambien sus fundamentos legales."],
      ["Base normativa", "Código Procesal Penal; Acuerdo Plenario 01-2019/CIJ-116; jurisprudencia constitucional sobre motivación reforzada y libertad personal."],
      ["Criterio práctico", "La decisión requiere justificar el riesgo con datos verificables y explicar por qué las alternativas no bastan."]
    ],
    advertencias: ["La gravedad de la imputación o de la pena esperada no demuestra, por sí sola, peligro de fuga u obstaculización."]
  },
  {
    id: "comparecencia", categoria: "personal", nombre: "Comparecencia", intensidad: "baja o media",
    desc: "Medida que permite afrontar el proceso en libertad, con o sin restricciones, según la intensidad del peligro procesal.",
    finalidad: "Mantener la sujeción al proceso mediante el nivel de control estrictamente necesario.",
    detalles: [
      ["Presupuestos esenciales", ["Comparecencia simple: deber de concurrir a las citaciones y sujeción al proceso.", "Comparecencia con restricciones: peligro controlable mediante reglas proporcionales."]],
      ["Restricciones posibles", ["Control periódico.", "Prohibición de ausentarse.", "Prohibición de comunicarse con determinadas personas.", "Restricción de acercamiento.", "Caución.", "Vigilancia electrónica.", "Otras reglas proporcionales al riesgo identificado."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, conforme al supuesto y a la regla solicitada."],
      ["Duración o control temporal", "Las reglas deben fijarse y revisarse según su necesidad y vigencia."],
      ["Alternativas o medidas relacionadas", ["Variación de reglas.", "Impedimento de salida.", "Caución.", "Vigilancia electrónica personal."]],
      ["Revisión, variación o cese", "Las reglas pueden sustituirse, acumularse proporcionalmente o cesar cuando cambien los presupuestos."],
      ["Base normativa", "Código Procesal Penal: régimen de comparecencia simple y con restricciones."],
      ["Criterio práctico", "Se aplica cuando el peligro procesal puede ser razonablemente controlado sin privación cautelar de libertad."]
    ]
  },
  {
    id: "detencion-domiciliaria", categoria: "personal", nombre: "Detención domiciliaria", intensidad: "alta",
    desc: "Restricción de la libertad ambulatoria ejecutada en un domicilio determinado bajo condiciones de control.",
    finalidad: "Controlar el peligro procesal fuera de un establecimiento penitenciario en supuestos legalmente habilitados.",
    detalles: [
      ["Presupuestos esenciales", ["Supuesto legal habilitante.", "Evaluación personal y procesal.", "Verificación de que el peligro pueda controlarse bajo esta modalidad."]],
      ["Autoridad competente", "Órgano jurisdiccional competente."],
      ["Lugar y condiciones", ["Domicilio determinado.", "Mecanismos de vigilancia.", "Restricciones complementarias necesarias."]],
      ["Duración o control temporal", "Debe fijarse, motivarse y controlarse conforme al régimen aplicable."],
      ["Alternativas o medidas relacionadas", ["Comparecencia con restricciones.", "Vigilancia electrónica.", "Otras reglas compatibles."]],
      ["Revisión, variación o cese", "Puede sustituirse, variarse o cesar si cambian los presupuestos o el nivel de riesgo."],
      ["Base normativa", "Código Procesal Penal: régimen de detención domiciliaria."],
      ["Criterio práctico", "La edad o la salud no producen automáticamente la medida; deben verificarse los requisitos legales y la evaluación judicial del caso."]
    ]
  },
  {
    id: "impedimento-salida", categoria: "personal", nombre: "Impedimento de salida", intensidad: "media",
    desc: "Restricción temporal para impedir que una persona abandone el país o un ámbito territorial determinado durante la investigación o el proceso.",
    finalidad: "Asegurar la presencia de la persona y evitar un desplazamiento relevante para el riesgo procesal." ,
    detalles: [
      ["Presupuestos esenciales", ["Necesidad vinculada a un riesgo concreto.", "Ámbito territorial definido.", "Motivación individual.", "Sujeto procesal comprendido conforme a ley."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, a solicitud legitimada."],
      ["Duración o control temporal", "El plazo y su eventual prórroga requieren fundamento conforme al régimen aplicable."],
      ["Alternativas o medidas relacionadas", ["Comparecencia con restricciones.", "Control periódico.", "Restricciones de desplazamiento menos intensas."]],
      ["Revisión, variación o cese", "Puede revisarse, variarse o levantarse cuando la necesidad desaparezca o pueda controlarse de otro modo."],
      ["Base normativa", "Código Procesal Penal: régimen de impedimento de salida."],
      ["Criterio práctico", "Precisar el riesgo, el territorio, la duración y la relación entre la restricción y la finalidad perseguida."]
    ],
    advertencias: ["No debe utilizarse como restricción automática; requiere justificar su relación con un riesgo procesal concreto."]
  },
  {
    id: "suspension-derechos", categoria: "personal", nombre: "Suspensión preventiva de derechos", intensidad: "media o alta",
    desc: "Restricción temporal del ejercicio de determinados derechos, cargos, actividades o facultades vinculadas al riesgo investigado.",
    finalidad: "Neutralizar riesgos relacionados directamente con el ejercicio de un derecho, función o actividad.",
    detalles: [
      ["Presupuestos esenciales", ["Relación concreta entre el derecho restringido y el riesgo.", "Necesidad y proporcionalidad de la medida."]],
      ["Ámbitos posibles", ["Ejercicio de cargo o función.", "Actividad profesional.", "Conducción de vehículos.", "Tenencia o uso de armas.", "Acercamiento o comunicación.", "Actividad empresarial o institucional, cuando legalmente corresponda."]],
      ["Autoridad competente", "Órgano jurisdiccional competente."],
      ["Duración o control temporal", "El plazo debe estar individualmente motivado y sujeto a control judicial."],
      ["Alternativas o medidas relacionadas", ["Restricción parcial.", "Reglas de conducta.", "Prohibiciones específicas menos intensas."]],
      ["Revisión, variación o cese", "Procede cuando cambian el riesgo, la vinculación o la necesidad de la restricción."],
      ["Base normativa", "Código Procesal Penal: régimen de suspensión preventiva de derechos."],
      ["Criterio práctico", "Delimitar con precisión el derecho afectado y su conexión con el riesgo que se busca controlar."]
    ]
  },
  {
    id: "embargo", categoria: "patrimonial", nombre: "Embargo", intensidad: "patrimonial",
    desc: "Afectación cautelar de bienes destinada a asegurar responsabilidades económicas derivadas del proceso.",
    finalidad: "Asegurar la reparación civil, las costas y otras responsabilidades económicas legalmente vinculadas al proceso.",
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Bienes o derechos identificados, hasta un monto cautelar proporcional."],
      ["Presupuestos", ["Apariencia suficiente de la pretensión económica.", "Riesgo para su eficacia.", "Identificación del bien y monto de afectación.", "Modalidad idónea y proporcional."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, a solicitud legitimada."],
      ["Alcance y duración", "La modalidad y el monto deben limitarse a la finalidad cautelar mientras subsistan sus presupuestos."],
      ["Variación, sustitución o cese", "Puede variarse, sustituirse, reducirse o levantarse conforme cambien la garantía o los presupuestos."],
      ["Base normativa", "Código Procesal Penal y normas de aplicación supletoria sobre embargo cautelar."],
      ["Criterio práctico", "Individualizar el bien, justificar el monto y escoger la modalidad menos gravosa que mantenga eficacia."]
    ]
  },
  {
    id: "inhibicion", categoria: "patrimonial", nombre: "Orden de inhibición", intensidad: "patrimonial",
    desc: "Restricción para disponer o gravar determinados bienes mientras subsista la finalidad cautelar.",
    finalidad: "Evitar actos de disposición que frustren la eficacia económica del proceso.",
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Bienes o derechos registrables individualizados."],
      ["Presupuestos", ["Finalidad cautelar concreta.", "Riesgo de disposición o gravamen.", "Necesidad y proporcionalidad."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, a solicitud legitimada."],
      ["Alcance y duración", "Impide disponer o gravar; a diferencia del embargo, se centra en la prohibición registral y no necesariamente fija una modalidad de afectación para ejecución."],
      ["Variación, sustitución o cese", "Puede sustituirse por garantía suficiente o levantarse al desaparecer su necesidad."],
      ["Base normativa", "Código Procesal Penal: medidas reales y orden de inhibición."],
      ["Criterio práctico", "Verificar la titularidad, la identificación registral y que la prohibición guarde relación con la pretensión asegurada."]
    ]
  },
  {
    id: "incautacion", categoria: "patrimonial", nombre: "Incautación", intensidad: "patrimonial alta",
    desc: "Aprehensión o indisponibilidad de bienes vinculados al delito, la investigación o las consecuencias jurídicas del proceso.",
    finalidad: "Preservar evidencia o asegurar bienes sujetos a una consecuencia jurídica, según la finalidad concreta de la medida.",
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Objetos, instrumentos, efectos, ganancias u otros bienes vinculados conforme a ley."],
      ["Presupuestos", ["Vinculación objetiva con el delito o la investigación.", "Finalidad probatoria o cautelar identificada.", "Necesidad y proporcionalidad."]],
      ["Autoridad competente", "Fiscalía y órgano jurisdiccional intervienen según el supuesto; corresponde control o confirmación judicial cuando la ley lo exige."],
      ["Alcance y duración", "Comprende custodia e indisponibilidad durante el tiempo necesario para su finalidad."],
      ["Variación, sustitución o cese", "Proceden la devolución, conservación, sustitución o destino conforme al régimen aplicable."],
      ["Base normativa", "Código Procesal Penal: incautación con finalidad probatoria y cautelar."],
      ["Criterio práctico", "Distinguir la finalidad probatoria de la cautelar y documentar la cadena de custodia cuando corresponda."]
    ]
  },
  {
    id: "desalojo-preventivo", categoria: "patrimonial", nombre: "Desalojo preventivo y ministración provisional de posesión", intensidad: "patrimonial alta",
    desc: "Medida provisional destinada a restablecer o proteger la posesión en los supuestos expresamente previstos por la ley.",
    finalidad: "Evitar la consolidación del perjuicio posesorio y proteger provisionalmente la situación acreditada." ,
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Inmueble y situación posesoria materia de investigación."],
      ["Presupuestos", ["Supuesto legal aplicable.", "Elementos iniciales de convicción.", "Situación posesoria relevante.", "Urgencia y necesidad de tutela provisional."]],
      ["Autoridad competente", "Órgano jurisdiccional competente, conforme al trámite legal."],
      ["Alcance y duración", "Puede comprender desalojo preventivo y ministración provisional de posesión, sin resolver definitivamente el derecho discutido."],
      ["Variación, sustitución o cese", "Está sujeta a control judicial y puede variarse o cesar si cambian sus presupuestos."],
      ["Base normativa", "Código Procesal Penal: desalojo preventivo y ministración provisional."],
      ["Criterio práctico", "Diferenciar la tutela provisional de una decisión definitiva sobre propiedad o posesión."]
    ]
  },
  {
    id: "personas-juridicas", categoria: "patrimonial", nombre: "Medidas aplicables a personas jurídicas", intensidad: "institucional",
    desc: "Medidas temporales que pueden afectar la actividad, organización o funcionamiento de una persona jurídica vinculada al proceso.",
    finalidad: "Controlar riesgos concretos de continuidad, reiteración, ocultamiento o interferencia vinculados a la actividad de la entidad.",
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Actividad, locales, organización o facultades de la persona jurídica, en el alcance permitido por la ley."],
      ["Presupuestos", ["Vinculación procesal suficiente.", "Riesgo concreto.", "Necesidad y proporcionalidad."]],
      ["Medidas posibles", ["Clausura temporal.", "Suspensión de actividades.", "Intervención.", "Vigilancia.", "Prohibición de determinadas actividades.", "Otras medidas previstas legalmente."]],
      ["Autoridad competente", "Órgano jurisdiccional competente."],
      ["Alcance y duración", "Deben delimitarse por actividad, establecimiento o facultad y mantenerse solo mientras resulten necesarias."],
      ["Variación, sustitución o cese", "Pueden reducirse, sustituirse o levantarse según la evolución del riesgo."],
      ["Base normativa", "Código Procesal Penal: medidas preventivas contra personas jurídicas."],
      ["Criterio práctico", "Evitar afectaciones indiscriminadas y considerar el impacto sobre terceros ajenos al proceso."]
    ],
    advertencias: ["La medida debe estar vinculada a riesgos concretos y no puede imponerse como sanción anticipada."]
  },
  {
    id: "pension-anticipada", categoria: "patrimonial", nombre: "Pensión anticipada de alimentos", intensidad: "patrimonial",
    desc: "Asignación provisional destinada a atender necesidades alimentarias en los supuestos expresamente contemplados por la legislación procesal.",
    finalidad: "Atender provisionalmente una necesidad alimentaria conectada con las consecuencias económicas del proceso penal cuando la ley lo permite.",
    detalles: [
      ["Bien, derecho o patrimonio afectado", "Prestación económica provisional a cargo del sujeto procesal comprendido."],
      ["Presupuestos", "Supuesto procesal expresamente habilitado y elementos suficientes sobre necesidad y vinculación."],
      ["Autoridad competente", "Órgano jurisdiccional competente."],
      ["Alcance y duración", "Se limita al proceso penal y al período en que subsista su fundamento provisional."],
      ["Variación, sustitución o cese", "Puede adecuarse o cesar según cambien las circunstancias procesales."],
      ["Base normativa", "Código Procesal Penal: medidas anticipadas vinculadas a alimentos."],
      ["Criterio práctico", "No es una herramienta general de derecho de familia; aquí se explica solo su conexión procesal dentro del caso penal."]
    ]
  }
];

const MEDIDAS_COMPARACION = [
  { criterio: "Privación de libertad", simple: "No", restringida: "No", preventiva: "Sí, cautelar" },
  { criterio: "Reglas de conducta", simple: "Deberes básicos", restringida: "Sí", preventiva: "Régimen de privación" },
  { criterio: "Intensidad", simple: "Baja", restringida: "Media", preventiva: "Máxima" },
  { criterio: "Peligro procesal", simple: "No exige restricciones adicionales", restringida: "Controlable con reglas", preventiva: "Concreto y no controlable con alternativas" },
  { criterio: "Control judicial", simple: "Sí", restringida: "Sí", preventiva: "Sí, reforzado" },
  { criterio: "Posibilidad de revisión", simple: "Sí", restringida: "Sí", preventiva: "Sí, periódica" },
  { criterio: "Carácter excepcional", simple: "No", restringida: "Según necesidad", preventiva: "Sí" }
];

const MEDIDAS_JURISPRUDENCIA = [
  { id: "ap-01-2019", nombre: "Acuerdo Plenario 01-2019/CIJ-116", tema: "Presupuestos y requisitos de la prisión preventiva", regla: "Exige examen diferenciado de sus presupuestos, proporcionalidad y duración.", aplicacion: "Ordena estructurar el debate y la motivación de cada presupuesto sin fórmulas generales.", url: "https://www.pj.gob.pe/wps/wcm/connect/ObservatorioPJ/s_ojpj/as_plenos/as_psupremos/as_pleno_penal/as_2019/" },
  { id: "cas-626-2013", nombre: "Casación 626-2013, Moquegua", tema: "Audiencia y motivación de la prisión preventiva", regla: "Los presupuestos requieren sustento en datos objetivos y debate ordenado.", aplicacion: "Permite controlar que la resolución responda de modo concreto a lo discutido.", url: "https://www.pj.gob.pe/wps/wcm/connect/e7003c804d8db104a16df1db524a342a/Bolet%C3%ADn_18-2016.pdf?CACHEID=e7003c804d8db104a16df1db524a342a&MOD=AJPERES" },
  { id: "stc-03248-2019", nombre: "STC Exp. 03248-2019-PHC/TC (caso Yoshiyama Tanaka)", tema: "Motivación reforzada, excepcionalidad y revisión", regla: "La prisión preventiva es provisional, excepcional y no punitiva; el peligro procesal no puede fundarse en conjeturas.", aplicacion: "Exige explicar el riesgo concreto, la duración y la insuficiencia de alternativas.", url: "https://www.tc.gob.pe/institucional/notas-de-prensa/tribunal-constitucional-establece-importante-doctrina-jurisprudencial-vinculante-en-materia-de-prision-preventiva/" },
  { id: "stc-00800-2024", nombre: "STC Exp. 00800-2024-PHC/TC", tema: "Peligro de fuga y valoración del arraigo", regla: "La prognosis de pena y referencias genéricas al arraigo no sustituyen razones objetivas sobre el peligro procesal.", aplicacion: "Obliga a contrastar circunstancias verificables del caso al motivar una restricción de libertad.", url: "https://www.tc.gob.pe/jurisprudencia/2026/00800-2024-HC.html" }
];

const MEDIDAS_REFERENCIAS = [
  { label: "Código Procesal Penal peruano: disposiciones sobre coerción procesal", url: "https://leyes.congreso.gob.pe/DetLeyNume_1p.aspx?xNorma=3&xNumero=957&xTipoNorma=3" },
  { label: "Normativa modificatoria vigente", url: "https://diariooficial.elperuano.pe/Normas" },
  { label: "Acuerdos Plenarios y jurisprudencia vinculada", url: "https://www.pj.gob.pe/wps/wcm/connect/cij-juris/s_jurisprudencia_sistematizada" },
  { label: "Jurisprudencia constitucional sobre libertad personal, motivación y proporcionalidad", url: "https://www.tc.gob.pe/jurisprudencia/" }
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
  { norma: "Decreto Legislativo 1348", contenido: "Código de Responsabilidad Penal de Adolescentes. El Tribunal Constitucional (sentencia publicada el 16/01/2026) declaró inconstitucional aplicar responsabilidad penal ordinaria a adolescentes de 16 y 17 años." },
  { norma: "Decreto Legislativo 654 — Código de Ejecución Penal (TUO, D.S. 003-2021-JUS)", contenido: "Régimen penitenciario y beneficios; modificado por la Ley 32684 (02/07/2026) en materia de equipos de comunicación." },
  { norma: "Decreto Legislativo 1094 — Código Penal Militar Policial", contenido: "Delitos de función del personal militar y policial; modificado por la Ley 32735 (21/07/2026)." }
];

/* Estructura: número, publicación, vigencia, materia, fuente, estado, revisión editorial */
const NORMAS_RECIENTES = [
  { norma: "Ley 32735", publicacion: "21/07/2026", categoria: "Competencia y fuero militar policial", vigencia: "Conforme a sus disposiciones", materia: "Modifica el Código Penal Militar Policial (D. Leg. 1094) y el Código Procesal Penal (art. III del Título Preliminar y art. 26.5) para redefinir el delito de función y ampliar la competencia del fuero militar policial respecto de hechos cometidos por personal policial y militar en actividades de prevención e investigación del delito. Su alcance es discutido y puede ser objeto de control constitucional.", fuenteOficial: "Diario Oficial El Peruano", url: "https://diariooficial.elperuano.pe/Normas", estado: "Publicada; alcance en debate", verificacion: VERIFICADO_AT },
  { norma: "Ley 32684", publicacion: "02/07/2026", categoria: "Reforma penal sustantiva y de ejecución penal", vigencia: "Conforme a sus disposiciones", materia: "Modifica el Código Penal (entre otros, arts. 200, 368-A y 368-D), el Código de Ejecución Penal (arts. 37-A y 37-C) y el D. Leg. 1688 para endurecer el ingreso, la posesión y el uso indebido de equipos de comunicación en establecimientos penitenciarios, e incorpora como supuesto agravado de extorsión el empleo de los servicios de telefonía autorizados del penal.", fuenteOficial: "Diario Oficial El Peruano", url: "https://elperuano.pe/noticia/299308-celulares-en-penales-estas-son-las-nuevas-penas-que-establece-la-ley-32684", estado: "Publicada", verificacion: VERIFICADO_AT },
  { norma: "STC sobre el D. Leg. 1589 (arts. 283-A y 315-B CP)", publicacion: "22/07/2026", categoria: "Jurisprudencia constitucional", vigencia: "Sentencia del Tribunal Constitucional", materia: "Declara inconstitucionales los artículos 283-A y 315-B del Código Penal, que sancionaban como actos de colaboración el aporte de dinero, alimentos, transporte o suministros a movilizaciones sociales. Se mantienen los tipos de disturbios y entorpecimiento de servicios públicos.", fuenteOficial: "Tribunal Constitucional", url: "https://www.tc.gob.pe/jurisprudencia/", estado: "Sentencia publicada", verificacion: VERIFICADO_AT },
  { norma: "D. Leg. 1731", publicacion: "12/02/2026", categoria: "Reforma penal sustantiva", vigencia: "Conforme a sus disposiciones", materia: "Incorpora el artículo 200-A del Código Penal (exigencia extorsiva) como conducta autónoma previa a la extorsión, con pena privativa de libertad referencial de 9 a 12 años.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/", estado: "Publicado", verificacion: VERIFICADO_AT },
  { norma: "D. Leg. 1733", publicacion: "12/02/2026", categoria: "Reforma penal sustantiva", vigencia: "Conforme a sus disposiciones", materia: "Sanciona el suministro ilegal de servicios de telecomunicaciones en establecimientos penitenciarios y fija obligaciones a los operadores.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/", estado: "Publicado", verificacion: VERIFICADO_AT },
  { norma: "D. Leg. 1734", publicacion: "12/02/2026", categoria: "Reforma penal sustantiva", vigencia: "Conforme a sus disposiciones", materia: "Regula la reserva de información sobre operaciones desarrolladas en estados de emergencia e incorpora el delito de revelación de información reservada.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/", estado: "Publicado", verificacion: VERIFICADO_AT },
  { norma: "STC Exps. 00008-2025-PI/TC y acumulados", publicacion: "16/01/2026", categoria: "Jurisprudencia constitucional", vigencia: "Sentencia del Tribunal Constitucional", materia: "Declara inconstitucionales las disposiciones de la Ley 32330 que permitían aplicar responsabilidad penal ordinaria a adolescentes de 16 y 17 años. La imputabilidad penal se mantiene a partir de los 18 años y esos casos corresponden al sistema penal juvenil (D. Leg. 1348).", fuenteOficial: "Tribunal Constitucional", url: "https://www.tc.gob.pe/jurisprudencia/", estado: "Sentencia publicada", verificacion: VERIFICADO_AT },
  { norma: "Ley 32258", publicacion: "14/03/2025", categoria: "Reforma penal sustantiva", vigencia: "Conforme a sus disposiciones", materia: "Modifica los artículos 16 y 57 del Código Penal sobre tentativa y suspensión de la ejecución de la pena.", fuenteOficial: "Congreso de la República", url: "https://leyes.congreso.gob.pe/Documentos/2021_2026/ADLP/Texto_Consolidado/32258-TXM.pdf", estado: "Publicada", verificacion: VERIFICADO_AT },
  { norma: "Decreto Legislativo 1735", publicacion: "12/02/2026", categoria: "Organización institucional", vigencia: "Conforme a sus disposiciones", materia: "Crea el Subsistema Especializado contra la Extorsión y sus Delitos Conexos y dicta medidas para su implementación; su objeto es organizativo y operativo.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/dispositivo/NL/2486266-9", estado: "Publicado", verificacion: VERIFICADO_AT },
  { norma: "Ley 32130", publicacion: "10/10/2024", categoria: "Reforma procesal", vigencia: "Interpretada bajo control constitucional", materia: "Regula la distribución de actuaciones operativas de investigación, sin eliminar la dirección jurídica, supervisión y responsabilidad constitucional del Ministerio Público.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/dispositivo/NL/2332876-1", estado: "Publicada; alcance sujeto a interpretación constitucional", verificacion: VERIFICADO_AT },
  { norma: "STC Exp. 00005-2025-PI/TC", publicacion: "06/02/2026", categoria: "Jurisprudencia constitucional", vigencia: "Sentencia del Tribunal Constitucional", materia: "Delimita la actuación operativa policial y preserva la conducción jurídica, supervisión y responsabilidad fiscal dentro del marco constitucional.", fuenteOficial: "Tribunal Constitucional", url: "https://www.tc.gob.pe/jurisprudencia/2026/00005-2025-AI.html", estado: "Sentencia publicada", verificacion: VERIFICADO_AT },
  { norma: "Ley 32314", publicacion: "29/04/2025", categoria: "Delitos informáticos", vigencia: "Conforme a su texto", materia: "Modifica el Código Penal y la Ley 30096 para incorporar el empleo de inteligencia artificial en determinados delitos.", fuenteOficial: "Diario Oficial El Peruano", url: "https://busquedas.elperuano.pe/dispositivo/NL/2394851-2", estado: "Publicada", verificacion: VERIFICADO_AT }
];

const FUENTES_OFICIALES = [
  { categoria: "Publicación oficial", nombre: "Diario Oficial El Peruano", uso: "Permite consultar el texto oficialmente publicado de leyes, decretos, resoluciones, fe de erratas y otras disposiciones, así como su fecha de publicación.", ayuda: "¿Para qué sirve? Para comprobar cómo y cuándo fue publicada oficialmente una norma.", url: "https://diariooficial.elperuano.pe/Normas" },
  { categoria: "Legislación sistematizada", nombre: "SPIJ — Ministerio de Justicia y Derechos Humanos", uso: "Reúne textos normativos sistematizados, concordancias, modificaciones y referencias sobre vigencia o derogación.", ayuda: "¿Para qué sirve? Para seguir la evolución de una norma y revisar su texto sistematizado.", url: "https://spij.minjus.gob.pe/spij-ext-web/" },
  { categoria: "Archivo legislativo", nombre: "Congreso de la República — Archivo Digital", uso: "Ofrece leyes, decretos legislativos, antecedentes, fichas y documentos del procedimiento legislativo.", ayuda: "¿Para qué sirve? Para consultar el documento legislativo y sus antecedentes oficiales.", url: "https://leyes.congreso.gob.pe/" },
  { categoria: "Información institucional", nombre: "Ministerio Público — Fiscalía de la Nación", uso: "Publica información sobre organización fiscal, directorios, resoluciones, protocolos y servicios institucionales.", ayuda: "¿Para qué sirve? Para conocer la organización y los canales públicos del Ministerio Público.", url: "https://www.gob.pe/mpfn" },
  { categoria: "Jurisprudencia judicial", nombre: "Poder Judicial del Perú", uso: "Permite localizar acuerdos plenarios, casaciones, doctrina jurisprudencial y otros criterios emitidos por órganos judiciales.", ayuda: "¿Para qué sirve? Para revisar cómo los órganos judiciales interpretan y aplican normas penales y procesales.", url: "https://www.pj.gob.pe/wps/wcm/connect/cij-juris/s_jurisprudencia_sistematizada" },
  { categoria: "Jurisprudencia constitucional", nombre: "Tribunal Constitucional", uso: "Publica sentencias sobre derechos fundamentales, legalidad penal, debido proceso, libertad personal y control constitucional.", ayuda: "¿Para qué sirve? Para consultar criterios constitucionales relacionados con el sistema penal.", url: "https://www.tc.gob.pe/" }
];

const GUIA_ETAPAS = [
  { titulo: "1. Conceptos básicos", texto: "Conoce qué es un delito, cómo se estructura un tipo penal y cuál es la diferencia entre conducta, resultado, responsabilidad, pena y reparación civil.", accion: "Conocer lo esencial", destino: "delitos" },
  { titulo: "2. Personas e instituciones", texto: "Identifica las funciones de la persona agraviada, la persona investigada, la Policía Nacional, el Ministerio Público, la defensa y el Poder Judicial.", accion: "Ver instituciones", destino: "fiscalias" },
  { titulo: "3. Inicio de una investigación", texto: "Comprende cómo puede iniciarse una investigación mediante denuncia, intervención en flagrancia, noticia criminal o actuación de oficio.", accion: "Revisar el procedimiento", destino: "procedimientos" },
  { titulo: "4. Etapas del proceso penal", texto: "Revisa el tránsito general por diligencias preliminares, investigación preparatoria, etapa intermedia, juzgamiento, sentencia e impugnación.", accion: "Ver etapas", destino: "procedimientos" },
  { titulo: "5. Medidas y decisiones procesales", texto: "Distingue las principales medidas de coerción, sus finalidades, sus requisitos generales y la necesidad de control judicial.", accion: "Consultar medidas", destino: "medidas" },
  { titulo: "6. Verificación en fuentes oficiales", texto: "Aprende dónde consultar el texto publicado de una norma, su versión sistematizada, sus antecedentes y la jurisprudencia que orienta su interpretación.", accion: "Abrir fuentes oficiales", destino: "fuentes" }
];

const PROCEDIMIENTO = [
  { icono: "📥", nombre: "Denuncia", desc: "Denuncia, noticia policial, flagrancia o actuación de oficio." },
  { icono: "🔍", nombre: "Investigación preliminar", desc: "60 días como referencia general; puede variar conforme al CPP, el control judicial o regímenes especiales." },
  { icono: "📋", nombre: "Investigación preparatoria", desc: "120 días / 8 meses / 36 meses según el tipo de investigación." },
  { icono: "⚖️", nombre: "Etapa intermedia", desc: "Control judicial de la acusación, de la prueba y de los medios de defensa." },
  { icono: "🏛️", nombre: "Juicio oral", desc: "Unipersonal o colegiado según la pena mínima del delito (mayor de 6 años → colegiado)." },
  { icono: "📜", nombre: "Sentencia", desc: "Absolución o condena. Apelación ante la Sala Penal Superior y casación ante la Corte Suprema." }
];

/* ============================================================
   Teoría del caso e instituciones (referencial; verificar
   siempre el texto vigente en SPIJ / El Peruano)
   ============================================================ */

/* Módulo analítico de teoría del caso */
const TEORIA_PILARES = [
  { id: "tesis", nombre: "Tesis central", desc: "Enunciado provisional que explica el caso y articula hechos, norma y prueba." },
  { id: "factico", nombre: "Componente fáctico", desc: "Proposiciones relevantes, secuencia temporal, sujetos, medios y resultado." },
  { id: "juridico", nombre: "Componente jurídico", desc: "Correspondencia entre los hechos atribuidos y los elementos del tipo penal." },
  { id: "probatorio", nombre: "Componente probatorio", desc: "Fuentes, datos e inferencias que sustentan o debilitan cada proposición." },
  { id: "alternativa", nombre: "Hipótesis alternativa", desc: "Explicación rival plausible que debe contrastarse con evidencia discriminante." },
  { id: "estandar", nombre: "Estándar procesal", desc: "Nivel de respaldo exigible según la etapa y la decisión que se pretende adoptar." }
];

const TEORIA_ELEMENTOS = TEORIA_PILARES;

const TEORIA_TABS = [
  {
    id: "tesis", label: "Tesis del caso", title: "Construir una tesis provisional clara",
    intro: "La teoría comienza con una hipótesis comprensible, verificable y abierta a corrección. Debe identificar la conducta atribuida y su conexión inicial con el derecho y la prueba.",
    items: [
      ["Quién actuó", "Individualizar al sujeto y su intervención atribuida."],
      ["Qué conducta", "Precisar la acción u omisión y sus circunstancias relevantes."],
      ["Contra quién o qué", "Identificar la persona, bien o interés afectado."],
      ["Por qué medio", "Explicar el mecanismo, instrumento o forma de ejecución."],
      ["Qué resultado", "Delimitar el resultado producido o el peligro generado."],
      ["Elemento subjetivo", "Diferenciar dolo, culpa u otra exigencia subjetiva aplicable."],
      ["Clasificación provisional", "Vincular la hipótesis con el tipo penal tentativamente considerado."]
    ],
    model: "Se atribuye provisionalmente a [persona] haber realizado [conducta], mediante [medio], en perjuicio de [persona o bien], produciendo [resultado], con [elemento subjetivo], hecho que se analiza inicialmente bajo [clasificación jurídica]."
  },
  {
    id: "hechos", label: "Hechos relevantes", title: "Distinguir hechos jurídicamente relevantes",
    intro: "No todo dato del relato tiene el mismo valor. Una proposición fáctica es útil cuando puede relacionarse con un elemento jurídico y cuenta con algún sustento susceptible de contraste.",
    matrix: [
      ["Entrega de un bien individualizado", "Conducta y objeto material", "Acta, registro o declaración", "Por corroborar"],
      ["Conocimiento del origen ilícito alegado", "Elemento subjetivo", "Comunicaciones y contexto verificable", "Hipótesis en contraste"],
      ["Resultado económico atribuido", "Resultado o consecuencia", "Pericia y trazabilidad documental", "Sustento parcial"]
    ]
  },
  {
    id: "prueba", label: "Prueba e inferencias", title: "Separar la fuente, el dato y la conclusión",
    intro: "La evidencia no acredita automáticamente la conclusión final. El razonamiento debe mostrar qué dato se obtiene, qué inferencia permite y qué elemento se intenta sostener.",
    sequence: ["Fuente de prueba", "Dato obtenido", "Inferencia", "Elemento que se busca acreditar"],
    criteria: [
      ["Pertinencia", "Relación con el objeto del proceso."], ["Utilidad", "Aporte concreto al esclarecimiento."],
      ["Conducencia", "Aptitud jurídica del medio empleado."], ["Legalidad", "Obtención e incorporación conforme a las garantías."],
      ["Autenticidad", "Correspondencia e integridad de la fuente."], ["Corroboración", "Convergencia con fuentes independientes."],
      ["Limitaciones", "Sesgos, vacíos o explicaciones alternativas que reducen su fuerza."]
    ]
  },
  {
    id: "rival", label: "Hipótesis rival", title: "Contrastar explicaciones alternativas",
    intro: "Una teoría robusta no ignora la explicación contraria: identifica qué evidencia permitiría distinguir entre hipótesis y reconoce sus propias debilidades.",
    comparison: [
      ["Hipótesis principal", "La conducta atribuida responde a la explicación central del caso."],
      ["Hipótesis alternativa", "El mismo dato puede responder a una explicación lícita, accidental o atribuible a otra persona."],
      ["Evidencia discriminante", "Dato independiente que favorece una explicación frente a la otra."],
      ["Riesgo detectado", "Ambigüedad, vacío probatorio o inferencia que aún admite una explicación rival."]
    ]
  },
  {
    id: "control", label: "Control jurídico", title: "Verificar imputación, congruencia y defensa",
    intro: "La hipótesis debe conservar correspondencia entre el hecho atribuido, la calificación jurídica provisional y el objeto de contradicción. La precisión exigible aumenta conforme avanza el proceso.",
    checks: [
      "¿La imputación describe circunstancias personales, temporales y espaciales suficientes?",
      "¿Cada proposición se vincula con un elemento jurídico identificable?",
      "¿La calificación respeta el núcleo fáctico comunicado y el derecho de contradicción?",
      "¿Los cambios de hipótesis se explican sin producir una acusación sorpresiva?"
    ]
  },
  {
    id: "resultado", label: "Resultado analítico", title: "Sintetizar sin convertir la hipótesis en certeza",
    intro: "El resultado no declara responsabilidad. Ordena el grado de respaldo de la hipótesis, sus fortalezas, vacíos, riesgos y diligencias pendientes para orientar una revisión profesional.",
    summary: [
      ["Hipótesis principal", "Explicación provisional mejor conectada con los hechos, el derecho y la evidencia disponible."],
      ["Fortalezas", "Proposiciones corroboradas por fuentes convergentes y obtenidas legalmente."],
      ["Vacíos", "Elementos jurídicos o fácticos sin respaldo suficiente."],
      ["Riesgos", "Inferencias débiles, contradicciones o hipótesis rivales no descartadas."],
      ["Pendientes", "Actos de corroboración necesarios para madurar o corregir la hipótesis."],
      ["Madurez analítica", "Inicial, en desarrollo o consolidada según el respaldo disponible; nunca equivale a culpabilidad."]
    ]
  }
];

const TEORIA_ESTANDARES = [
  { etapa: "Diligencias preliminares", nivel: "Sospecha inicial simple", desc: "Puntos de partida objetivos para verificar un posible hecho punible." },
  { etapa: "Formalización", nivel: "Sospecha reveladora", desc: "Datos básicos que sostienen provisionalmente una imputación formal." },
  { etapa: "Acusación", nivel: "Sospecha suficiente", desc: "Respaldo que permite un juicio positivo de probabilidad para acusar." },
  { etapa: "Medidas coercitivas intensas", nivel: "Sospecha grave", desc: "Alto grado de probabilidad, además de los demás presupuestos propios de la medida." },
  { etapa: "Sentencia condenatoria", nivel: "Más allá de duda razonable", desc: "Convicción judicial obtenida mediante prueba actuada con garantías." }
];

const TEORIA_REFERENCIAS = [
  { label: "Constitución Política del Perú, artículo 139 inciso 14", desc: "Garantiza el derecho de defensa en todo estado del proceso.", url: "https://www.congreso.gob.pe/Docs/files/constitucion/constitucion-politica-14-03-18.pdf" },
  { label: "Código Procesal Penal, Título Preliminar, artículo IX", desc: "Reconoce el derecho de defensa y el conocimiento de la imputación.", url: "https://leyes.congreso.gob.pe/DetLeyNume_1p.aspx?xNorma=3&xNumero=957&xTipoNorma=3" },
  { label: "CPP, artículos 336, 349, 350 y 352", desc: "Referencias sobre formalización, contenido de la acusación y su control.", url: "https://leyes.congreso.gob.pe/DetLeyNume_1p.aspx?xNorma=3&xNumero=957&xTipoNorma=3" },
  { label: "Acuerdo Plenario 6-2009/CJ-116", desc: "Desarrolla el control de la acusación fiscal y su fundamento fáctico-jurídico.", url: "https://www.pj.gob.pe/wps/wcm/connect/9316758047e1159aaaedeadbd6456c83/V%2BPleno%2BJurisdiccional%2BSupremo%2BPenal%2B-%2B2009.pdf?CACHEID=9316758047e1159aaaedeadbd6456c83&MOD=AJPERES" },
  { label: "TC, Exp. 02803-2023-PHC/TC", desc: "Imputación necesaria, congruencia y conocimiento oportuno de los cargos para ejercer defensa.", url: "https://tc.gob.pe/jurisprudencia/2024/02803-2023-HC.html" }
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
  { id: "atipicidad", nombre: "Atipicidad", base: "Art. 11 CP y tipo penal concreto", texto: "La atipicidad supone que falta uno o más elementos exigidos por el tipo penal. Debe distinguirse de la insuficiencia probatoria y examinarse a partir del texto legal aplicable." },
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
  { fecha: "01/09/2026", cambio: "Revisión editorial general al 1 de septiembre de 2026: se actualizó la fecha de verificación de todo el contenido y se contrastó la normativa penal publicada hasta esta fecha." },
  { fecha: "01/09/2026", cambio: "Ley 32735 (21/07/2026): redefinición del delito de función y ampliación de la competencia del fuero militar policial (arts. III TP y 26.5 CPP). Incorporada en Normativa y en la nota de la condición «efectivo policial o militar» del verificador de competencia." },
  { fecha: "01/09/2026", cambio: "Ley 32684 (02/07/2026): equipos de comunicación en establecimientos penitenciarios (arts. 368-A y 368-D CP; arts. 37-A y 37-C del Código de Ejecución Penal) y nuevo supuesto agravado de extorsión por uso de la telefonía autorizada del penal (15 a 25 años), añadido a la calculadora." },
  { fecha: "01/09/2026", cambio: "Sentencia del Tribunal Constitucional publicada el 22/07/2026: se declararon inconstitucionales los arts. 283-A y 315-B del Código Penal (actos de colaboración con movilizaciones sociales) del D. Leg. 1589; subsisten disturbios y entorpecimiento de servicios públicos." },
  { fecha: "01/09/2026", cambio: "Nuevo delito en el catálogo: exigencia extorsiva (art. 200-A CP, incorporado por el D. Leg. 1731 del 12/02/2026), con sello «pendiente de revisión»." },
  { fecha: "01/09/2026", cambio: "Se incorporaron a Normativa los D. Leg. 1731, 1733 y 1734 (12/02/2026), antes ausentes, junto al ya registrado D. Leg. 1735." },
  { fecha: "01/09/2026", cambio: "Sentencia del Tribunal Constitucional publicada el 16/01/2026 (Exps. 00008-2025-PI/TC y acumulados): la responsabilidad penal ordinaria no se aplica a adolescentes de 16 y 17 años; la imputabilidad se mantiene a los 18. Reflejado en el régimen de adolescentes." },
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
  { fecha: "12/07/2026", cambio: "Se incorporaron el cálculo multi-delito con reglas de concurso, el informe descargable, el aviso legal y la metodología." }
];
