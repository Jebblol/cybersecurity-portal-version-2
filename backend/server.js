import express from "express";

const app = express();
app.use(express.json());

// ---- CORS (lock this down to your GitHub Pages URL) ----
// Replace this with your real GitHub Pages origin:
// e.g. https://jebusername.github.io/cybersafehub
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!ALLOWED_ORIGIN) {
    // If you forget to set it, don't block (demo-friendly, but less strict).
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.send("CyberSafeHub API is running.");
});

// ---- Gemini proxy endpoint ----
// Uses Gemini REST generateContent docs. :contentReference[oaicite:1]{index=1}
app.post("/api/analyze-email", async (req, res) => {
  try {
    const { sender = "", subject = "", body = "", link = "" } = req.body || {};

    // Basic input size guard (prevents insane payloads)
    const clamp = (s, max) => String(s).slice(0, max);
    const senderC = clamp(sender, 200);
    const subjectC = clamp(subject, 300);
    const bodyC = clamp(body, 5000);
    const linkC = clamp(link, 500);

    const prompt = `
You are a cybersecurity assistant. Analyze this email and decide how likely it is a scam.

Return:
1) Risk label: Low / Medium / High
2) Risk percent: a number from 0 to 100
3) 3-7 bullet red flags (if any)
4) 2-3 safe next actions

Keep it short and non-technical.

Sender: ${senderC}
Subject: ${subjectC}
Body: ${bodyC}
Link: ${linkC}
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY on server." });
    }

    // Model can change over time; Gemini docs show generateContent usage. :contentReference[oaicite:2]{index=2}
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ error: "Gemini request failed", details: errText });
    }

    const data = await r.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI output returned.";

    res.json({ aiExplanation: aiText });
  } catch (e) {
    res.status(500).json({ error: "Server error", details: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API listening on", PORT));
