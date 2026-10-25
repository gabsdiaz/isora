import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Corrección con IA (Claude) de textos escritos o respuestas habladas.
 * - Solo para estudiantes con sesión de Google (se verifica el token de Firebase).
 * - Límite diario por estudiante para controlar el gasto.
 * - Si falta ANTHROPIC_API_KEY responde 503 y la web muestra las alternativas.
 */
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
const DAILY_LIMIT = Number(process.env.CORRECTION_DAILY_LIMIT || 20);
const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

// Contador sencillo en memoria (por instancia del servidor)
const usage = new Map<string, { day: string; n: number }>();

type Body = {
  text: string;
  task: string;
  level: string;
  kind: "writing" | "speaking";
  lang: "es" | "en";
};

const SYSTEM = (b: Body) => `Du bist eine freundliche, genaue Deutschlehrerin. Du korrigierst ${b.kind === "speaking" ? "die transkribierte mündliche Antwort" : "den Text"} eines Lernenden auf Niveau ${b.level} (GER).
Aufgabe des Lernenden: "${b.task}"
Regeln:
- Korrigiere Grammatik, Rechtschreibung, Wortstellung und Wortwahl. ${b.kind === "speaking" ? "Ignoriere Groß-/Kleinschreibung und Satzzeichen (es ist eine Transkription)." : ""}
- Bewerte nur auf dem Niveau ${b.level}: verlange keine Strukturen, die auf diesem Niveau noch nicht gelernt werden.
- Die korrigierte Version soll so nah wie möglich am Original bleiben.
- Erklärungen kurz, klar und ermutigend, in der Sprache des Lernenden: ${b.lang === "en" ? "Englisch" : "Spanisch"}.
- Antworte NUR mit gültigem JSON, ohne Markdown, in diesem Format:
{"corrected": string, "score": number (0-10), "taskDone": boolean, "summary": string, "errors": [{"original": string, "correction": string, "explanation": string, "type": "grammar"|"spelling"|"word-order"|"vocabulary"}], "tip": string}`;

export async function POST(req: Request) {
  if (!API_KEY) return Response.json({ error: "not-configured" }, { status: 503 });

  // 1) ¿Quién es? (token de Firebase)
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token || !PROJECT) return Response.json({ error: "unauthorized" }, { status: 401 });
  let uid: string;
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
    uid = String(payload.sub);
  } catch {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2) Límite diario
  const day = new Date().toISOString().slice(0, 10);
  const u = usage.get(uid);
  const n = u && u.day === day ? u.n : 0;
  if (n >= DAILY_LIMIT) return Response.json({ error: "limit" }, { status: 429 });

  // 3) Datos
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const text = String(body.text ?? "").slice(0, 2500).trim();
  if (text.length < 3) return Response.json({ error: "empty" }, { status: 400 });
  const b: Body = { text, task: String(body.task ?? "").slice(0, 400), level: String(body.level ?? "A1.1").slice(0, 8), kind: body.kind === "speaking" ? "speaking" : "writing", lang: body.lang === "en" ? "en" : "es" };

  // 4) Claude
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 1200, system: SYSTEM(b), messages: [{ role: "user", content: b.text }] }),
  }).catch(() => null);
  if (!r || !r.ok) return Response.json({ error: "ai-failed", status: r?.status ?? 0 }, { status: 502 });

  const data = (await r.json()) as { content?: { type: string; text?: string }[] };
  const raw = data.content?.find((c) => c.type === "text")?.text ?? "";
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  try {
    const result = JSON.parse(json);
    usage.set(uid, { day, n: n + 1 });
    return Response.json({ ...result, remaining: DAILY_LIMIT - n - 1 });
  } catch {
    return Response.json({ error: "ai-format" }, { status: 502 });
  }
}
