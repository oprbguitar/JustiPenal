# Operación de seguridad de JustiPenal

## Alertas agregadas por correo

Las funciones de API registran eventos sanitizados y, cuando Upstash Redis y Resend están configurados, agregan incidentes durante 15 minutos y aplican una pausa de una hora por incidente. No existe un endpoint público de correo. Configure en Vercel Production:

- `RESEND_API_KEY`
- `SECURITY_ALERT_TO=peru.labs.pe@gmail.com`
- `SECURITY_ALERT_FROM` (remitente de un dominio verificado en Resend)
- `SECURITY_ALERT_SIGNING_KEY` (secreto aleatorio de al menos 32 bytes)
- `SECURITY_IP_HASH_SALT` (secreto aleatorio independiente)
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`

Los mensajes omiten cuerpos, cargas útiles, cookies, cabeceras de autorización, datos personales e IP completas. Si Resend o Redis no están configurados, la aplicación continúa funcionando y conserva el registro seguro en producción.

## Reglas recomendadas para Vercel Firewall

Aplicar manualmente y comenzar en modo `log`:

1. **Chatbot:** ruta `/api/chat`, método `POST`; limitar por IP con un umbral conservador, más bajo para respuestas 400/413. Pasar a `rate limit` y devolver 429 después de revisar tráfico real.
2. **Patrones sospechosos:** registrar traversal (incluido codificado), XSS, SQLi, archivos `.env`/`.git`, configuraciones y respaldos, métodos inválidos y sondeo administrativo repetido. Después de observar falsos positivos, usar `challenge` o `deny`.
3. **Rutas sensibles:** desafiar o denegar `/.git`, `/.env`, `/wp-admin`, `/phpmyadmin`, `/server-status`, respaldos comunes y `*.map`. No confiar únicamente en el agente de usuario ni bloquear rastreadores legítimos por ese valor.

La secuencia operativa es registrar, agregar, limitar, desafiar y finalmente denegar cuando la confianza sea alta. No se realiza hack-back ni redirección de ataques.

## CSP y archivos públicos

La CSP comienza en modo report-only. `style-src` mantiene `'unsafe-inline'` porque la aplicación estática actual usa estilos en línea; `script-src` no lo habilita. No existe un bundler que genere mapas de fuentes y `.vercelignore` excluye `*.map`, archivos de desarrollo, documentación y metadatos del repositorio del despliegue.

## IndexNow opcional

El archivo público de verificación es `/ae96f50a6042d85573a67630ea8cb686.txt`. IndexNow está desactivado por defecto. Para notificar solamente URL canónicas modificadas:

```text
INDEXNOW_ENABLED=true
INDEXNOW_KEY=ae96f50a6042d85573a67630ea8cb686
INDEXNOW_CHANGED_URLS=https://justipenal.andesnova.solutions/
```

Ejecute `npm run indexnow` después de un cambio público material. El script rechaza API, fragmentos y otros dominios, y guarda una huella local para no repetir una notificación idéntica. Para deshabilitarlo use `INDEXNOW_ENABLED=false`.

## Repositorio

La visibilidad del repositorio se administra manualmente en GitHub. Los cambios de este proyecto no alteran esa visibilidad.
