// gemini.exception.ts
export class GeminiApiException extends Error {
    constructor(message: string) {
      super(`Gemini API Error: ${message}`);
    }
  }