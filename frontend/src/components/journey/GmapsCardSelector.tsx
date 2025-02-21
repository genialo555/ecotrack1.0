'use client';

import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import { LocationTrackingButton } from '@/components/common/LocationTrackingButton';
import { searchAirports, type SkyId } from '@/services/flight.service';
import { useGoogleMapsScript } from '@/services/google-maps.service';

export type CustomTravelMode = google.maps.TravelMode | 'FLYING';

interface GmapsCardSelectorProps {
  onSelect: (data: {
    origin: string;
    destination: string;
    transportMode: CustomTravelMode;
    startLatitude?: number;
    startLongitude?: number;
    endLatitude?: number;
    endLongitude?: number;
    departureTime: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  }) => void;
  isLoaded: boolean;
}

interface FormData {
  origin: string;
  destination: string;
  transportMode: CustomTravelMode;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  departureTime: string;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
}

export function GmapsCardSelector({ onSelect, isLoaded }: GmapsCardSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<CustomTravelMode>(google.maps.TravelMode.DRIVING);
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    destination: '',
    transportMode: google.maps.TravelMode.DRIVING,
    departureTime: new Date().toISOString().split('T')[0],
  });

  const [cities, setCities] = useState<SkyId[]>([]);
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [filteredOriginCities, setFilteredOriginCities] = useState<SkyId[]>([]);
  const [filteredDestCities, setFilteredDestCities] = useState<SkyId[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMode, setIsLoadingMode] = useState(false);

  const handleOriginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOriginInput(value);
    if (value.length >= 2) {
      searchAirports(value)
        .then((results: SkyId[]) => {
          setFilteredOriginCities(results.slice(0, 5));
        })
        .catch((error: Error) => {
          console.error('Error fetching cities:', error);
          toast.error('Erreur lors de la recherche des villes');
        });
    } else {
      setFilteredOriginCities([]);
    }
  };

  const handleDestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestInput(value);
    if (value.length >= 2) {
      searchAirports(value)
        .then((results: SkyId[]) => {
          setFilteredDestCities(results.slice(0, 5));
        })
        .catch((error: Error) => {
          console.error('Error fetching cities:', error);
          toast.error('Erreur lors de la recherche des villes');
        });
    } else {
      setFilteredDestCities([]);
    }
  };

  const handleCitySelect = (city: SkyId, type: 'origin' | 'destination') => {
    const displayName = `${city.name}, ${city.countryName}`;
    if (type === 'origin') {
      setFormData(prev => ({
        ...prev,
        origin: displayName,
        originEntityId: city.entityId
      }));
      setOriginInput(displayName);
      setFilteredOriginCities([]);
    } else {
      setFormData(prev => ({
        ...prev,
        destination: displayName,
        destinationEntityId: city.entityId
      }));
      setDestInput(displayName);
      setFilteredDestCities([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'transportMode') {
      // Reset cities when switching modes
      setOriginInput('');
      setDestInput('');
      setFilteredOriginCities([]);
      setFilteredDestCities([]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeChange = (mode: CustomTravelMode) => {
    setIsLoadingMode(true);
    // Add longer delay for plane mode
    const delay = mode === 'FLYING' ? 1000 : 300;
    
    setTimeout(() => {
      setSelectedMode(mode);
      setFormData(prev => ({
        ...prev,
        transportMode: mode
      }));
      setIsLoadingMode(false);
    }, delay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    try {
      const [originResult, destResult] = await Promise.all([
        geocodeAddress(geocoder, formData.origin),
        geocodeAddress(geocoder, formData.destination)
      ]);

      // Convert CustomTravelMode to google.maps.TravelMode if not FLYING
      const travelMode = formData.transportMode === 'FLYING' 
        ? 'FLYING' as const
        : formData.transportMode;

      const journeyData = {
        origin: formData.origin,
        destination: formData.destination,
        transportMode: travelMode,
        startLatitude: originResult?.geometry.location.lat(),
        startLongitude: originResult?.geometry.location.lng(),
        endLatitude: destResult?.geometry.location.lat(),
        endLongitude: destResult?.geometry.location.lng(),
        departureTime: formData.departureTime,
        frequency: formData.frequency
      };

      onSelect(journeyData);
    } catch (error) {
      console.error('Error geocoding addresses:', error);
      toast.error('Erreur lors de la géolocalisation des adresses');
    }
  };

  const geocodeAddress = (geocoder: google.maps.Geocoder, address: string): Promise<google.maps.GeocoderResult> => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve(results[0]);
        } else {
          reject(new Error(`Geocoding failed for address: ${address}`));
        }
      });
    });
  };

  const handleLocationUpdate = (location: { latitude: number; longitude: number; address?: string }) => {
    const displayAddress = location.address || `${location.latitude}, ${location.longitude}`;
    
    if (selectedMode === 'FLYING') {
      setOriginInput(displayAddress);
      setFormData(prev => ({
        ...prev,
        origin: displayAddress,
        startLatitude: location.latitude,
        startLongitude: location.longitude
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        origin: displayAddress,
        startLatitude: location.latitude,
        startLongitude: location.longitude
      }));
    }
  };

  if (!isLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Planifier un trajet</h3>
      <div className="flex flex-col gap-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode de transport
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {([
              google.maps.TravelMode.DRIVING,
              google.maps.TravelMode.TRANSIT,
              google.maps.TravelMode.BICYCLING,
              google.maps.TravelMode.WALKING,
              'FLYING' as const
            ] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                disabled={isLoadingMode}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-all duration-150 ${
                  isLoadingMode 
                    ? 'opacity-50 cursor-not-allowed'
                    : selectedMode === mode
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {isLoadingMode ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
                ) : (
                  <>
                    {mode === google.maps.TravelMode.DRIVING && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {mode === google.maps.TravelMode.TRANSIT && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2zm8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2h10z" />
                      </svg>
                    )}
                    {mode === google.maps.TravelMode.BICYCLING && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    )}
                    {mode === google.maps.TravelMode.WALKING && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                    {mode === 'FLYING' && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14l-4 4H9l-4-4zm0 14h14l-4-4H9l-4 4z" />
                      </svg>
                    )}
                    <span className="text-sm">{mode}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {selectedMode === 'FLYING' ? (
              <>
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Départ
                    </label>
                    <LocationTrackingButton
                      onLocationUpdate={handleLocationUpdate}
                      className="scale-75"
                    />
                  </div>
                  <input
                    type="text"
                    value={originInput}
                    onChange={handleOriginInputChange}
                    placeholder="Rechercher une ville de départ"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  {filteredOriginCities.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                      {filteredOriginCities.map((city) => (
                        <div
                          key={city.entityId}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                          onClick={() => handleCitySelect(city, 'origin')}
                        >
                          {city.photoUri && (
                            <img 
                              src={city.photoUri} 
                              alt={city.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {city.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {city.countryName}
                              {city.iata && ` • ${city.iata}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville d'arrivée
                  </label>
                  <input
                    type="text"
                    value={destInput}
                    onChange={handleDestInputChange}
                    placeholder="Rechercher une ville"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  {filteredDestCities.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                      {filteredDestCities.map((city) => (
                        <div
                          key={city.entityId}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                          onClick={() => handleCitySelect(city, 'destination')}
                        >
                          {city.photoUri && (
                            <img 
                              src={city.photoUri} 
                              alt={city.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {city.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {city.countryName}
                              {city.iata && ` • ${city.iata}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Départ
                    </label>
                    <LocationTrackingButton
                      onLocationUpdate={handleLocationUpdate}
                      className="scale-75"
                    />
                  </div>
                  <Autocomplete>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      placeholder="Entrez votre adresse de départ ou utilisez votre position"
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                  </Autocomplete>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrivée
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Entrez l'adresse d'arrivée"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de départ
              </label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="once">Une fois</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  );
}
