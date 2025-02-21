'use client';

import { useState, useCallback } from 'react';
import { GmapsCardSelector, type CustomTravelMode } from '@/components/journey/GmapsCardSelector';
import { GmapsJourneyDetails } from '@/components/journey/GmapsJourneyDetails/GmapsJourneyDetails';
import { CO2Simulator } from '@/components/journey/CO2Simulator';
import { Toaster } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import toast from 'react-hot-toast';

type ModalStep = 'selection' | 'details' | 'simulator';

interface QuickActionsSectionProps {
  userId: string;
}

interface JourneyDetails {
  origin: string;
  destination: string;
  transportMode: CustomTravelMode;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  departureTime: string;
  distance: number;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places", "geometry"];

// Add gradient animation styles
const gradientStyle = {
  background: 'linear-gradient(-45deg, rgba(238,119,82,0.35), rgba(231,60,126,0.35), rgba(35,166,213,0.35), rgba(35,213,171,0.35))',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  position: 'relative' as const,
  borderRadius: '0.75rem',
  padding: '8px',
  boxShadow: '0 0 20px rgba(35,166,213,0.25)',
} as const;

const contentStyle = {
  background: 'white',
  borderRadius: '0.5rem',
  position: 'relative' as const,
  zIndex: 1,
  height: '100%',
  border: '1px solid rgba(35,166,213,0.15)',
} as const;

// Add keyframes for the gradient animation
const keyframes = `
@keyframes gradient {
  0% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = keyframes;
  document.head.appendChild(style);
}

export function QuickActionsSection({ userId }: QuickActionsSectionProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [currentStep, setCurrentStep] = useState<ModalStep>('selection');
  const [showModals, setShowModals] = useState(false);
  const [journeyDetails, setJourneyDetails] = useState<JourneyDetails | null>(null);

  const handleAddJourney = () => {
    setShowModals(true);
    setCurrentStep('selection');
  };

  const handleJourneySelect = (data: Omit<JourneyDetails, 'distance'>) => {
    setJourneyDetails({ ...data, distance: 0 });
    setCurrentStep('details');
  };

  const handleJourneyConfirm = (distance: number, duration: number) => {
    if (journeyDetails) {
      setJourneyDetails({
        ...journeyDetails,
        distance
      });
    }
    setCurrentStep('simulator');
  };

  const handleJourneyComplete = useCallback(() => {
    console.log('Journey complete callback triggered');
    setShowModals(false);
    setCurrentStep('selection');
    setJourneyDetails(null);
    toast.success('Trajet ajouté avec succès!');
  }, []);

  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('selection');
        break;
      case 'simulator':
        setCurrentStep('details');
        break;
    }
  };

  const handleClose = useCallback(() => {
    console.log('Closing modals');
    setShowModals(false);
    setCurrentStep('selection');
    setJourneyDetails(null);
  }, []);

  if (!isLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Actions Rapides
      </h2>

      {/* Add Journey Button - Below title */}
      {!showModals && (
        <div className="flex justify-center mb-8">
          <button
            className="btn btn-primary gap-2 font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg"
            onClick={handleAddJourney}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Ajouter un trajet
          </button>
        </div>
      )}

      {/* Modals Container */}
      {showModals && createPortal(
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} style={{ zIndex: 40 }} />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-[98%] max-w-[1800px] flex gap-1">
              {/* Selection Modal */}
              <div className="flex-1" style={gradientStyle}>
                <div className="modal-box w-full bg-base-100 p-2" style={contentStyle}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl">Sélectionner un itinéraire</h3>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>✕</button>
                  </div>
                  <div className="h-[700px] overflow-y-auto">
                    <GmapsCardSelector onSelect={handleJourneySelect} isLoaded={isLoaded} />
                  </div>
                </div>
              </div>

              {/* Details Modal */}
              <div className="flex-1" style={gradientStyle}>
                <div className="modal-box w-full bg-base-100 p-2" style={contentStyle}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl">Détails du trajet</h3>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost" onClick={handleBack}>Retour</button>
                      <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>✕</button>
                    </div>
                  </div>
                  <div className="h-[700px] overflow-y-auto">
                    {journeyDetails ? (
                      <GmapsJourneyDetails 
                        journey={{
                          origin: journeyDetails.origin,
                          destination: journeyDetails.destination,
                          transportMode: journeyDetails.transportMode,
                          startLatitude: journeyDetails.startLatitude,
                          startLongitude: journeyDetails.startLongitude,
                          endLatitude: journeyDetails.endLatitude,
                          endLongitude: journeyDetails.endLongitude
                        }}
                        onConfirm={handleJourneyConfirm}
                        onComplete={handleJourneyComplete}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className="text-lg text-center">Sélectionnez un itinéraire pour voir les détails</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Simulator Modal */}
              <div className="flex-1" style={gradientStyle}>
                <div className="modal-box w-full bg-base-100 p-2" style={contentStyle}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl">Simulateur CO₂</h3>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost" onClick={handleBack}>Retour</button>
                      <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>✕</button>
                    </div>
                  </div>
                  <div className="h-[700px] overflow-y-auto">
                    {currentStep === 'simulator' && journeyDetails && (
                      <CO2Simulator 
                        onCalculate={handleJourneyComplete}
                        journey={{
                          transportMode: journeyDetails.transportMode,
                          origin: journeyDetails.origin,
                          destination: journeyDetails.destination,
                          distance: journeyDetails.distance
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      <Toaster />
    </div>
  );
}
