export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

export const DEFAULT_CENTER = {
  lat: 48.8566,
  lng: 2.3522,
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export const FLIGHT_CLASSES = {
  ECONOMY: {
    name: 'Économique',
    price: 299,
    features: [
      'Bagage cabine 10kg inclus',
      'Siège standard',
      'Repas payant',
    ],
  },
  STANDARD: {
    name: 'Standard',
    price: 399,
    features: [
      'Bagage en soute 23kg',
      'Siège avec plus d\'espace',
      'Repas inclus',
      'Miles x1.5',
    ],
  },
  BUSINESS: {
    name: 'Business',
    price: 899,
    features: [
      'Bagages 32kg x2',
      'Siège-lit inclinable',
      'Repas premium',
      'Lounge accès',
      'Miles x2',
    ],
  },
};

export const LONG_DISTANCE_THRESHOLD = 800; // in kilometers
export const DEFAULT_ZOOM = 6;
