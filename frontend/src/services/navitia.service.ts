import { toast } from 'react-hot-toast';

const NAVITIA_API_URL = 'https://api.navitia.io/v1';

interface NavitiaConfig {
  token: string;
  coverage: string;  // e.g., 'fr-idf' for Paris region
}

interface JourneySchedule {
  departure_datetime: string;
  arrival_datetime: string;
  duration: number;
  sections: {
    type: string;
    mode?: string;
    from: {
      name: string;
      stop_point?: {
        name: string;
        label: string;
      };
    };
    to: {
      name: string;
      stop_point?: {
        name: string;
        label: string;
      };
    };
    display_informations?: {
      network: string;
      direction: string;
      label: string;
      color: string;
      code: string;
      name: string;
    };
    additional_informations?: {
      disruption?: {
        message: string;
        severity: string;
      };
    };
  }[];
  fare?: {
    total: {
      value: string;
      currency: string;
    };
    found: boolean;
    links: {
      type: string;
      value: string;
      currency: string;
    }[];
  };
}

export async function searchJourneys(
  from: string,
  to: string,
  datetime: Date,
  config: NavitiaConfig
): Promise<JourneySchedule[]> {
  try {
    const response = await fetch(
      `${NAVITIA_API_URL}/coverage/${config.coverage}/journeys?` +
      `from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&datetime=${datetime.toISOString()}`,
      {
        headers: {
          'Authorization': config.token
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch journey schedules');
    }

    const data = await response.json();
    return data.journeys || [];
  } catch (error) {
    console.error('Error fetching journey schedules:', error);
    toast.error('Failed to fetch transit schedules');
    return [];
  }
}

export async function getStopPoints(
  query: string,
  config: NavitiaConfig
) {
  try {
    const response = await fetch(
      `${NAVITIA_API_URL}/coverage/${config.coverage}/places?` +
      `q=${encodeURIComponent(query)}` +
      '&type[]=stop_point&type[]=stop_area',
      {
        headers: {
          'Authorization': config.token
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stop points');
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching stop points:', error);
    toast.error('Failed to fetch transit stops');
    return [];
  }
}

export async function getLineSchedules(
  lineId: string,
  stopPointId: string,
  datetime: Date,
  config: NavitiaConfig
) {
  try {
    const response = await fetch(
      `${NAVITIA_API_URL}/coverage/${config.coverage}/lines/${lineId}` +
      `/stop_points/${stopPointId}/schedules?` +
      `from_datetime=${datetime.toISOString()}`,
      {
        headers: {
          'Authorization': config.token
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch line schedules');
    }

    const data = await response.json();
    return data.schedules || [];
  } catch (error) {
    console.error('Error fetching line schedules:', error);
    toast.error('Failed to fetch transit schedules');
    return [];
  }
}

export async function getDisruptions(
  config: NavitiaConfig
) {
  try {
    const response = await fetch(
      `${NAVITIA_API_URL}/coverage/${config.coverage}/disruptions`,
      {
        headers: {
          'Authorization': config.token
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch disruptions');
    }

    const data = await response.json();
    return data.disruptions || [];
  } catch (error) {
    console.error('Error fetching disruptions:', error);
    toast.error('Failed to fetch transit disruptions');
    return [];
  }
}
