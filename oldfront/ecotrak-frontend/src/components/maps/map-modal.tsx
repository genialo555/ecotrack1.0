// src/components/maps/map-modal.tsx
import { useState, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { TransportMode } from '@/lib/types/journey';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    startPoint: string;
    endPoint: string;
    distance: number;
    duration: number;
    transportMode: TransportMode;
  }) => void;
}

const transportOptions = [
  { label: 'Voiture', value: TransportMode.CAR },
  { label: 'Bus', value: TransportMode.BUS },
  { label: 'Train', value: TransportMode.TRAIN },
  { label: 'Vélo', value: TransportMode.BIKE },
  { label: 'Marche', value: TransportMode.WALK },
];

const defaultCenter = { lat: 46.227638, lng: 2.213749 }; // Centre de la France

export function MapModal({ isOpen, onClose, onConfirm }: MapModalProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [transportMode, setTransportMode] = useState<TransportMode>(TransportMode.CAR);

  const calculateRoute = useCallback(async () => {
    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING // Par défaut en voiture
      });

      setDirections(result);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }, [startPoint, endPoint]);

  const handleConfirm = () => {
    if (!directions) return;

    const route = directions.routes[0];
    const leg = route.legs[0];
    
    onConfirm({
      startPoint: leg.start_address,
      endPoint: leg.end_address,
      distance: leg.distance?.value || 0,
      duration: leg.duration?.value || 0,
      transportMode,
    });
    
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Rechercher un itinéraire"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={!directions}>
            Confirmer
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Point de départ"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
          />
          <Input
            placeholder="Point d'arrivée"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
          />
          <Select
            value={transportMode}
            onChange={setTransportMode}
            options={transportOptions}
          />
          <Button onClick={calculateRoute} className="w-full">
            Calculer l'itinéraire
          </Button>
        </div>

        <div className="h-[400px] w-full">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={defaultCenter}
              zoom={5}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </Modal>
  );
}