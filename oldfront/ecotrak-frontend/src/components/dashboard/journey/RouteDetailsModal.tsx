import React from 'react';
import { XMark as CloseIcon, Navigation as NavigationIcon } from 'lucide-react';

interface RouteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: google.maps.DirectionsRoute;
  transportMode: string;
}

export function RouteDetailsModal({ isOpen, onClose, route, transportMode }: RouteDetailsModalProps) {
  if (!isOpen) return null;

  const leg = route.legs[0];

  return (
    <div className="route-modal route-modal--dark">
      <div className="route-modal__content route-modal__content--dark">
        <div className="route-modal__header route-modal__header--dark">
          <h3 className="route-modal__title route-modal__title--dark">Détails de l'itinéraire</h3>
          <button onClick={onClose} className="route-modal__close route-modal__close--dark">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="route-modal__body">
          {/* Summary */}
          <div className="route-modal__summary">
            <div className="route-modal__summary-grid">
              <div className="route-modal__summary-item">
                <div className="route-modal__summary-label route-modal__summary-label--dark">Distance</div>
                <div className="route-modal__summary-value route-modal__summary-value--dark">{leg.distance?.text}</div>
              </div>
              <div className="route-modal__summary-item">
                <div className="route-modal__summary-label route-modal__summary-label--dark">Durée</div>
                <div className="route-modal__summary-value route-modal__summary-value--dark">{leg.duration?.text}</div>
              </div>
              <div className="route-modal__summary-item">
                <div className="route-modal__summary-label route-modal__summary-label--dark">Mode</div>
                <div className="route-modal__summary-value route-modal__summary-value--dark capitalize">{transportMode.toLowerCase()}</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          {leg.steps.map((step, index) => (
            <div 
              key={index} 
              className="route-modal__step route-modal__step--dark"
            >
              <div className="route-modal__step-content">
                <div className="route-modal__step-icon route-modal__step-icon--dark">
                  {step.maneuver === 'turn-right' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  )}
                  {step.maneuver === 'turn-left' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  )}
                  {!step.maneuver && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  )}
                </div>
                <div className="route-modal__step-details">
                  <div 
                    className="route-modal__step-instructions route-modal__step-instructions--dark"
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                  />
                  <div className="route-modal__step-meta route-modal__step-meta--dark">
                    {step.distance?.text} · {step.duration?.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
