const SERVICE = "JustiPenal Chat";

export function getHealthChecks(env = process.env) {
  const redisUrl = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return {
    geminiKeyConfigured: Boolean(env.GEMINI_API_KEY),
    modelConfigured: Boolean(env.GEMINI_MODEL || "gemini-3.5-flash"),
    persistentRateLimitConfigured: Boolean(redisUrl && redisToken),
    rateLimitSaltConfigured: Boolean(env.RATE_LIMIT_SALT),
    allowedOriginConfigured: Boolean(env.ALLOWED_ORIGIN)
  };
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido.", code: "INVALID_REQUEST", requestId: "health-method" });
  }
  res.setHeader("Cache-Control", "no-store");
  const checks = getHealthChecks();
  const ok = checks.geminiKeyConfigured && checks.modelConfigured && checks.persistentRateLimitConfigured && checks.rateLimitSaltConfigured;
  return res.status(200).json({ ok, service: SERVICE, checks });
}
