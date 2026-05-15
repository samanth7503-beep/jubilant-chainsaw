/**
 * Language API Routes
 * 
 * Endpoints for language detection, translation, and content generation
 */

import { Router, Request, Response } from "express";
import { createLanguageAPIService } from "../lib/language-service";
import { isValidLanguageCode } from "@workspace/languages";

const router = Router();
const languageService = createLanguageAPIService();

/**
 * POST /api/language/detect
 * 
 * Detect the language of input text
 * 
 * Body:
 * {
 *   "text": "Hello, how are you?"
 * }
 * 
 * Response:
 * {
 *   "detectedLanguage": "en",
 *   "confidence": 0.95,
 *   "alternatives": []
 * }
 */
router.post("/detect", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'text' field",
      });
    }

    const result = await languageService.detectLanguage(text);
    res.json(result);
  } catch (error) {
    console.error("Language detection error:", error);
    res.status(500).json({
      error: "Language detection failed",
    });
  }
});

/**
 * POST /api/language/translate
 * 
 * Translate content between languages
 * 
 * Body:
 * {
 *   "content": "Hello",
 *   "sourceLanguage": "en",
 *   "targetLanguage": "hi"
 * }
 * 
 * Response:
 * {
 *   "translated": "नमस्ते",
 *   "sourceLanguage": "en",
 *   "targetLanguage": "hi"
 * }
 */
router.post("/translate", async (req: Request, res: Response) => {
  try {
    const { content, sourceLanguage, targetLanguage } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'content' field",
      });
    }

    if (!isValidLanguageCode(sourceLanguage)) {
      return res.status(400).json({
        error: `Invalid source language: ${sourceLanguage}`,
      });
    }

    if (!isValidLanguageCode(targetLanguage)) {
      return res.status(400).json({
        error: `Invalid target language: ${targetLanguage}`,
      });
    }

    if (!languageService.isLanguageSupported(sourceLanguage)) {
      return res.status(400).json({
        error: `Source language not supported: ${sourceLanguage}`,
      });
    }

    if (!languageService.isLanguageSupported(targetLanguage)) {
      return res.status(400).json({
        error: `Target language not supported: ${targetLanguage}`,
      });
    }

    const translated = await languageService.translateContent(
      content,
      sourceLanguage,
      targetLanguage
    );

    res.json({
      translated,
      sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
    });
  }
});

/**
 * GET /api/language/supported
 * 
 * Get list of supported languages
 * 
 * Response:
 * {
 *   "supported": ["en", "hi"],
 *   "default": "en"
 * }
 */
router.get("/supported", (req: Request, res: Response) => {
  try {
    res.json({
      supported: languageService.getSupportedLanguages(),
      default: languageService.getDefaultLanguage(),
    });
  } catch (error) {
    console.error("Error fetching supported languages:", error);
    res.status(500).json({
      error: "Failed to fetch supported languages",
    });
  }
});

/**
 * POST /api/language/content
 * 
 * Generate content in specific language
 * 
 * Body:
 * {
 *   "prompt": "Explain photosynthesis",
 *   "language": "hi",
 *   "instructions": "Use simple words for 10th grade"
 * }
 * 
 * Response:
 * {
 *   "content": "...",
 *   "language": "hi"
 * }
 */
router.post("/content", async (req: Request, res: Response) => {
  try {
    const { prompt, language, instructions } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'prompt' field",
      });
    }

    if (!isValidLanguageCode(language)) {
      return res.status(400).json({
        error: `Invalid language: ${language}`,
      });
    }

    if (!languageService.isLanguageSupported(language)) {
      return res.status(400).json({
        error: `Language not supported: ${language}`,
      });
    }

    const content = await languageService.generateContent(
      prompt,
      language,
      instructions
    );

    res.json({
      content,
      language,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({
      error: "Content generation failed",
    });
  }
});

export default router;
