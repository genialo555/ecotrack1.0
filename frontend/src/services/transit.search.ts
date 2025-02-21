interface TransitSearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    metatags?: Array<{
      'og:title'?: string;
      'og:description'?: string;
      'og:image'?: string;
    }>;
  };
  departureTime?: string;
  arrivalTime?: string;
  price?: string;
  duration?: string;
  operator: string;
}

interface SearchResponse {
  items?: TransitSearchResult[];
}

// Common train routes data
const COMMON_ROUTES: { [key: string]: TransitSearchResult[] } = {
  'PARIS-marseille': [
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '06:00',
      arrivalTime: '09:22',
      price: '45€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '08:37',
      arrivalTime: '11:59',
      price: '69€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '10:37',
      arrivalTime: '13:59',
      price: '89€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '14:37',
      arrivalTime: '17:59',
      price: '79€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '16:37',
      arrivalTime: '19:59',
      price: '99€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Paris-Marseille',
      departureTime: '18:37',
      arrivalTime: '21:59',
      price: '45€',
      duration: '3h22',
      operator: 'SNCF'
    }
  ],
  'marseille-PARIS': [
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '06:01',
      arrivalTime: '09:23',
      price: '45€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '08:37',
      arrivalTime: '11:59',
      price: '69€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '10:37',
      arrivalTime: '13:59',
      price: '89€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '14:37',
      arrivalTime: '17:59',
      price: '79€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '16:37',
      arrivalTime: '19:59',
      price: '99€',
      duration: '3h22',
      operator: 'SNCF'
    },
    {
      title: 'TGV Direct',
      link: 'https://www.sncf-connect.com/',
      snippet: 'Train direct Marseille-Paris',
      departureTime: '18:37',
      arrivalTime: '21:59',
      price: '45€',
      duration: '3h22',
      operator: 'SNCF'
    }
  ]
};

export async function searchTransitOptions(from: string, to: string): Promise<TransitSearchResult[]> {
  try {
    const routeKey = `${from}-${to}`;
    console.log('Searching for route:', routeKey);
    
    // Check if we have predefined routes for this journey
    if (COMMON_ROUTES[routeKey]) {
      console.log('Found predefined routes');
      return COMMON_ROUTES[routeKey];
    }

    console.log('No predefined routes found for:', routeKey);
    return [];
  } catch (error) {
    console.error('Error searching transit options:', error);
    return [];
  }
}
