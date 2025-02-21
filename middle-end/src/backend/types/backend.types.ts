export interface BackendResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  export interface UserResponse {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
    preferences?: any;
    is_active: boolean;
  }
  export interface UserData {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
    preferences?: {
      [key: string]: any;
    };
    is_active: boolean;
  }
  export interface VehicleData {
    id: string;
    user_id: string;
    type: string;
    brand: string;
    model: string;
    co2_rate?: number;
    specs?: any;
    is_active: boolean;
  }
  export interface JourneyData {
    id: string;
    user_id: string;
    vehicle_id?: string;
    start_location: any;
    end_location: any;
    start_time?: Date;
    end_time?: Date;
    distance?: number;
    co2_emission?: number;
    status?: string;
    route_data?: any;
  }