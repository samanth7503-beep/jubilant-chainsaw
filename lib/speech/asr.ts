export interface ASRResult {
  transcript: string;
  confidence?: number;
}

export interface ASRProvider {
  transcribe(audioBuffer: ArrayBuffer): Promise<ASRResult>;
}

// Placeholder generic ASR adapter — implementations for Bhashini or other providers should implement `ASRProvider`.
export class PlaceholderASR implements ASRProvider {
  async transcribe(_audioBuffer: ArrayBuffer): Promise<ASRResult> {
    return { transcript: "", confidence: 0 };
  }
}
