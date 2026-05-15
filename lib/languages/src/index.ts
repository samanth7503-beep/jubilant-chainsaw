/**
 * Language Configuration Module
 * 
 * This module provides language constants, types, and utilities for the Cortex AI platform.
 * Currently supports: English (EN) and Hindi (HI)
 * Planned support: Tamil, Telugu, Marathi, Bengali, and 6+ more
 */

export type LanguageCode = "en" | "hi" | "ta" | "te" | "mr" | "bn" | "kn" | "ml" | "gu" | "or" | "pa" | "as";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
  status: "built" | "planned" | "future";
  priority: number;
  scriptFamily: string;
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇺🇸",
    status: "built",
    priority: 1,
    scriptFamily: "Latin",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    direction: "ltr",
    flag: "🇮🇳",
    status: "built",
    priority: 2,
    scriptFamily: "Devanagari",
  },
  ta: {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    direction: "ltr",
    flag: "🇮🇳",
    status: "planned",
    priority: 3,
    scriptFamily: "Tamil",
  },
  te: {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    direction: "ltr",
    flag: "🇮🇳",
    status: "planned",
    priority: 4,
    scriptFamily: "Telugu",
  },
  mr: {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    direction: "ltr",
    flag: "🇮🇳",
    status: "planned",
    priority: 5,
    scriptFamily: "Devanagari",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
    flag: "🇧🇩",
    status: "planned",
    priority: 6,
    scriptFamily: "Bengali",
  },
  kn: {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 7,
    scriptFamily: "Kannada",
  },
  ml: {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 8,
    scriptFamily: "Malayalam",
  },
  gu: {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 9,
    scriptFamily: "Gujarati",
  },
  or: {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 10,
    scriptFamily: "Odia",
  },
  pa: {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 11,
    scriptFamily: "Gurmukhi",
  },
  as: {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    direction: "ltr",
    flag: "🇮🇳",
    status: "future",
    priority: 12,
    scriptFamily: "Bengali",
  },
};

/**
 * Get list of currently built/supported languages
 */
export function getBuiltLanguages(): Language[] {
  return Object.values(LANGUAGES)
    .filter((lang) => lang.status === "built")
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get list of planned languages
 */
export function getPlannedLanguages(): Language[] {
  return Object.values(LANGUAGES)
    .filter((lang) => lang.status === "planned")
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get all languages
 */
export function getAllLanguages(): Language[] {
  return Object.values(LANGUAGES).sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a language code is valid
 */
export function isValidLanguageCode(code: string): code is LanguageCode {
  return code in LANGUAGES;
}

/**
 * Get language by code
 */
export function getLanguage(code: LanguageCode): Language | undefined {
  return LANGUAGES[code];
}

/**
 * Get language name in English
 */
export function getLanguageName(code: LanguageCode): string {
  return LANGUAGES[code]?.name || code;
}

/**
 * Get language name in native script
 */
export function getNativeLanguageName(code: LanguageCode): string {
  return LANGUAGES[code]?.nativeName || code;
}
