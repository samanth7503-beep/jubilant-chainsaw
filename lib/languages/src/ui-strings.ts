/**
 * UI Translation strings for Cortex AI Platform
 * 
 * Base translations in English.
 * These strings are used throughout the application UI.
 */

export const UI_STRINGS = {
  // Language selection
  language: {
    select: "Select Language",
    selectLanguage: "Choose your preferred language",
    currentLanguage: "Current Language",
    switchLanguage: "Switch Language",
    englishOnly: "English (Currently Available)",
    hindiOnly: "हिंदी (Currently Available)",
    comingSoon: "Coming Soon",
  },

  // Common UI elements
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    next: "Next",
    back: "Back",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
  },

  // Authentication
  auth: {
    login: "Login",
    logout: "Logout",
    devAccess: "Dev Access",
    enterDevKey: "Enter developer key",
    invalidKey: "Invalid key",
    loginSuccess: "Login successful",
    loginFailed: "Login failed",
  },

  // Study features
  study: {
    explainTopic: "Explain Topic",
    studyPlan: "Study Plan",
    generateStudyPlan: "Generate Study Plan",
    tutor: "AI Tutor",
    practice: "Practice",
    quiz: "Quiz",
    revision: "Revision",
  },

  // Language feature status
  featureStatus: {
    builtLanguages: "Built Languages",
    plannedLanguages: "Planned Languages",
    englishSupport: "English with full TTS support",
    hindiSupport: "Hindi (हिंदी) with full TTS support",
    comingSoonLanguages: "Coming Soon: Tamil, Telugu, Marathi, Bengali, and 8 more languages",
  },

  // Error messages
  errors: {
    apiError: "API Error",
    networkError: "Network connection error",
    validationError: "Validation error",
    unsupportedLanguage: "This language is not yet supported",
  },

  // Messages
  messages: {
    notImplemented: "Feature not yet implemented",
    comingSoon: "Coming soon in next release",
    featureInDevelopment: "This feature is in development",
  },
};

/**
 * Get UI string for current language
 * 
 * Currently only supports English and Hindi.
 * For Hindi, strings would be translated versions.
 */
export function getUIString(
  key: string,
  languageCode: "en" | "hi" = "en"
): string {
  // For now, return English strings
  // Future: Load language-specific translations from i18n files
  
  const keys = key.split(".");
  let value: any = UI_STRINGS;

  for (const k of keys) {
    value = value?.[k];
    if (!value) {
      return key; // Return key if translation not found
    }
  }

  return value;
}

/**
 * Hindi translations (हिंदी)
 * These are placeholder translations for demonstration
 */
export const HINDI_STRINGS = {
  language: {
    select: "भाषा चुनें",
    selectLanguage: "अपनी पसंद की भाषा चुनें",
    currentLanguage: "वर्तमान भाषा",
    switchLanguage: "भाषा बदलें",
    englishOnly: "अंग्रेजी (वर्तमान में उपलब्ध)",
    hindiOnly: "हिंदी (वर्तमान में उपलब्ध)",
    comingSoon: "जल्द आ रहा है",
  },

  common: {
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफल",
    warning: "चेतावनी",
    close: "बंद करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    next: "आगे",
    back: "पीछे",
    save: "सहेजें",
    delete: "हटाएँ",
    edit: "संपादित करें",
    add: "जोड़ें",
    remove: "निकालें",
  },

  auth: {
    login: "लॉगिन करें",
    logout: "लॉगआउट करें",
    devAccess: "डेव एक्सेस",
    enterDevKey: "डेवलपर की दर्ज करें",
    invalidKey: "अमान्य की",
    loginSuccess: "लॉगिन सफल",
    loginFailed: "लॉगिन विफल",
  },

  study: {
    explainTopic: "विषय समझाएं",
    studyPlan: "अध्ययन योजना",
    generateStudyPlan: "अध्ययन योजना बनाएं",
    tutor: "AI ट्यूटर",
    practice: "अभ्यास",
    quiz: "प्रश्नोत्तरी",
    revision: "संशोधन",
  },

  featureStatus: {
    builtLanguages: "निर्मित भाषाएँ",
    plannedLanguages: "योजनाबद्ध भाषाएँ",
    englishSupport: "अंग्रेजी पूर्ण TTS समर्थन के साथ",
    hindiSupport: "हिंदी (हिंदी) पूर्ण TTS समर्थन के साथ",
    comingSoonLanguages: "जल्द आ रहा है: तमिल, तेलुगु, मराठी, बंगाली, और 8 अन्य भाषाएँ",
  },

  errors: {
    apiError: "API त्रुटि",
    networkError: "नेटवर्क कनेक्शन त्रुटि",
    validationError: "सत्यापन त्रुटि",
    unsupportedLanguage: "यह भाषा अभी तक समर्थित नहीं है",
  },

  messages: {
    notImplemented: "सुविधा अभी लागू नहीं की गई है",
    comingSoon: "अगली रिलीज में जल्द आ रहा है",
    featureInDevelopment: "यह सुविधा विकास में है",
  },
};
