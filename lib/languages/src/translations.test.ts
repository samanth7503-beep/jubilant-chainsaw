import { describe, it, expect } from "vitest";
import { parseTranslatedText } from "./translations";

describe("parseTranslatedText", () => {
  it("should handle empty string", () => {
    expect(parseTranslatedText("")).toBe("");
  });

  it("should parse simple JSON with 'translated' field", () => {
    const input = JSON.stringify({ translated: "Hola mundo" });
    expect(parseTranslatedText(input)).toBe("Hola mundo");
  });

  it("should fallback to 'translation' field in JSON", () => {
    const input = JSON.stringify({ translation: "Bonjour le monde" });
    expect(parseTranslatedText(input)).toBe("Bonjour le monde");
  });

  it("should fallback to 'text' field in JSON", () => {
    const input = JSON.stringify({ text: "Halo dunia" });
    expect(parseTranslatedText(input)).toBe("Halo dunia");
  });

  it("should extract code-fence block (markdown)", () => {
    const input = "Some intro\n```\nHello translated\n```";
    expect(parseTranslatedText(input)).toBe("Hello translated");
  });

  it("should extract code-fence block with language tag", () => {
    const input = "Some intro\n```txt\nTranslated text here\n```";
    expect(parseTranslatedText(input)).toBe("Translated text here");
  });

  it("should extract labeled translation with colon", () => {
    const input = "Translation: Este es el texto traducido";
    expect(parseTranslatedText(input)).toBe("Este es el texto traducido");
  });

  it("should extract labeled translation with dash", () => {
    const input = "Translated - यह अनुवादित पाठ है";
    expect(parseTranslatedText(input)).toBe("यह अनुवादित पाठ है");
  });

  it("should remove leading language code", () => {
    const input = "hi: यह एक परीक्षण है";
    expect(parseTranslatedText(input)).toBe("यह एक परीक्षण है");
  });

  it("should remove leading language code with dash", () => {
    const input = "ta - திமிராவான உரை";
    expect(parseTranslatedText(input)).toBe("திமிராவான உரை");
  });

  it("should collapse multiple blank lines", () => {
    const input = "Line 1\n\n\nLine 2\n\n\nLine 3";
    const result = parseTranslatedText(input);
    expect(result).toBe("Line 1\nLine 2\nLine 3");
  });

  it("should handle plain text fallthrough", () => {
    const input = "This is just plain translated text";
    expect(parseTranslatedText(input)).toBe("This is just plain translated text");
  });

  it("should prioritize JSON over other formats", () => {
    const input = `{"translated": "JSON version"}\nTranslation: Label version`;
    expect(parseTranslatedText(input)).toBe("JSON version");
  });

  it("should handle multiline translations", () => {
    const input = `Translation:\nLine 1\nLine 2\nLine 3`;
    const result = parseTranslatedText(input);
    expect(result).toContain("Line 1");
    expect(result).toContain("Line 2");
  });

  it("should handle complex markdown with metadata", () => {
    const input = `\`\`\`json\n{\n  "translated": "Hola"\n}\n\`\`\``;
    // This will extract the markdown block, which contains JSON
    const result = parseTranslatedText(input);
    expect(result).toContain("translated");
  });
});
