import { NextResponse } from 'next/server';
import { Vehicle } from '@/types/vehicle';

interface EmissionCalculationRequest {
  vehicleId?: string;
  distance: number;
  mode: string;
}

export async function POST(request: Request) {
  try {
    const data: EmissionCalculationRequest = await request.json();

    // Default CO2 rates in g/km
    const CO2_RATES = {
      TRANSIT: 68,
      BICYCLING: 0,
      WALKING: 0,
      FLYING: 285,
      DRIVING: 120
    };

    let co2Rate = CO2_RATES[data.mode as keyof typeof CO2_RATES] || CO2_RATES.DRIVING;
    const totalCO2 = co2Rate * data.distance;

    return NextResponse.json({
      co2: totalCO2,
      unit: 'g',
      mode: data.mode,
      distance: data.distance
    });
  } catch (error) {
    console.error('Error calculating emissions:', error);
    return NextResponse.json(
      { error: 'Failed to calculate emissions' },
      { status: 500 }
    );
  }
}
