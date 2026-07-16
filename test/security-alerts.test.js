import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, sanitizedSecurityEvent } from "../lib/security-alerts.js";

test("sanitiza alertas sin exponer IP, query ni valores HTML", () => {
  const oldSalt = process.env.SECURITY_IP_HASH_SALT;
  process.env.SECURITY_IP_HASH_SALT = "test-only-long-random-salt";
  try {
    const event = sanitizedSecurityEvent({
      method: "POST",
      url: "/api/chat?payload=secreto",
      headers: { "x-forwarded-for": "203.0.113.42", "user-agent": "<script>alert(1)</script>" }
    }, { category: "prompt_exfiltration", status: 403, action: "deny" });
    assert.equal(event.route, "/api/chat");
    assert.equal(event.ipId.length, 16);
    assert.notEqual(event.ipId, "203.0.113.42");
    assert.equal(Object.hasOwn(event, "body"), false);
    assert.equal(escapeHtml(event.userAgent), "&lt;script&gt;alert(1)&lt;/script&gt;");
  } finally {
    if (oldSalt === undefined) delete process.env.SECURITY_IP_HASH_SALT; else process.env.SECURITY_IP_HASH_SALT = oldSalt;
  }
});
