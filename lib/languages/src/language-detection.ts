/**
 * Language Detection Service
 * 
 * Detects the language of input text using Gemini API
 * Will be replaced with Bhashini language detection in production
 */

import type { LanguageCode } from "@workspace/languages";

export interface LanguageDetectionResult {
  detectedLanguage: LanguageCode;
  confidence: number;
  alternatives?: Array<{
    language: LanguageCode;
    confidence: number;
  }>;
}

/**
 * Detect language from text using Gemini API
 * 
 * This is a placeholder implementation that uses Gemini.
 * For production, integrate with Bhashini's language detection API.
 */
export async function detectLanguageFromText(
  text: string,
  apiKey: string
): Promise<LanguageDetectionResult> {
  if (!text || text.trim().length === 0) {
    return {
      detectedLanguage: "en",
      confidence: 0,
      alternatives: [],
    };
  }

  try {
    // TODO: Implement Gemini API call for language detection
    // For now, use simple heuristics
    return detectLanguageHeuristic(text);
  } catch (error) {
    console.error("Language detection error:", error);
    // Fallback to heuristics on error
    return detectLanguageHeuristic(text);
  }
}

/**
 * Heuristic-based language detection
 * 
 * Simple character-based detection until Gemini/Bhashini integration
 */
function detectLanguageHeuristic(text: string): LanguageDetectionResult {
  const devanagariRegex = /[\u0900-\u097F]/g;
  const tamilRegex = /[\u0B80-\u0BFF]/g;
  const teluguRegex = /[\u0C00-\u0C7F]/g;
  const bengaliRegex = /[\u0980-\u09FF]/g;
  const gujaratiRegex = /[\u0A80-\u0AFF]/g;
  const kannadaRegex = /[\u0C80-\u0CFF]/g;
  const malayalamRegex = /[\u0D00-\u0D7F]/g;
  const odiaRegex = /[\u0B00-\u0B7F]/g;

  const devanagariCount = (text.match(devanagariRegex) || []).length;
  const tamilCount = (text.match(tamilRegex) || []).length;
  const teluguCount = (text.match(teluguRegex) || []).length;
  const bengaliCount = (text.match(bengaliRegex) || []).length;
  const gujaratiCount = (text.match(gujaratiRegex) || []).length;
  const kannadaCount = (text.match(kannadaRegex) || []).length;
  const malayalamCount = (text.match(malayalamRegex) || []).length;
  const odiaCount = (text.match(odiaRegex) || []).length;

  const scriptCounts: Array<[LanguageCode, number]> = [
    ["hi", devanagariCount], // Hindi uses Devanagari
    ["mr", devanagariCount], // Marathi also uses Devanagari
    ["ta", tamilCount],
    ["te", teluguCount],
    ["bn", bengaliCount],
    ["gu", gujaratiCount],
    ["kn", kannadaCount],
    ["ml", malayalamCount],
    ["or", odiaCount],
  ];

  const maxCount = Math.max(...scriptCounts.map((s) => s[1]));

  if (maxCount === 0) {
    // No Indian script detected, assume English
    return {
      detectedLanguage: "en",
      confidence: 0.7,
      alternatives: [],
    };
  }

  const detectedLanguage = scriptCounts.find((s) => s[1] === maxCount)?.[0] as
    | LanguageCode
    | undefined || "en";
  const confidence = maxCount / text.length;

  return {
    detectedLanguage,
    confidence: Math.min(confidence, 0.95),
    alternatives: scriptCounts
      .filter((s) => s[1] > 0 && s[0] !== detectedLanguage)
      .map(([lang, count]) => ({
        language: lang,
        confidence: Math.min(count / text.length, 0.95),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2),
  };
}

/**
 * Language detection for voice input
 * 
 * Will use speech-to-text language detection
 * or Bhashini ASR with language detection
 */
export async function detectLanguageFromVoice(
  audioUrl: string,
  apiKey: string
): Promise<LanguageDetectionResult> {
  // TODO: Implement Bhashini ASR with language detection
  // For now, return English as default
  return {
    detectedLanguage: "en",
    confidence: 0.5,
    alternatives: [
      { language: "hi", confidence: 0.3 },
      { language: "ta", confidence: 0.2 },
    ],
  };
}

/**
 * Auto-detect and return best matching language code
 */
export function getBestLanguageMatch(
  detected: LanguageDetectionResult
): LanguageCode {
  // If confidence is high enough, use the detected language
  if (detected.confidence > 0.5) {
    return detected.detectedLanguage;
  }

  // Otherwise, check alternatives or return default
  if (detected.alternatives && detected.alternatives.length > 0) {
    return detected.alternatives[0].language;
  }

  return "en"; // Default to English
}
