import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { checkMemoryBucket, cleanString, clientIdentifier, isPlainObject, normalizeSecurityText } from "./chat.js";

const CATEGORIES = new Set(["add", "improve", "remove", "error"]);
const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const memoryBuckets = new Map();
let limiter;
let limiterKey = "";

export function containsSensitiveIdentifier(value) {
  const text = normalizeSecurityText(value);
  return [
    /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/i,
    /\b(?:dni|documento(?: de identidad)?)\s*[:#.-]?\s*\d{8}\b/i,
    /\b\d{8}\b/,
    /\b(?:ruc\s*[:#.-]?\s*)?(?:10|15|17|20)\d{9}\b/i,
    /(?:\+?51[\s.-]?)?(?:9\d{2}[\s.-]?\d{3}[\s.-]?\d{3})\b/,
    /\b(?:exp(?:ediente)?|caso)\s*(?:n[.°ºo]*|número|num\.?|#)?\s*[:.-]?\s*\d{2,}(?:[-/]\d{2,})+/i,
    /\b\d{4,6}-\d{4}-\d(?:-\d{4})?(?:-[a-z]{2}-[a-z]{2})?(?:-\d{2})?\b/i
  ].some((pattern) => pattern.test(text));
}

export function validateFeedbackPayload(body) {
  if (!isPlainObject(body)) return { status: 400 };
  if (typeof body.website !== "undefined" && typeof body.website !== "string") return { status: 400 };
  if (cleanString(body.website, 200)) return { honeypot: true };
  if (!CATEGORIES.has(body.category)) return { status: 400 };
  if (typeof body.message !== "string") return { status: 400 };
  const message = cleanString(body.message, 501);
  if (message.length < 3 || message.length > 500) return { status: 400 };
  if (containsSensitiveIdentifier(message)) return { status: 400 };
  if (typeof body.section !== "string" || body.section.length > 120) return { status: 400 };
  if (typeof body.pathname !== "string" || body.pathname.length > 200 || !body.pathname.startsWith("/") || /[?#]/.test(body.pathname)) return { status: 400 };
  return { value: { category: body.category, message, section: cleanString(body.section, 120) || null, pathname: cleanString(body.pathname, 200) } };
}

function securityHeaders(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
}

function getLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url || !token) return null;
  const key = `${url}\u0000${token}`;
  if (!limiter || limiterKey !== key) {
    limiter = new Ratelimit({ redis: new Redis({ url, token }), limiter: Ratelimit.fixedWindow(RATE_LIMIT_MAX, "24 h"), analytics: false, prefix: "justipenal:feedback" });
    limiterKey = key;
  }
  return limiter;
}

async function checkRateLimit(identifier) {
  const persistent = getLimiter();
  if (persistent) return persistent.limit(identifier);
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") throw new Error("rate_limit_unavailable");
  return checkMemoryBucket(memoryBuckets, identifier, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
}

async function storeFeedback(value) {
  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  let url;
  try { url = new URL(`${baseUrl}/rest/v1/site_feedback`); } catch { throw new Error("storage_unavailable"); }
  if (url.protocol !== "https:" || !key) throw new Error("storage_unavailable");
  const response = await fetch(url, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(value),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error("storage_unavailable");
}

export default async function handler(req, res) {
  securityHeaders(res);
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "method_not_allowed" }); }
  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) return res.status(415).json({ error: "invalid_request" });
  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) return res.status(413).json({ error: "invalid_request" });
  let serialized;
  try { serialized = JSON.stringify(req.body); } catch { return res.status(400).json({ error: "invalid_request" }); }
  if (Buffer.byteLength(serialized || "", "utf8") > MAX_BODY_BYTES) return res.status(413).json({ error: "invalid_request" });

  const validation = validateFeedbackPayload(req.body);
  if (validation.honeypot) return res.status(202).json({ ok: true });
  if (!validation.value) return res.status(validation.status || 400).json({ error: "invalid_request" });

  try {
    const rate = await checkRateLimit(clientIdentifier(req));
    if (!rate.success) return res.status(429).json({ error: "rate_limited" });
    await storeFeedback(validation.value);
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(503).json({ error: "service_unavailable" });
  }
}
