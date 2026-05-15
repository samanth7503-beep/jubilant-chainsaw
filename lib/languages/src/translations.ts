/**
 * Translation utilities for the Cortex AI platform
 * 
 * Currently uses Gemini API for translation.
 * Future: Integrate with Bhashini API for free tier support
 */

import type { LanguageCode } from "./index";
import { LANGUAGE_PROMPTS, getGeminiLanguageConfig } from "./gemini-integration";

// Lazily require Gemini client so test runners can mock the module path
function getAi() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../../integrations-gemini-ai/src/client");
  return mod.ai;
}

async function callWithRetries<T>(fn: () => Promise<T>, attempts = 3, backoff = 500): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const delay = backoff * Math.pow(2, i);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
}

export interface TranslationResponse {
  original: string;
  translated: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  provider: "gemini" | "bhashini" | "google";
  confidence?: number;
}

/**
 * Translation service using Gemini API
 * 
 * Note: In production, consider using Bhashini API (free tier)
 * for cost-effective multilingual translation support
 */
export class TranslationService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://generativelanguage.googleapis.com") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Translate text using Gemini API
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    if (request.sourceLanguage === request.targetLanguage) {
      return {
        original: request.text,
        translated: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        provider: "gemini",
        confidence: 1.0,
      };
    }

    try {
      const cfg = getGeminiLanguageConfig();
      const model = cfg.model || "gemini-2.5-flash";

      const prompt = LANGUAGE_PROMPTS.translation(
        request.sourceLanguage,
        request.targetLanguage,
        request.text,
      );

      const response = await callWithRetries(() =>
        getAi().models.generateContent({ model, contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      );

      const candidate = response?.candidates?.[0];
      const text = candidate?.content?.parts?.map((p: any) => p.text).join("\n") || "";

      // Parsing heuristics
      let translatedText = text;
      try {
        const maybeJson = JSON.parse(text);
        if (maybeJson && typeof maybeJson === "object") {
          translatedText = maybeJson.translated || maybeJson.translation || maybeJson.text || JSON.stringify(maybeJson);
        }
      } catch (e) {
        // not JSON
      }

      if (!translatedText || translatedText.trim() === "") {
        const tickMatch = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
        if (tickMatch) translatedText = tickMatch[1].trim();
      }

      if (!translatedText || translatedText.trim() === "") {
        const labelMatch = text.match(/(?:Translation|Translated(?:\stext)?|Translated:)[:\s-]*([\s\S]+)/i);
        if (labelMatch) translatedText = labelMatch[1].trim();
      }

      translatedText = translatedText.replace(/^\s*[a-z]{2}[:\-]\s*/i, "").trim();
      translatedText = translatedText.replace(/\n{2,}/g, "\n").trim();

      return {
        original: request.text,
        translated: translatedText || `[Translated from ${request.sourceLanguage} to ${request.targetLanguage} using Gemini]`,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        provider: "gemini",
        confidence: 0.9,
      };
    } catch (error) {
      // Hardened error logging and fail-safe response
      console.error("TranslationService.translate error", {
        message: error instanceof Error ? error.message : String(error),
        source: request.sourceLanguage,
        target: request.targetLanguage,
        truncatedText: request.text?.slice(0, 200),
      });
      return {
        original: request.text,
        translated: `[Translation unavailable]`,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        provider: "gemini",
        confidence: 0.0,
      };
    }
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(
    texts: string[],
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<TranslationResponse[]> {
    return Promise.all(
      texts.map((text) =>
        this.translate({
          text,
          sourceLanguage,
          targetLanguage,
        })
      )
    );
  }
}

/**
 * Language detection utility
 * 
 * Detects the language of input text
 * Future: Use Bhashini Language Detection service
 */
export async function detectLanguage(text: string): Promise<{ code: LanguageCode; confidence: number }> {
  try {
    const cfg = getGeminiLanguageConfig();
    const model = cfg.model || "gemini-2.5-flash";

    const prompt = LANGUAGE_PROMPTS.languageDetection(text);

    const response = await callWithRetries(() =>
      getAi().models.generateContent({ model, contents: [{ role: "user", parts: [{ text: prompt }] }] }),
    );

    const candidate = response?.candidates?.[0];
    const content = candidate?.content?.parts?.map((p: any) => p.text).join("\n") || "";

    // Try to extract a language code (e.g., 'en', 'hi') from the model output
    const match = content.match(/\b([a-z]{2})\b/i);
    const code = match ? match[1].toLowerCase() : "en";
    return { code: code as LanguageCode, confidence: 0.9 };
  } catch (err) {
    return { code: "en", confidence: 0.5 };
  }
}

/**
 * Parse a raw model output into a cleaned translation string.
 * Exported for unit testing and reuse.
 */
export function parseTranslatedText(raw: string): string {
  if (!raw) return "";
  let translatedText = raw;

  // 1) If JSON, prefer known fields
  try {
    const maybeJson = JSON.parse(raw);
    if (maybeJson && typeof maybeJson === "object") {
      return maybeJson.translated || maybeJson.translation || maybeJson.text || JSON.stringify(maybeJson);
    }
  } catch (e) {
    // not JSON
  }

  // 2) Extract code-fence block if present (and remove any preceding text)
  const tickMatch = raw.match(/(?:^|\n)[^`]*```(?:\w+)?\n([\s\S]*?)```/);
  if (tickMatch) return tickMatch[1].trim();

  // 3) Labeled translation like "Translation: ..." (strip label)
  const labelMatch = raw.match(/(?:^|\n)\s*(?:Translation|Translated(?:\stext)?|Translated:)[:\s-]*([\s\S]+)/i);
  if (labelMatch) return labelMatch[1].trim();

  // 4) Remove leading language labels like "en: ..."
  translatedText = translatedText.replace(/^\s*[a-z]{2}[:\-]\s*/i, "").trim();

  // 5) Collapse multiple blank lines
  translatedText = translatedText.replace(/\n{2,}/g, "\n").trim();

  return translatedText;
}

/**
 * Exported helper: apply parsing heuristics to raw model text
 * Separated for unit testing.
 */
export function parseTranslatedText(raw: string): string {
  let translatedText = raw || "";

  try {
    const maybeJson = JSON.parse(raw);
    if (maybeJson && typeof maybeJson === "object") {
      translatedText = maybeJson.translated || maybeJson.translation || maybeJson.text || JSON.stringify(maybeJson);
    }
  } catch (e) {}

  if (!translatedText || translatedText.trim() === "") {
    const tickMatch = raw.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (tickMatch) translatedText = tickMatch[1].trim();
  }

  if (!translatedText || translatedText.trim() === "") {
    const labelMatch = raw.match(/(?:Translation|Translated(?:\stext)?|Translated:)[:\s-]*([\s\S]+)/i);
    if (labelMatch) translatedText = labelMatch[1].trim();
  }

  translatedText = translatedText.replace(/^\s*[a-z]{2}[:\-]\s*/i, "").trim();
  translatedText = translatedText.replace(/\n{2,}/g, "\n").trim();
  return translatedText;
}

/**
 * Format text for specific language
 * Handles RTL text, script-specific formatting, etc.
 */
export function formatForLanguage(text: string, languageCode: LanguageCode): string {
  // Placeholder for language-specific formatting
  // This would handle:
  // - Right-to-left text for RTL languages
  // - Script-specific character normalization
  // - Locale-specific number and date formatting
  return text;
}
