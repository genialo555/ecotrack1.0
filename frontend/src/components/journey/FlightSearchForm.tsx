import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { searchFlights, getSkyIdList, type FlightResponse, type SkyId } from '@/services/flight.service';

interface FlightSearchFormProps {
  origin: string;
  destination: string;
  onFlightSelect: (flight: FlightResponse) => void;
}

export function FlightSearchForm({ origin, destination, onFlightSelect }: FlightSearchFormProps) {
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState<SkyId[]>([]);
  const [originAirports, setOriginAirports] = useState<SkyId[]>([]);
  const [destAirports, setDestAirports] = useState<SkyId[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<SkyId | null>(null);
  const [selectedDest, setSelectedDest] = useState<SkyId | null>(null);
  const [flights, setFlights] = useState<FlightResponse | null>(null);

  useEffect(() => {
    // Fetch all airports on component mount
    getSkyIdList()
      .then(response => {
        const airportList = response.filter(item => item.type === 'AIRPORT');
        setAirports(airportList);
        
        // Filter airports based on origin and destination
        const originMatches = airportList.filter(airport => 
          airport.name.toLowerCase().includes(origin.toLowerCase()) ||
          airport.city?.toLowerCase().includes(origin.toLowerCase())
        );
        setOriginAirports(originMatches);

        const destMatches = airportList.filter(airport => 
          airport.name.toLowerCase().includes(destination.toLowerCase()) ||
          airport.city?.toLowerCase().includes(destination.toLowerCase())
        );
        setDestAirports(destMatches);

        // Auto-select if only one match
        if (originMatches.length === 1) setSelectedOrigin(originMatches[0]);
        if (destMatches.length === 1) setSelectedDest(destMatches[0]);
      })
      .catch(error => {
        console.error('Failed to fetch airports:', error);
        toast.error('Erreur lors de la récupération des aéroports');
      });
  }, [origin, destination]);

  const handleSearch = async () => {
    if (!selectedOrigin || !selectedDest) {
      toast.error('Veuillez sélectionner les aéroports de départ et d\'arrivée');
      return;
    }

    setLoading(true);
    try {
      const response = await searchFlights({
        fromEntityId: selectedOrigin.entityId,
        toEntityId: selectedDest.entityId,
        departDate: new Date().toISOString().split('T')[0],
        type: 'oneway'
      });
      setFlights(response);
      onFlightSelect(response);
    } catch (error) {
      console.error('Failed to search flights:', error);
      toast.error('Erreur lors de la recherche des vols');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aéroport de départ
          </label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={selectedOrigin?.entityId || ''}
            onChange={(e) => {
              const airport = airports.find(a => a.entityId === e.target.value);
              setSelectedOrigin(airport || null);
            }}
          >
            <option value="">Sélectionnez un aéroport</option>
            {originAirports.map(airport => (
              <option key={airport.entityId} value={airport.entityId}>
                {airport.name} ({airport.iataCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aéroport d'arrivée
          </label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={selectedDest?.entityId || ''}
            onChange={(e) => {
              const airport = airports.find(a => a.entityId === e.target.value);
              setSelectedDest(airport || null);
            }}
          >
            <option value="">Sélectionnez un aéroport</option>
            {destAirports.map(airport => (
              <option key={airport.entityId} value={airport.entityId}>
                {airport.name} ({airport.iataCode})
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading || !selectedOrigin || !selectedDest}
        >
          {loading ? 'Recherche...' : 'Rechercher des vols'}
        </button>
      </div>

      {flights && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vols disponibles</h3>
          {flights.itineraries.map((itinerary, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              {itinerary.legs.map((leg, legIndex) => (
                <div key={legIndex} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Départ: {new Date(leg.departureDateTime).toLocaleString('fr-FR')}</span>
                    <span>Arrivée: {new Date(leg.arrivalDateTime).toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Durée: {Math.floor(leg.durationInMinutes / 60)}h {leg.durationInMinutes % 60}min</span>
                    <span>Compagnie: {leg.segments[0]?.operatingCarrier?.name || 'Non disponible'}</span>
                  </div>
                  {leg.distance && (
                    <div className="text-sm text-gray-600">
                      Distance: {Math.round(leg.distance)} km
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
