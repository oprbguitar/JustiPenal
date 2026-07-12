import test from "node:test";
import assert from "node:assert/strict";
import handler, { containsSensitiveIdentifier, validateFeedbackPayload } from "../api/feedback.js";

function response() {
  return {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

const valid = (changes = {}) => ({ category: "improve", message: "Añadir una explicación más breve.", section: "inicio", pathname: "/", website: "", ...changes });

test("valida y recorta una opinión segura", () => {
  assert.deepEqual(validateFeedbackPayload(valid({ message: "  Mejorar el contraste.  " })).value, {
    category: "improve", message: "Mejorar el contraste.", section: "inicio", pathname: "/"
  });
  assert.equal(validateFeedbackPayload(valid({ category: "otro" })).status, 400);
  assert.equal(validateFeedbackPayload(valid({ message: "ok" })).status, 400);
  assert.equal(validateFeedbackPayload(valid({ pathname: "/?dato=1" })).status, 400);
});

test("rechaza identificadores sensibles frecuentes", () => {
  for (const value of ["Mi DNI es 12345678", "correo persona@example.com", "RUC 20123456789", "teléfono 987 654 321", "expediente 12345-2024-0-1801-JR-PE-01"]) {
    assert.equal(containsSensitiveIdentifier(value), true, value);
    assert.equal(validateFeedbackPayload(valid({ message: value })).status, 400);
  }
});

test("honeypot responde sin intentar almacenar", async () => {
  const req = { method: "POST", headers: { "content-type": "application/json" }, body: valid({ website: "bot.example" }) };
  const res = response();
  await handler(req, res);
  assert.equal(res.statusCode, 202);
  assert.deepEqual(res.body, { ok: true });
});

test("endpoint acepta solo POST JSON", async () => {
  const methodRes = response();
  await handler({ method: "GET", headers: {}, body: undefined }, methodRes);
  assert.equal(methodRes.statusCode, 405);
  assert.equal(methodRes.headers.Allow, "POST");
  const typeRes = response();
  await handler({ method: "POST", headers: { "content-type": "text/plain" }, body: valid() }, typeRes);
  assert.equal(typeRes.statusCode, 415);
  assert.match(typeRes.headers["Cache-Control"], /no-store/);
});
