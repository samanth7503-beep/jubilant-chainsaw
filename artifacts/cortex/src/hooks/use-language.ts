/**
 * React Hooks for Language Operations
 * 
 * Provides hooks for language detection, translation, and language selection
 */

import { useState, useCallback, useEffect } from "react";
import type { LanguageCode } from "@workspace/languages";

export interface UseLanguageDetectionResult {
  loading: boolean;
  error: string | null;
  detectedLanguage: LanguageCode | null;
  confidence: number;
  detectLanguage: (text: string) => Promise<void>;
}

/**
 * Hook for detecting language from text
 */
export function useLanguageDetection(): UseLanguageDetectionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(
    null
  );
  const [confidence, setConfidence] = useState(0);

  const detectLanguage = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError("Empty text");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/language/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Language detection failed");
      }

      const data = await response.json();
      setDetectedLanguage(data.detectedLanguage);
      setConfidence(data.confidence);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, detectedLanguage, confidence, detectLanguage };
}

export interface UseTranslationResult {
  loading: boolean;
  error: string | null;
  translated: string | null;
  translate: (
    content: string,
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ) => Promise<void>;
}

/**
 * Hook for translating content
 */
export function useTranslation(): UseTranslationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translated, setTranslated] = useState<string | null>(null);

  const translate = useCallback(
    async (
      content: string,
      sourceLanguage: LanguageCode,
      targetLanguage: LanguageCode
    ) => {
      setLoading(true);
      setError(null);
      setTranslated(null);

      try {
        const response = await fetch("/api/language/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            sourceLanguage,
            targetLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error("Translation failed");
        }

        const data = await response.json();
        setTranslated(data.translated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, translated, translate };
}

export interface UseSupportedLanguagesResult {
  loading: boolean;
  error: string | null;
  supported: LanguageCode[];
  default: LanguageCode;
}

/**
 * Hook for getting supported languages
 */
export function useSupportedLanguages(): UseSupportedLanguagesResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<LanguageCode[]>(["en", "hi"]);
  const [defaultLanguage, setDefaultLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/language/supported");
        if (!response.ok) {
          throw new Error("Failed to fetch supported languages");
        }
        const data = await response.json();
        setSupported(data.supported);
        setDefaultLanguage(data.default);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { loading, error, supported, default: defaultLanguage };
}

export interface UseLanguagePreferenceResult {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

/**
 * Hook for managing user language preference
 */
export function useLanguagePreference(
  defaultLanguage: LanguageCode = "en"
): UseLanguagePreferenceResult {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    // Check localStorage for saved preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-language");
      return (saved as LanguageCode) || defaultLanguage;
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", language);
    }
  }, []);

  return { currentLanguage, setLanguage };
}
