// src/gemini/types/admin.types.ts
export interface AdminRequestDTO {
    action: string;
    parameters: any;
  }
  
  export interface AdminHistoryDTO {
    startDate?: Date;
    endDate?: Date;
    actionTypes?: string[];
  }