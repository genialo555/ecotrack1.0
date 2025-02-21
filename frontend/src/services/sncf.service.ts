const SNCF_API_KEY = process.env.NEXT_PUBLIC_SNCF_API_KEY;
const BASE_URL = 'https://api.sncf.com/v1/coverage/sncf/journeys';

export interface TrainSchedule {
  departure_time: string;
  arrival_time: string;
  duration: number;
  price?: {
    amount: number;
    currency: string;
  };
  train_number: string;
  train_type: string;
}

async function downloadAndParseGTFS(): Promise<any> {
  try {
    // Download the GTFS zip file
    const response = await fetch('https://eu.ftp.opendatasoft.com/sncf/gtfs/export-ter-gtfs-last.zip');
    if (!response.ok) {
      throw new Error('Failed to download GTFS data');
    }

    // TODO: Parse the GTFS data
    // For now, return mock data
    return {
      stops: [
        { stop_id: 'stop_1', stop_name: 'PARIS GARE DE LYON' },
        { stop_id: 'stop_2', stop_name: 'MARSEILLE SAINT CHARLES' }
      ],
      trips: [
        {
          trip_id: 'trip_1',
          route_id: 'route_1',
          departure_time: '08:00:00',
          arrival_time: '11:00:00',
          service_id: 'service_1'
        }
      ],
      routes: [
        {
          route_id: 'route_1',
          route_short_name: 'TGV 6201',
          route_type: 2 // Rail
        }
      ]
    };
  } catch (error) {
    console.error('Error downloading GTFS data:', error);
    return null;
  }
}

async function findStationId(query: string): Promise<string | null> {
  try {
    const gtfsData = await downloadAndParseGTFS();
    if (!gtfsData) {
      return null;
    }

    // Find station in GTFS stops
    const station = gtfsData.stops.find((stop: any) => 
      stop.stop_name.toLowerCase().includes(query.toLowerCase())
    );

    if (!station) {
      console.error('No station found for query:', query);
      return null;
    }

    return station.stop_id;
  } catch (error) {
    console.error('Error finding station:', error);
    return null;
  }
}

export async function searchTrainSchedules(
  origin: string,
  destination: string,
  date: Date
): Promise<TrainSchedule[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?from=${origin}&to=${destination}&datetime=${date.toISOString()}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(SNCF_API_KEY + ':')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch train schedules');
    }

    const data = await response.json();
    return data.journeys.map((journey: any) => ({
      departure_time: journey.departure_date_time,
      arrival_time: journey.arrival_date_time,
      duration: journey.duration,
      price: journey.fare?.total?.amount ? {
        amount: journey.fare.total.amount,
        currency: 'EUR'
      } : undefined,
      train_number: journey.sections[0]?.display_informations?.headsign || '',
      train_type: journey.sections[0]?.display_informations?.commercial_mode || ''
    }));
  } catch (error) {
    console.error('Error fetching train schedules:', error);
    return [];
  }
}
