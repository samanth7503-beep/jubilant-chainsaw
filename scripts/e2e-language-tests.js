// Simple end-to-end language service smoke tests
const BASE = process.env.API_BASE || "http://localhost:8080";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  console.log(path, "->", data);
}

async function main() {
  console.log("Using API base:", BASE);
  await post("/api/language/detect", { text: "Bonjour, comment ça va?" });
  await post("/api/language/detect", { text: "नमस्ते, आप कैसे हैं?" });
  await post("/api/language/translate", { text: "Hello world", targetLanguage: "hi" });
  await post("/api/language/translate", { text: "यह एक परीक्षण है", sourceLanguage: "hi", targetLanguage: "en" });
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
