import { describe, it, expect } from 'vitest';
import { parseTranslatedText } from '../src/translations';

describe('parseTranslatedText', () => {
  it('parses JSON with translated field', () => {
    const raw = JSON.stringify({ translated: 'Hola mundo' });
    expect(parseTranslatedText(raw)).toBe('Hola mundo');
  });

  it('extracts code-fenced content', () => {
    const raw = 'Here is the translation:\n```\nBonjour le monde\n```';
    expect(parseTranslatedText(raw)).toBe('Bonjour le monde');
  });

  it('extracts labeled Translation:', () => {
    const raw = 'Translation: こんにちは世界';
    expect(parseTranslatedText(raw)).toBe('こんにちは世界');
  });

  it('removes leading language labels', () => {
    const raw = 'en: Hello world';
    expect(parseTranslatedText(raw)).toBe('Hello world');
  });
});
