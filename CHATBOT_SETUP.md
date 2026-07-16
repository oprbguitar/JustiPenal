# Configuración del Asistente JustiPenal

El frontend público se sirve desde `https://justipenal.andesnova.solutions`. La clave de Gemini solo existe como variable de entorno cifrada de Vercel y nunca debe incluirse en HTML, JavaScript del navegador, archivos `.env` versionados ni el historial de Git.

## 1. Crear una clave segura de Gemini

1. Abra [Google AI Studio](https://aistudio.google.com/apikey) con la cuenta responsable del proyecto.
2. Cree una clave de API asociada a un proyecto dedicado.
3. Restrinja la clave, cuando la consola lo permita, a la API Generative Language y revise periódicamente su uso.
4. No active facturación si desea permanecer en el nivel gratuito. Los límites gratuitos pueden cambiar; consulte la página oficial de precios antes de producción.

Si una clave se publicó, se compartió en un canal no confiable o apareció en Git, revóquela inmediatamente en AI Studio, cree otra y actualice `GEMINI_API_KEY` en Vercel. Borrar el archivo o el commit no basta porque el secreto puede permanecer en el historial.

## 2. Variables de entorno en Vercel

Configure en Project Settings → Environment Variables, para Production y, si corresponde, Preview/Development:

```text
GEMINI_API_KEY=<clave secreta>
GEMINI_MODEL=gemini-3.5-flash
ALLOWED_ORIGIN=https://justipenal.andesnova.solutions
CHAT_MAX_INPUT_CHARS=4000
UPSTASH_REDIS_REST_URL=<URL REST de Upstash Redis>
UPSTASH_REDIS_REST_TOKEN=<token REST de Upstash Redis>
RATE_LIMIT_SALT=<secreto aleatorio de alta entropía>
```

- `GEMINI_API_KEY` es obligatoria y secreta.
- `GEMINI_MODEL` es opcional; el backend usa `gemini-3.5-flash` cuando falta.
- `ALLOWED_ORIGIN` admite una URL con ruta o barra final y el backend la normaliza al origen. También puede contener varios orígenes separados por comas. En producción debe incluir `https://justipenal.andesnova.solutions`.
- `CHAT_MAX_INPUT_CHARS` es opcional; el valor predeterminado es 4000.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` y `RATE_LIMIT_SALT` son obligatorias en producción para aplicar el límite persistente. La dirección de red se identifica únicamente mediante HMAC-SHA256 y no se guarda en texto claro.
- Alternativa recomendada: instalar **Upstash for Redis desde el Marketplace de Vercel** (Storage → Upstash → Redis, o `npx vercel integration add upstash/upstash-kv`). El recurso inyecta automáticamente `KV_REST_API_URL` y `KV_REST_API_TOKEN`, que el backend acepta como equivalentes; solo queda `RATE_LIMIT_SALT` por definir manualmente.

No use prefijos públicos como `NEXT_PUBLIC_` ni coloque valores reales en `.env.example`.

## 3. Desplegar el backend

Desde la raíz del repositorio:

```powershell
npm install
npm test
npx vercel link
npx vercel --prod
```

Vercel detecta `api/chat.js` como función Node.js. El endpoint público es `POST https://justipenal.andesnova.solutions/api/chat`.

## 4. Configurar el frontend público

Edite `js/config.js` únicamente con la URL pública de producción:

```js
window.JUSTIPENAL_CONFIG = {
  apiBaseUrl: "https://justipenal.andesnova.solutions",
  siteUrl: "https://justipenal.andesnova.solutions"
};
```

Esta URL no es un secreto. Si falta o conserva el marcador `YOUR-JUSTIPENAL-API`, el envío queda deshabilitado sin afectar las herramientas locales.

## 5. Pruebas locales

```powershell
npm install
npm run build:kb
npm test
npm run test:syntax
npx vercel dev
```

Abra la URL indicada por Vercel. En desarrollo, el backend acepta `localhost` y `127.0.0.1`; en producción solo acepta `ALLOWED_ORIGIN`.

## 6. Privacidad y límites actuales

- El analizador de casos sigue ejecutándose íntegramente en el navegador y nunca se envía al abrir el chat.
- Cada mensaje escrito en el chat sí se envía a Vercel y Gemini.
- “Preguntar sobre este resultado” requiere confirmación y transmite solo campos estructurados permitidos; excluye el relato, nombres, DNI, domicilios, fechas, lugar y documentos.
- El historial visible permanece en memoria del navegador y se pierde al recargar; el mensaje actual y hasta cuatro mensajes recientes del usuario se procesan mediante Vercel y Gemini.
- Gemini se invoca con `store: false`, sin búsqueda web, URL context, ejecución de código ni funciones.
- El límite de 10 consultas por cada 2 horas se aplica mediante Upstash Redis usando un identificador HMAC de la dirección de red. En desarrollo local existe un fallback en memoria; en producción el chat se deshabilita si Redis o la sal criptográfica no están configurados.
- Supabase no es necesario para el funcionamiento actual y no contiene tablas del chatbot.

## 7. Desactivar el asistente

Vacíe `apiBaseUrl` o restablezca el marcador en `js/config.js`. El botón seguirá informando que la IA no está configurada y el portal local permanecerá operativo. También puede retirar `GEMINI_API_KEY` de Vercel para desactivar el backend.
