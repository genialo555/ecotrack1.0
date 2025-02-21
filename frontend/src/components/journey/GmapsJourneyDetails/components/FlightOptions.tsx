import React from 'react';
import { FLIGHT_CLASSES } from '../constants';

interface FlightOptionsProps {
  origin: string;
  destination: string;
  onSelectClass?: (className: string) => void;
}

export const FlightOptions: React.FC<FlightOptionsProps> = ({
  origin,
  destination,
  onSelectClass,
}) => {
  return (
    <div className="mt-4 space-y-3 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Options de vol disponibles</h3>
        <div className="text-sm text-gray-500">
          {origin} → {destination}
        </div>
      </div>
      
      <div className="space-y-2">
        {Object.entries(FLIGHT_CLASSES).map(([key, flightClass]) => (
          <div key={key} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <div className="grid grid-cols-8 gap-2">
              <div className={`col-span-2 ${key === 'STANDARD' ? 'bg-blue-500' : 'bg-blue-50'} py-3 px-4 rounded-l-lg flex items-center justify-center`}>
                <div className="text-center">
                  <div className={`text-xl font-bold ${key === 'STANDARD' ? 'text-white' : 'text-blue-600'}`}>
                    {flightClass.price} €
                  </div>
                  <div className={`text-xs ${key === 'STANDARD' ? 'text-white' : 'text-blue-600'} opacity-75`}>
                    {flightClass.name}
                  </div>
                </div>
              </div>
              <div className="col-span-4 py-3 px-4">
                <div className="space-y-2">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {flightClass.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-2 py-3 px-4 flex items-center">
                <div className="-ml-[40%]">
                  <button
                    onClick={() => onSelectClass?.(key)}
                    className={`min-w-[120px] px-4 py-1.5 text-sm ${
                      key === 'STANDARD'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    } rounded transition-colors`}
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
