import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the Gemini client used by the translations module
vi.mock('../../integrations-gemini-ai/src/client', () => {
  return {
    ai: {
      models: {
        generateContent: vi.fn(),
      },
    },
  };
});

import { TranslationService, detectLanguage } from '../translations';

describe('TranslationService & detectLanguage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('parses JSON translation payloads from Gemini', async () => {
    const client = await import('../../integrations-gemini-ai/src/client');
    client.ai.models.generateContent.mockResolvedValueOnce({
      candidates: [
        { content: { parts: [{ text: JSON.stringify({ translated: 'नमस्ते दुनिया' }) }] } },
      ],
    });

    const svc = new TranslationService('key', 'https://example.com');
    const res = await svc.translate({ text: 'Hello world', sourceLanguage: 'en', targetLanguage: 'hi' });
    expect(res.translated).toContain('नमस्ते');
    expect(res.provider).toBe('gemini');
  });

  it('extracts language code from simple detect responses', async () => {
    const client = await import('../../integrations-gemini-ai/src/client');
    client.ai.models.generateContent.mockResolvedValueOnce({
      candidates: [
        { content: { parts: [{ text: 'fr' }] } },
      ],
    });

    const d = await detectLanguage('Bonjour');
    expect(d.code).toBe('fr');
  });

  it('falls back to en on errors', async () => {
    const client = await import('../../integrations-gemini-ai/src/client');
    client.ai.models.generateContent.mockRejectedValueOnce(new Error('rate limit'));
    const d = await detectLanguage('Hola');
    expect(d.code).toBe('en');
    expect(d.confidence).toBeLessThanOrEqual(0.5);
  });
});
