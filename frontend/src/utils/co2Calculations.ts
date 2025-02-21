import { Vehicle, VehicleType } from '@/types/vehicle';

interface TransportEmission {
  mode: string;
  co2PerKm: number; // in grams per kilometer
  isGreen?: boolean;
  isHumanPowered?: boolean;
}

// Default emissions for different transport modes
export const TRANSPORT_MODES: Record<string, TransportEmission> = {
  DRIVING: {
    mode: 'DRIVING',
    co2PerKm: 120, // Default value for cars
    isGreen: false
  },
  TRANSIT: {
    mode: 'TRANSIT',
    co2PerKm: 68, // Average for bus/metro
    isGreen: true
  },
  BICYCLING: {
    mode: 'BICYCLING',
    co2PerKm: 0,
    isGreen: true,
    isHumanPowered: true
  },
  WALKING: {
    mode: 'WALKING',
    co2PerKm: 0,
    isGreen: true,
    isHumanPowered: true
  }
};

// Default CO2 rates for different vehicle types (g/km)
export const DEFAULT_CO2_RATES: Record<VehicleType, number> = {
  [VehicleType.CAR]: 120,
  [VehicleType.MOTORCYCLE]: 90,
  [VehicleType.BICYCLE]: 0,
  [VehicleType.SCOOTER]: 70,
  [VehicleType.OTHER]: 100
};

interface CO2Calculation {
  totalCO2: number;
  savings: number;
  message: string;
  isGreen: boolean;
}

export function calculateCO2Emissions(
  distanceKm: number,
  transportMode: string,
  vehicle?: Vehicle
): CO2Calculation {
  // Get the transport mode configuration
  const transport = TRANSPORT_MODES[transportMode];
  if (!transport) {
    throw new Error(`Invalid transport mode: ${transportMode}`);
  }

  let co2PerKm = transport.co2PerKm;
  let isGreen = transport.isGreen || false;

  // If it's a driving mode and we have a vehicle, use its CO2 rate
  if (transportMode === 'DRIVING' && vehicle) {
    co2PerKm = vehicle.co2Rate;
    isGreen = vehicle.type === VehicleType.BICYCLE || vehicle.type === VehicleType.SCOOTER;
  }

  // Calculate total CO2 emissions for the journey
  const totalCO2 = distanceKm * co2PerKm;

  // Calculate potential savings compared to a standard car
  const baselineCO2 = distanceKm * DEFAULT_CO2_RATES[VehicleType.CAR];
  const savings = baselineCO2 - totalCO2;

  // Generate eco-friendly message
  let message = '';
  if (transport.isHumanPowered) {
    message = "0g CO₂ (sauf l'air que vous respirez 😊) 🌱";
  } else if (transportMode === 'TRANSIT') {
    message = "Un choix responsable pour l'environnement ! 🚌";
  } else if (transportMode === 'DRIVING' && vehicle) {
    switch (vehicle.type) {
      case VehicleType.BICYCLE:
        message = "Zéro émission, excellent choix ! 🚲";
        break;
      case VehicleType.SCOOTER:
        message = "Une option écologique ! 🛵";
        break;
      case VehicleType.MOTORCYCLE:
        message = "Plus économique qu'une voiture ! 🏍️";
        break;
      case VehicleType.CAR:
        message = "Pensez au covoiturage pour réduire l'impact 🚗";
        break;
      default:
        message = "Pensez aux alternatives plus écologiques 🌱";
    }
  }

  return {
    totalCO2: transport.isHumanPowered ? 0 : totalCO2,
    savings,
    message,
    isGreen
  };
}

export function formatCO2(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${Math.round(grams)} g`;
}

export function getEmissionsSummary(calculation: CO2Calculation): string {
  const { totalCO2, savings, isGreen } = calculation;
  const formattedCO2 = formatCO2(totalCO2);
  const formattedSavings = formatCO2(Math.abs(savings));

  if (totalCO2 === 0) {
    return "Aucune émission directe de CO₂ ! 🌱";
  }

  if (isGreen) {
    return `${formattedCO2} CO₂ - Vous économisez ${formattedSavings} par rapport à une voiture standard ! 🌿`;
  }

  if (savings > 0) {
    return `${formattedCO2} CO₂ - Vous économisez ${formattedSavings} ! 👍`;
  }

  return `${formattedCO2} CO₂ - Une alternative plus verte économiserait ${formattedSavings} 🤔`;
}
