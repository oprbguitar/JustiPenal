# ⚖️ JustiPenal — Portal Informativo del Sistema Penal Peruano

### 🌐 Visita el portal aquí: **[https://oprbguitar.github.io/JustiPenal/](https://oprbguitar.github.io/JustiPenal/)**

Funciona en computadora, tablet y celular. No requiere registro. Las herramientas deterministas siguen siendo gratuitas y locales; el asistente opcional procesa únicamente los mensajes que el usuario decide enviar.

---

## ¿Qué es JustiPenal?

**JustiPenal** es un portal web informativo y gratuito sobre el sistema penal del Perú. Está pensado para dos públicos a la vez:

- **Ciudadanos sin conocimientos jurídicos** que quieren entender qué delito podría configurar un hecho, qué pena contempla la ley o cuánto puede durar una investigación.
- **Abogados, estudiantes de derecho y analistas** que necesitan una referencia rápida de rangos de pena, plazos, competencia fiscal y normativa reciente, con enlace a la fuente oficial de cada dato.

En cada sección del portal encontrarás un **símbolo (?)** junto al título: haz clic en él y una ventana breve te explica qué hace esa herramienta y cómo interpretarla, en lenguaje simple.

## ¿Qué puedes hacer en el portal? — Guía de módulos

### 🔎 Analizar un caso con tus propias palabras
Escribe lo que pasó — por ejemplo: *"Dos personas entraron a una tienda, amenazaron al vendedor con un cuchillo y se llevaron tres teléfonos"* — y el portal:
1. **Extrae los hechos relevantes**: violencia, amenaza, armas, número de personas, lesiones, lugar.
2. **Propone hipótesis delictivas**: una principal (p. ej. robo agravado), alternativas (si algo no se confirma, la calificación baja a robo simple o hurto) y delitos conexos (p. ej. lesiones).
3. **Construye una matriz de tipicidad**: una tabla que compara cada requisito legal del delito con lo que relataste, clasificando cada elemento como *confirmado, compatible, inferido, no determinado o ausente* — así entiendes **por qué** aparece esa hipótesis y qué podría descartarla.
4. **Te dice qué información falta**: certificado médico-legal, tipo de arma, valor de los bienes, fecha del hecho.
5. Con un clic, **carga la hipótesis en la calculadora de penas**.

> 🔒 **Privacidad**: el análisis se ejecuta íntegramente en tu navegador. El texto que escribes **no se envía a ningún servidor** y desaparece al cerrar la página. Aun así, evita ingresar nombres o datos de personas reales.

### 🧮 Calcular una pena referencial — con uno o varios delitos
Arma un caso agregando **uno o más delitos** (por ejemplo, robo agravado + lesiones). Para cada uno marcas sus circunstancias y el portal muestra:

- El **rango referencial de individualización** aplicando el **sistema de tercios** del art. 45-A del Código Penal (tercio inferior, intermedio o superior), explicando qué circunstancias determinaron la ubicación.
- La **regla contra la doble valoración**: si una circunstancia ya integra la modalidad agravada elegida (p. ej. la pluralidad de agentes en el robo agravado), el portal la excluye del cómputo y te lo advierte.
- Con dos o más delitos, los **escenarios de concurso** (real, ideal, delito continuado y concurso aparente, arts. 48-50), con sus topes legales — **sin sumar penas mecánicamente**, porque la regla aplicable exige análisis jurídico.
- **Tentativa, reincidencia y habitualidad** con etiquetas honestas: el portal distingue lo *calculado automáticamente* de lo que *requiere decisión judicial motivada* o *no es calculable* sin antecedentes verificados.
- **Bonificaciones procesales** (confesión sincera, terminación anticipada, conclusión anticipada) mostradas como **escenarios A/B/C** sobre los extremos del tercio — nunca como una cifra única inventada.
- Las **otras consecuencias**: días-multa, inhabilitación y penas alternativas cuando el delito las contempla, además de la reparación civil.
- El **órgano judicial** de juzgamiento (unipersonal o colegiado, según la pena mínima).
- La **fiscalía posiblemente competente**, considerando materia, territorio y condición del investigado (funcionario, aforado, policía/militar, adolescente), con enlace al directorio oficial del distrito fiscal.
- La **trazabilidad completa**: cada delito enlaza a su fuente oficial (SPIJ), con fecha de última comprobación y un sello de estado (*verificado / pendiente / posiblemente modificado*).
- Un **informe descargable** — *Informe preliminar de análisis penal referencial* — en **Word, Markdown, TXT**, copiable al portapapeles o imprimible como **PDF**.

### 🧭 Teoría del caso y glosario (pseudo-wiki)
Sección educativa con los **tres elementos de la teoría del caso** (fáctico, jurídico y probatorio), un **checklist probatorio por familia de delito** (qué medios de prueba suelen sustentar cada tipo de caso), la **perspectiva de la defensa** (atipicidad, legítima defensa, estado de necesidad, errores del art. 14, in dubio pro reo), las **instituciones del proceso y de la pena** (principio de oportunidad, suspensión de la pena, prescripción, beneficios penitenciarios, flagrancia, régimen de adolescentes, acuerdos plenarios) y un **glosario penal** consultable en lenguaje simple. Todo este contenido también alimenta al asistente.

### ⚖️ Consultar delitos y penas
Catálogo con **más de 50 modalidades delictivas** de las familias más frecuentes: vida (homicidio, feminicidio, sicariato), integridad (lesiones), familia (omisión de asistencia familiar), libertad (secuestro, trata, coacción), libertad sexual, patrimonio (hurto, robo, estafa, extorsión, usurpación), drogas (con sus artículos diferenciados: tráfico 296, insumos químicos 296-B, formas agravadas 297, microcomercialización 298), corrupción (colusión, peculado, cohecho), lavado de activos, delitos tributarios, informáticos, fe pública y crimen organizado. Cada fila incluye artículo con enlace oficial, rango de pena, multa/inhabilitación y sello de verificación.

### 🕐 Calcular plazos procesales
Indica el **acto que inicia el cómputo** (disposición fiscal, formalización, detención), la fecha y — si la conoces — la fecha de notificación. El portal estima el vencimiento con su **base normativa** (artículo del CPP), un **nivel de certeza** (alta/media/baja) y la lista de información faltante. Incluye los plazos de: diligencias preliminares (60 días), investigación preparatoria ordinaria (120 días + 60), compleja (8 meses + 8) y de criminalidad organizada (36 meses + 36), además de los máximos de prisión preventiva.

### 📂 Entender el procedimiento penal
Diagrama del proceso penal común paso a paso (denuncia → investigación preliminar → preparatoria → etapa intermedia → juicio oral → sentencia → apelación → casación), las rutas especiales (proceso inmediato, terminación anticipada, colaboración eficaz) y la distribución actual de funciones entre la **Policía Nacional y el Ministerio Público** tras la Ley 32130 y la sentencia del Tribunal Constitucional de 2026.

### 👥 Conocer las fiscalías
La jerarquía del Ministerio Público (provinciales, superiores, supremas), las **14 especialidades fiscales** y el verificador de competencia por sus **cuatro dimensiones**: materia, territorio, condición de la persona y etapa del proceso.

### 📄 Revisar la normativa vigente
Las normas base del sistema penal y las **modificaciones recientes** con fecha de publicación, materia, fuente, estado y fecha de verificación — por ejemplo, la Ley 32258 (14/03/2025, tentativa y suspensión de penas) y el D. Leg. 1735 (12/02/2026, subsistema contra la extorsión).

## ¿De dónde sale la información?

Todo el contenido proviene de **fuentes públicas y oficiales del Estado peruano**, enlazadas dentro del portal:

| Prioridad | Fuente | Qué aporta |
|---|---|---|
| 1 | Diario Oficial **El Peruano** | Textos oficiales, fechas de publicación y vigencia |
| 2 | **SPIJ** (Ministerio de Justicia) | Normas sistematizadas y actualizadas |
| 3 | **Congreso de la República** | Textos originales de leyes y decretos |
| 4 | **Ministerio Público** | Directorios y fiscalías especializadas |
| 5 | **Poder Judicial** | Jurisprudencia, acuerdos plenarios y casaciones |
| 6 | **Tribunal Constitucional** | Criterios sobre derechos fundamentales |

La página de **Metodología** del portal explica quién actualiza los datos, qué fuente prevalece ante contradicciones, cómo se manejan las derogaciones (una norma derogada no se borra: puede aplicarse a hechos anteriores) y mantiene un **registro público de cambios**.

## Tecnología

- Frontend estático en GitHub Pages (HTML + CSS + JavaScript puro) y un endpoint serverless aislado en Vercel para el asistente opcional.
- El analizador y las calculadoras continúan ejecutándose localmente, sin enviar relatos ni campos del caso.
- El asistente usa la API de Interactions de Gemini mediante `@google/genai`, con `store: false`, recuperación determinista desde `data/legal-kb.json` y sin herramientas de navegación.
- Supabase no almacena conversaciones ni datos de casos.
- Animaciones con **AOS** (revelado al hacer scroll) y **anime.js** (contadores y transiciones), con degradación elegante si las librerías no cargan y respeto por `prefers-reduced-motion`.
- **Diseño responsive**: menú lateral deslizable con botón hamburguesa accesible en celulares (soporte de teclado, `aria-expanded`, bloqueo de scroll de fondo) y panel de fuentes oficiales en pantallas anchas.
- Publicado automáticamente en **GitHub Pages** mediante GitHub Actions en cada actualización.

## ¿Encontraste un error?

Abre un *Issue* en este repositorio indicando: la norma o dato observado, lo que dice el portal, y la **fuente oficial** que respalda la corrección (enlace a El Peruano o SPIJ). Todo cambio aceptado queda registrado en el historial de cambios de la página de Metodología.

## ⚠️ Importante — Aviso legal

> Este portal es **informativo y referencial**. No constituye asesoría legal ni reemplaza la evaluación de un abogado, la investigación fiscal o la decisión de un juez. La pena concreta de un caso real solo la determina el **Poder Judicial** tras un proceso con todas las garantías. El analizador y las calculadoras se ejecutan íntegramente en el navegador. Solo los mensajes que el usuario escribe en el asistente —o el resumen estructurado que confirma expresamente— se procesan mediante Vercel y Gemini; no deben incluir datos personales o reservados. Consulte [CHATBOT_SETUP.md](CHATBOT_SETUP.md) para la arquitectura, configuración y límites de privacidad.

---

© 2026 JustiPenal — Portal Informativo del Sistema Penal Peruano
