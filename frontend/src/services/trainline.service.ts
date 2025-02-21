const TRAINLINE_API_KEY = process.env.NEXT_PUBLIC_TRAINLINE_API_KEY;
const BASE_URL = 'https://www.trainline.eu/api/v5_1';

export interface TrainPrice {
  amount: number;
  currency: string;
  provider: string;
  link: string;
}

export async function getTrainPrices(
  originStation: string,
  destinationStation: string,
  date: Date
): Promise<TrainPrice[]> {
  try {
    // Nettoyer les noms des gares
    const cleanOrigin = originStation.replace(/\s*gare\s*/i, '').trim();
    const cleanDestination = destinationStation.replace(/\s*gare\s*/i, '').trim();

    // Construire l'URL de recherche Trainline
    const searchUrl = `https://www.trainline.eu/search/train/${encodeURIComponent(cleanOrigin)}/${encodeURIComponent(cleanDestination)}/${date.toISOString().split('T')[0]}`;

    // Pour l'instant, retourner un prix simulé
    return [{
      amount: Math.floor(Math.random() * 50) + 30, // Prix entre 30 et 80€
      currency: 'EUR',
      provider: 'SNCF',
      link: searchUrl
    }];
  } catch (error) {
    console.error('Error fetching train prices:', error);
    return [];
  }
}
