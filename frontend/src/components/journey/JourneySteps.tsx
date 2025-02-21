import React from 'react';

interface JourneyStepsProps {
  steps: google.maps.DirectionsStep[];
}

export const JourneySteps: React.FC<JourneyStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-1">
            {/* Step icon based on travel mode */}
            {step.travel_mode === 'TRANSIT' ? (
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ) : step.travel_mode === 'WALKING' ? (
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: step.instructions }}></div>
            {step.distance && step.duration && (
              <p className="text-xs text-gray-500 mt-1">
                {step.distance.text} • {step.duration.text}
                {step.transit && step.transit.line && (
                  <span className="ml-2">
                    {step.transit.line.vehicle && step.transit.line.vehicle.name} {step.transit.line.short_name || step.transit.line.name}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
