import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { origin, destination } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Configuration du serveur manquante' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(
      destination
    )}&mode=driving&units=metric&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    console.log('Calling Google Maps API with origin:', origin, 'and destination:', destination);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Maps API Response:', data);

    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      const result = {
        distance: data.rows[0].elements[0].distance.value / 1000, // Convert meters to kilometers
        duration: data.rows[0].elements[0].duration.value / 60, // Convert seconds to minutes
        originAddress: data.origin_addresses[0],
        destinationAddress: data.destination_addresses[0]
      };
      
      console.log('Calculated result:', result);
      return NextResponse.json(result);
    }

    console.error('Error from Google Maps API:', {
      status: data.status,
      error_message: data.error_message,
      elements_status: data.rows?.[0]?.elements?.[0]?.status
    });

    return NextResponse.json(
      { 
        error: data.error_message || 'Impossible de calculer la distance',
        details: {
          status: data.status,
          elements_status: data.rows?.[0]?.elements?.[0]?.status
        }
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in distance calculation:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du calcul de la distance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
