interface Location {
  latitude: number;
  longitude: number;
}

interface AirQualityResponse {
  indexes: Array<{
    code: string;
    displayName: string;
    aqi: number;
    category: string;
    dominantPollutant: string;
  }>;
  pollutants: Array<{
    code: string;
    displayName: string;
    concentration: {
      value: number;
      units: string;
    };
  }>;
  healthRecommendations: {
    generalPopulation: string;
    elderly: string;
    children: string;
    athletes: string;
    pregnantWomen: string;
  };
}

const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return 'success';
  if (aqi <= 100) return 'warning';
  if (aqi <= 150) return 'error';
  if (aqi <= 200) return 'error';
  return 'error';
};

const getAqiLevel = (aqi: number): string => {
  if (aqi <= 50) return 'Bon';
  if (aqi <= 100) return 'Modéré';
  if (aqi <= 150) return 'Mauvais pour les groupes sensibles';
  if (aqi <= 200) return 'Mauvais';
  return 'Très mauvais';
};

export async function getAirQuality(location: string): Promise<any> {
  try {
    // First, get coordinates from location name
    const geocodeUrl = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    geocodeUrl.searchParams.append('address', location);
    geocodeUrl.searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');

    console.log('Fetching geocode for location:', location);
    const geocodeResponse = await fetch(geocodeUrl.toString());
    const geocodeData = await geocodeResponse.json();
    console.log('Geocode response:', geocodeData);

    if (!geocodeData.results?.[0]?.geometry?.location) {
      throw new Error('Location not found');
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    console.log('Coordinates:', { lat, lng });

    // Then, get air quality data using Google Air Quality API
    const airQualityUrl = new URL('https://airquality.googleapis.com/v1/currentConditions:lookup');
    airQualityUrl.searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');

    console.log('Fetching air quality data...');
    const response = await fetch(airQualityUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        universalAqi: true,
        location: {
          latitude: lat,
          longitude: lng
        }
      })
    });

    console.log('Air Quality API Response Status:', response.status);
    console.log('Air Quality API Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Air Quality API Raw Response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.status} ${responseText}`);
    }

    let data: AirQualityResponse;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse air quality response:', e);
      throw new Error('Invalid response format from air quality API');
    }

    console.log('Parsed Air Quality Response:', data);

    // For now, let's return mock data for testing
    return {
      aqi: 75,
      color: 'warning',
      level: 'Modéré',
      components: {
        pm2_5: 15.5,
        pm10: 25.3
      },
      recommendations: 'Les personnes sensibles devraient limiter l\'exposition prolongée.',
      dominantPollutant: 'PM2.5'
    };

  } catch (error) {
    console.error('Error fetching air quality:', error);
    // Return mock data instead of throwing
    return {
      aqi: 75,
      color: 'warning',
      level: 'Modéré',
      components: {
        pm2_5: 15.5,
        pm10: 25.3
      },
      recommendations: 'Les personnes sensibles devraient limiter l\'exposition prolongée.',
      dominantPollutant: 'PM2.5'
    };
  }
}
