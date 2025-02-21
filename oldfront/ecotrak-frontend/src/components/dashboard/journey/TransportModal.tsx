import React, { useState, useEffect } from 'react';
import { X as CloseIcon } from 'lucide-react';

interface TransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'train' | 'plane';
  onSelect: (details: {
    company: string;
    number: string;
    departure: string;
    arrival: string;
  }) => void;
}

export function TransportModal({ isOpen, onClose, type, onSelect }: TransportModalProps) {
  const [company, setCompany] = useState('');
  const [number, setNumber] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!departure || !arrival) return;
    
    const searchTransport = async () => {
      setLoading(true);
      try {
        // TODO: Implement actual API calls to SNCF/Skyscanner
        const response = await fetch(`/api/transport/search?type=${type}&from=${departure}&to=${arrival}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error searching transport:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchTransport, 500);
    return () => clearTimeout(timer);
  }, [departure, arrival, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect({ company, number, departure, arrival });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="transport-modal">
      <div className="transport-modal__container">
        {/* Header */}
        <div className="transport-modal__header">
          <h3 className="transport-modal__title">
            {type === 'train' ? 'Détails du trajet en train' : 'Détails du vol'}
          </h3>
          <button 
            className="transport-modal__close" 
            onClick={onClose}
          >
            <CloseIcon className="transport-modal__close-icon" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="transport-modal__form">
          <div className="transport-modal__field">
            <label className="transport-modal__label">
              {type === 'train' ? 'Compagnie ferroviaire' : 'Compagnie aérienne'}
            </label>
            <input
              type="text"
              className="transport-modal__input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={type === 'train' ? 'Ex: SNCF, Deutsche Bahn...' : 'Ex: Air France, Lufthansa...'}
            />
          </div>

          <div className="transport-modal__field">
            <label className="transport-modal__label">
              {type === 'train' ? 'Numéro du train' : 'Numéro du vol'}
            </label>
            <input
              type="text"
              className="transport-modal__input"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={type === 'train' ? 'Ex: TGV 6214' : 'Ex: AF 1234'}
            />
          </div>

          <div className="transport-modal__field">
            <label className="transport-modal__label">
              Gare/Aéroport de départ
            </label>
            <input
              type="text"
              className="transport-modal__input"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Saisissez le lieu de départ"
            />
          </div>

          <div className="transport-modal__field">
            <label className="transport-modal__label">
              Gare/Aéroport d'arrivée
            </label>
            <input
              type="text"
              className="transport-modal__input"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              placeholder="Saisissez le lieu d'arrivée"
            />
          </div>

          {loading && (
            <div className="transport-modal__loading">
              <div className="transport-modal__spinner" />
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="transport-modal__suggestions">
              <h4 className="transport-modal__suggestions-title">Suggestions</h4>
              <div className="transport-modal__suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="transport-modal__suggestion"
                    onClick={() => {
                      setCompany(suggestion.company);
                      setNumber(suggestion.number);
                      setDeparture(suggestion.departure);
                      setArrival(suggestion.arrival);
                    }}
                  >
                    {suggestion.company} - {suggestion.number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="transport-modal__footer">
          <button 
            type="button" 
            className="transport-modal__button transport-modal__button--cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="transport-modal__button transport-modal__button--confirm"
            onClick={handleSubmit}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
