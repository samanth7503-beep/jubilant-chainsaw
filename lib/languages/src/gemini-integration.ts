/**
 * Gemini API Integration for Language Support
 * 
 * This module provides configuration for integrating with Google Gemini API
 * for translation, language detection, and multilingual content generation.
 */

import type { LanguageCode } from "./index";

export interface GeminiLanguageConfig {
  supportedLanguages: LanguageCode[];
  defaultLanguage: LanguageCode;
  apiKey: string;
  baseUrl: string;
  model: string;
}

/**
 * Get Gemini configuration from environment variables
 */
export function getGeminiLanguageConfig(): GeminiLanguageConfig {
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";

  if (!apiKey) {
    throw new Error(
      "AI_INTEGRATIONS_GEMINI_API_KEY environment variable is not set. " +
        "Get a free API key from https://aistudio.google.com/app/apikey"
    );
  }

  return {
    supportedLanguages: ["en", "hi"],
    defaultLanguage: "en",
    apiKey,
    baseUrl,
    model: "gemini-2.5-flash",
  };
}

/**
 * Gemini API endpoints for language operations
 */
export const GEMINI_ENDPOINTS = {
  generateContent: "/v1beta/models/{model}:generateContent",
  batchProcess: "/v1beta/models/{model}:batchProcess",
};

/**
 * Language-specific Gemini prompts
 */
export const LANGUAGE_PROMPTS = {
  translation: (sourceLanguage: string, targetLanguage: string, text: string) =>
    `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
    Provide only the translation, no additional text.
    
    Text: ${text}`,

  languageDetection: (text: string) =>
    `Detect the language of the following text. 
    Respond with only the language code (e.g., 'en', 'hi', 'ta', 'te', 'mr', 'bn').
    
    Text: ${text}`,

  contentGeneration: (topic: string, language: string) =>
    `Generate educational content about "${topic}" in ${language}. 
    Make it suitable for students and include examples.`,
};

/**
 * Map language codes to Gemini's language identifiers
 */
export const LANGUAGE_CODE_MAP: Record<LanguageCode, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  bn: "Bengali",
  kn: "Kannada",
  ml: "Malayalam",
  gu: "Gujarati",
  or: "Odia",
  pa: "Punjabi",
  as: "Assamese",
};
