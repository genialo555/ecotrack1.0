// src/gemini/types/gemini.types.ts
export interface GeminiRequest {
    prompt: string;
    context?: any;
  }
  
  export interface GeminiResponse {
    text: string;
    tokens: number;
    finishReason: string;
    actions?: Array<{
      type: string;
      data: any;
    }>;
  }
  
  export interface AdminAction {
    adminId: string;
    action: string;
    parameters: any;
    timestamp: Date;
  }