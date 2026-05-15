export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
}

export interface TTSResult {
  audioBase64: string;
  mimeType: string;
}

export interface TTSProvider {
  synthesize(text: string, opts?: TTSOptions): Promise<TTSResult>;
}

// Placeholder TTS implementation that returns a small silence WAV base64 as a stub.
export class PlaceholderTTS implements TTSProvider {
  async synthesize(_text: string): Promise<TTSResult> {
    // 1-second silence WAV base64 (very small) — placeholder only
    const silenceBase64 = "UklGRhYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";
    return { audioBase64: silenceBase64, mimeType: "audio/wav" };
  }
}
