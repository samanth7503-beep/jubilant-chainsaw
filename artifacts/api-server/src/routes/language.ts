import { Router, type IRouter } from "express";
import { getGeminiLanguageConfig, TranslationService, detectLanguage } from "@workspace/languages";

const router: IRouter = Router();

router.post("/detect", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const detection = await detectLanguage(text);
    res.json(detection);
  } catch (err) {
    console.error("/language/detect error", err);
    res.status(500).json({ error: "Language detection failed" });
  }
});

router.post("/translate", async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    if (!text || typeof text !== "string" || !targetLanguage) {
      return res.status(400).json({ error: "Missing required fields: text, targetLanguage" });
    }

    const cfg = getGeminiLanguageConfig();
    const svc = new TranslationService(cfg.apiKey, cfg.baseUrl);

    // If sourceLanguage not provided, attempt detection
    let source = sourceLanguage;
    if (!source) {
      const detected = await detectLanguage(text);
      source = detected.code;
    }

    const result = await svc.translate({
      text,
      sourceLanguage: source as any,
      targetLanguage: targetLanguage as any,
    });

    res.json(result);
  } catch (err) {
    console.error("/language/translate error", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
