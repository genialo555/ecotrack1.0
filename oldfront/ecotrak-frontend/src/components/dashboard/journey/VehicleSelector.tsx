import React, { useState, useEffect } from 'react';
import { Car, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import './VehicleSelector.css';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  fuelType: string;
  consumption: number;
  co2PerKm: number;
}

interface VehicleSelectorProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  onVehicleSelect,
  selectedVehicleId,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des véhicules');
        }
        const data = await response.json();
        setVehicles(data);
        
        // Si un véhicule est trouvé et qu'aucun n'est sélectionné, sélectionner le premier
        if (data.length > 0 && !selectedVehicleId) {
          onVehicleSelect(data[0]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération des véhicules');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedVehicleId, onVehicleSelect]);

  if (loading) {
    return (
      <div className="vehicle-selector animate-pulse">
        <div className="vehicle-selector__loading-bar"></div>
        <div className="vehicle-selector__loading-space">
          <div className="vehicle-selector__loading-item"></div>
          <div className="vehicle-selector__loading-item"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-selector__container">
      <div className="vehicle-selector__header">
        <label className="vehicle-selector__label">
          Sélectionnez votre véhicule
        </label>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="vehicle-selector__info-button"
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <div className="vehicle-selector__info">
          <p>Les émissions de CO2 sont calculées en fonction du type de carburant et de la consommation de votre véhicule.</p>
        </div>
      )}

      <div className="vehicle-selector__list">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => onVehicleSelect(vehicle)}
            className={`vehicle-selector__button ${
              selectedVehicleId === vehicle.id
                ? 'vehicle-selector__button--selected'
                : 'vehicle-selector__button--default'
            }`}
          >
            <div className="vehicle-selector__item">
              <Car className="vehicle-selector__icon" />
              <div>
                <div className="vehicle-selector__brand">{vehicle.brand} {vehicle.model}</div>
                <div className="vehicle-selector__details">
                  {vehicle.fuelType} - {vehicle.consumption}L/100km
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
