'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleType, DEFAULT_CO2_RATES } from '@/types/vehicle';
import { getUserVehicles } from '@/services/vehicle.service';
import { CustomTravelMode } from './GmapsCardSelector';
import { AirQualityModal } from './AirQualityModal';
import toast from 'react-hot-toast';

interface TransitRoute {
  distance: number;
  duration: number;
  steps: any[];
}

const CO2_RATES = {
  TRANSIT: 68, // g/km for public transit
  BICYCLING: 0,
  WALKING: 0,
  FLYING: 285, // g/km for air travel
  DRIVING: DEFAULT_CO2_RATES[VehicleType.CAR] // g/km for average car
};

interface CO2SimulatorProps {
  onCalculate: (co2: number) => void;
  journey: {
    transportMode: CustomTravelMode;
    origin: string;
    destination: string;
    distance: number;
  };
}

interface CO2Calculation {
  totalCO2: number;
  isGreen: boolean;
}

export function CO2Simulator({ onCalculate, journey }: CO2SimulatorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [calculation, setCalculation] = useState<CO2Calculation | null>(null);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const userVehicles = await getUserVehicles();
        if (userVehicles.length > 0) {
          // Filter active vehicles
          const activeVehicles = userVehicles.filter(v => v.is_active);
          setVehicles(activeVehicles);

          // Set first active vehicle as default
          const defaultVehicle = activeVehicles[0];
          if (defaultVehicle) {
            setSelectedVehicle(defaultVehicle);
          }
        } else {
          toast.error('Aucun véhicule trouvé. Veuillez en ajouter un dans vos paramètres.');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Erreur lors de la récupération des véhicules');
      } finally {
        setLoading(false);
      }
    };

    if (journey.transportMode === 'DRIVING') {
      fetchVehicles();
    }
  }, [journey.transportMode]);

  const calculateCO2 = async () => {
    try {
      const co2Rate = selectedVehicle?.co2_rate || CO2_RATES[journey.transportMode] || CO2_RATES.DRIVING;
      const totalCO2 = co2Rate * journey.distance;
      
      const result = {
        totalCO2,
        isGreen: co2Rate < CO2_RATES.DRIVING
      };

      setCalculation(result);
      onCalculate(totalCO2);
      setShowAirQuality(true);
    } catch (error) {
      console.error('Error calculating CO2:', error);
      toast.error('Erreur lors du calcul des émissions CO2');
    }
  };

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Simulateur d'émissions CO₂</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mode de transport</h3>
              <div className="badge badge-primary">{journey.transportMode}</div>
            </div>

            {journey.transportMode === 'DRIVING' && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Véhicule</h3>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  <select 
                    className="select select-bordered w-full"
                    onChange={(e) => {
                      const vehicle = vehicles.find(v => v.id === e.target.value);
                      if (vehicle) {
                        setSelectedVehicle(vehicle);
                      }
                    }}
                    value={selectedVehicle?.id || ''}
                    disabled={loading}
                  >
                    <option value="">Sélectionnez un véhicule</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.co2_rate} g/km)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Trajet</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Départ:</span> {journey.origin}</p>
                <p><span className="font-medium">Arrivée:</span> {journey.destination}</p>
                <p><span className="font-medium">Distance:</span> {journey.distance.toFixed(2)} km</p>
              </div>
            </div>

            {calculation && (
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Émissions CO₂ estimées</h3>
                  <p className="text-xl">{calculation.totalCO2.toFixed(2)} g</p>
                  {calculation.isGreen && (
                    <p className="text-success">Ce trajet est écologique ! 🌱</p>
                  )}
                </div>
              </div>
            )}

            <div className="card-actions justify-end">
              <button 
                className="btn btn-primary"
                onClick={calculateCO2}
                disabled={journey.transportMode === 'DRIVING' && !selectedVehicle || loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Calculer'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAirQuality && (
        <AirQualityModal
          location={journey.origin}
          onClose={() => setShowAirQuality(false)}
        />
      )}
    </div>
  );
}
