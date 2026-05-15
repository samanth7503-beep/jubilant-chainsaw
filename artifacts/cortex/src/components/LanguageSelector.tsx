import React from "react";
import { useSupportedLanguages, useLanguagePreference } from "@/hooks/use-language";
import { useAppStore } from "@/store/appStore";

function codeToLabel(code: string) {
  const map: Record<string, string> = {
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
  return map[code] || code;
}

export default function LanguageSelector() {
  const { loading, error, supported, default: def } = useSupportedLanguages();
  const { currentLanguage, setLanguage } = useLanguagePreference(def as any);
  const { setParam } = useAppStore();

  if (loading) return <div>Loading languages...</div>;
  if (error) return <div className="text-sm text-red-400">{error}</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {supported.map((code) => {
        const label = codeToLabel(code);
        const active = currentLanguage === label;
        return (
          <button
            key={code}
            onClick={() => {
              setLanguage(label as any);
              setParam("language", label as any);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              active ? "bg-blue-500 text-white" : "border-[hsl(var(--border-c))] text-muted"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
