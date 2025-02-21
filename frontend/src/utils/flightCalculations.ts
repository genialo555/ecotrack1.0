/**
 * Calculate the great-circle distance between two points on Earth using the Haversine formula
 * @param origin Starting point coordinates
 * @param destination Ending point coordinates
 * @returns Distance in kilometers
 */
export function calculateFlightDistance(origin: google.maps.LatLng, destination: google.maps.LatLng): number {
  // Rayon de la Terre en kilomètres
  const R = 6371;

  const lat1 = origin.lat() * Math.PI / 180;
  const lat2 = destination.lat() * Math.PI / 180;
  const deltaLat = (destination.lat() - origin.lat()) * Math.PI / 180;
  const deltaLng = (destination.lng() - origin.lng()) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Distance en kilomètres
  return R * c;
}

/**
 * Calculate the approximate flight duration based on distance
 * @param distanceKm Distance in kilometers
 * @returns Duration in minutes
 */
export function calculateFlightDuration(distanceKm: number): number {
  // Vitesse moyenne d'un avion en km/h
  const averageSpeed = 800;
  
  // Temps en heures
  const flightTime = distanceKm / averageSpeed;
  
  // Ajout de temps pour le décollage et l'atterrissage (en heures)
  const totalTime = flightTime + 0.5;
  
  // Conversion en minutes
  return Math.round(totalTime * 60);
}
