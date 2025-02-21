// backend.exception.ts
export class BackendApiException extends Error {
    constructor(message: string) {
      super(`Backend API Error: ${message}`);
    }
  }