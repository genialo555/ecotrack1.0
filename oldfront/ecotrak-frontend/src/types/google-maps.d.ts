/// <reference types="@types/google.maps" />

declare namespace google.maps {
  interface DirectionsResult {
    routes: google.maps.DirectionsRoute[];
    request: any;
  }

  interface DirectionsStatus {
    OK: string;
    NOT_FOUND: string;
    ZERO_RESULTS: string;
    MAX_WAYPOINTS_EXCEEDED: string;
    INVALID_REQUEST: string;
    OVER_QUERY_LIMIT: string;
    REQUEST_DENIED: string;
    UNKNOWN_ERROR: string;
  }
}

declare module '@react-google-maps/api' {
  export interface LoadScriptProps {
    googleMapsApiKey: string;
    libraries?: ("places" | "geometry" | "drawing" | "localContext" | "visualization")[];
  }

  export interface DirectionsRendererProps {
    directions: google.maps.DirectionsResult;
    options?: google.maps.DirectionsRendererOptions;
    routeIndex?: number;
  }
}
