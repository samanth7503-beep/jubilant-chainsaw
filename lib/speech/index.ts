// Speech module exports - ASR and TTS adapters

export { ASRProvider, ASRResult, PlaceholderASR } from "./asr";
export { TTSProvider, TTSOptions, TTSResult, PlaceholderTTS } from "./tts";
export { GeminiASR } from "./gemini-asr";
export { GeminiTTS } from "./gemini-tts";

// Default exports for common use cases
export { PlaceholderASR as DefaultASR } from "./asr";
export { PlaceholderTTS as DefaultTTS } from "./tts";
