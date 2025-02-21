'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

interface AddressSearchProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect: (address: string) => void;
  onBlur?: () => void;
  error?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Type for Google Places prediction
interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AddressSearch({
  id,
  label,
  value,
  onChange,
  onSelect,
  onBlur,
  error,
  placeholder,
  className,
  disabled
}: AddressSearchProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const abortController = useRef<AbortController | null>(null);
  const mouseDownRef = useRef(false);
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Initialize Google Places service
  useEffect(() => {
    const initService = () => {
      try {
        if (window.google && !autocompleteService.current) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        }
      } catch (error) {
        console.error('Error initializing Google Places service:', error);
      }
    };

    initService();
  }, []);

  // Cleanup function for ongoing requests
  const cleanupRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    cleanupRequest();

    if (!input || !autocompleteService.current || input.length < 3) {
      setPredictions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    abortController.current = new AbortController();

    try {
      const request = {
        input,
        sessionToken: sessionToken.current,
        componentRestrictions: { country: 'fr' },
        types: ['geocode']
      };

      const result = await new Promise<PlacePrediction[]>((resolve, reject) => {
        if (!autocompleteService.current) {
          reject(new Error('Autocomplete service not initialized'));
          return;
        }

        autocompleteService.current.getPlacePredictions(
          request,
          (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
            if (abortController.current?.signal.aborted) {
              return;
            }

            switch (status) {
              case google.maps.places.PlacesServiceStatus.OK:
                if (predictions) {
                  resolve(predictions as unknown as PlacePrediction[]);
                } else {
                  resolve([]);
                }
                break;
              case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
                resolve([]);
                break;
              case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
                resolve([]);
                break;
              default:
                console.warn('Places service warning:', status);
                resolve([]);
                break;
            }
          }
        );
      });

      if (!abortController.current?.signal.aborted) {
        setPredictions(result);
        setIsOpen(result.length > 0);
      }
    } catch (error) {
      if (!abortController.current?.signal.aborted) {
        console.error('Error fetching predictions:', error);
        setPredictions([]);
        setIsOpen(false);
      }
    } finally {
      if (!abortController.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [cleanupRequest]);

  useEffect(() => {
    return () => {
      cleanupRequest();
    };
  }, [cleanupRequest]);

  useEffect(() => {
    fetchPredictions(debouncedInputValue);
  }, [debouncedInputValue, fetchPredictions]);

  const handleSelect = (prediction: PlacePrediction) => {
    setInputValue(prediction.description);
    onSelect(prediction.description);
    if (onChange) {
      onChange(prediction.description);
    }
    setPredictions([]);
    setIsOpen(false);
    mouseDownRef.current = false;
    if (window.google) {
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
    if (value.length >= 3) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only close if we're not clicking on a suggestion
    if (!mouseDownRef.current) {
      setIsOpen(false);
      if (onBlur) {
        onBlur();
      }
    }
  };

  const handleFocus = () => {
    if (predictions.length > 0 && inputValue.length >= 3) {
      setIsOpen(true);
    }
  };

  const handleSuggestionMouseDown = (e: React.MouseEvent, prediction: PlacePrediction) => {
    e.preventDefault(); // Prevent input blur
    mouseDownRef.current = true;
    handleSelect(prediction);
    // Reset the flag after a short delay
    setTimeout(() => {
      mouseDownRef.current = false;
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground/90 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MapPin className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-4 py-2 bg-background dark:bg-background/5 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-destructive dark:border-destructive/70' : 'border-border dark:border-border/50'}
            ${disabled ? 'bg-muted dark:bg-muted/20' : ''}
          `}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {isOpen && predictions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute z-50 w-full mt-1 bg-background dark:bg-background/95 border border-border/50 dark:border-border/30 rounded-md shadow-lg dark:shadow-lg dark:shadow-black/20 max-h-60 overflow-auto"
        >
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onMouseDown={(e) => handleSuggestionMouseDown(e, prediction)}
              className="w-full px-4 py-2 text-left hover:bg-muted/50 dark:hover:bg-muted/20 focus:bg-muted/50 dark:focus:bg-muted/20 focus:outline-none transition-colors"
            >
              <div className="font-medium text-foreground/90">{prediction.structured_formatting.main_text}</div>
              <div className="text-sm text-muted-foreground">{prediction.structured_formatting.secondary_text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
