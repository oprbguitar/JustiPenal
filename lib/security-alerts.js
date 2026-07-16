import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 15 * 60;
const COOLDOWN_SECONDS = 60 * 60;
const THRESHOLDS = Object.freeze({
  origin_blocked: 3,
  rate_limited: 3,
  prompt_exfiltration: 3,
  malformed_request: 8,
  oversized_request: 3,
  server_error: 5
});

let redis;
let redisKey = "";

function clean(value, max = 160) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function escapeHtml(value) {
  return clean(value, 500).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function requestPath(req) {
  try { return new URL(req?.url || "/", "https://justipenal.andesnova.solutions").pathname.slice(0, 200); }
  catch { return "/"; }
}

function requestIp(req) {
  return String(req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || "unknown").split(",")[0].trim();
}

function digest(secret, value, length = 24) {
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, length);
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url || !token) return null;
  const key = `${url}\u0000${token}`;
  if (!redis || redisKey !== key) {
    redis = new Redis({ url, token });
    redisKey = key;
  }
  return redis;
}

export function sanitizedSecurityEvent(req, event = {}) {
  const ipSalt = process.env.SECURITY_IP_HASH_SALT || process.env.RATE_LIMIT_SALT || "local-security-log";
  return {
    utc: new Date().toISOString(),
    peru: new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", dateStyle: "medium", timeStyle: "medium", hour12: false }).format(new Date()),
    category: clean(event.category || "security_event", 60),
    route: requestPath(req),
    method: clean(req?.method || "UNKNOWN", 12),
    status: Number(event.status) || 0,
    attempts: Math.max(1, Number(event.attempts) || 1),
    userAgent: clean(req?.headers?.["user-agent"] || "unknown", 160),
    ipId: digest(ipSalt, requestIp(req), 16),
    action: clean(event.action || "log", 24),
    requestId: clean(req?.headers?.["x-vercel-id"] || req?.headers?.["x-vercel-request-id"] || "unavailable", 120)
  };
}

async function sendAlert(event, incidentId, windowId) {
  const apiKey = process.env.RESEND_API_KEY || "";
  const to = process.env.SECURITY_ALERT_TO || "";
  const from = process.env.SECURITY_ALERT_FROM || "";
  if (!apiKey || !to || !from) return false;
  if (![to, from].every((value) => value.length <= 254 && !/[\r\n]/.test(value))) return false;

  const rows = [
    ["UTC", event.utc], ["Hora Perú", event.peru], ["Categoría", event.category],
    ["Ruta", event.route], ["Método", event.method], ["Estado", event.status],
    ["Intentos", event.attempts], ["Agente", event.userAgent], ["IP anonimizada", event.ipId],
    ["Acción", event.action], ["Solicitud Vercel", event.requestId]
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 10px;border-bottom:1px solid #dbe3f0">${escapeHtml(label)}</th><td style="padding:6px 10px;border-bottom:1px solid #dbe3f0">${escapeHtml(value)}</td></tr>`).join("");
  const text = rows.map(([label, value]) => `${label}: ${clean(value, 500)}`).join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `justipenal-security-${incidentId}-${windowId}`
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[JustiPenal] Alerta agregada: ${event.category}`,
      html: `<div style="font-family:Arial,sans-serif;color:#10243f"><h2>Alerta de seguridad agregada</h2><table style="border-collapse:collapse">${htmlRows}</table><p>El mensaje no incluye cargas útiles, cookies, credenciales ni cuerpos de solicitud.</p></div>`,
      text: `Alerta de seguridad agregada\n\n${text}\n\nNo incluye cargas útiles, cookies, credenciales ni cuerpos de solicitud.`
    }),
    signal: AbortSignal.timeout(8000)
  });
  return response.ok;
}

export async function recordSecurityEvent(req, event = {}) {
  const sanitized = sanitizedSecurityEvent(req, event);
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    console.warn(JSON.stringify({ type: "justipenal_security", ...sanitized }));
  }
  try {
    const signingKey = process.env.SECURITY_ALERT_SIGNING_KEY || "";
    const store = getRedis();
    if (!signingKey || !store) return { logged: true, alerted: false };
    const threshold = THRESHOLDS[sanitized.category] || 10;
    const incidentId = digest(signingKey, `${sanitized.category}|${sanitized.route}|${sanitized.ipId}`);
    const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
    const counterKey = `justipenal:security:event:${incidentId}:${windowId}`;
    const attempts = await store.incr(counterKey);
    if (attempts === 1) await store.expire(counterKey, WINDOW_SECONDS * 2);
    if (attempts < threshold) return { logged: true, alerted: false, attempts };

    const cooldownKey = `justipenal:security:cooldown:${incidentId}`;
    const acquired = await store.set(cooldownKey, "1", { nx: true, ex: COOLDOWN_SECONDS });
    if (!acquired) return { logged: true, alerted: false, attempts };
    const alerted = await sendAlert({ ...sanitized, attempts }, incidentId, windowId);
    return { logged: true, alerted, attempts };
  } catch {
    return { logged: true, alerted: false };
  }
}
