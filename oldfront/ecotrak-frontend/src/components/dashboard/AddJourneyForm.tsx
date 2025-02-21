import React, { useState, useEffect } from 'react';
import { MapPreview } from './MapPreview';

interface AddJourneyFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}

export const AddJourneyForm: React.FC<AddJourneyFormProps> = ({ onSubmit, onCancel }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [transportMode, setTransportMode] = useState('car');
  const [debouncedStart, setDebouncedStart] = useState('');
  const [debouncedEnd, setDebouncedEnd] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStart(startLocation);
    }, 1000);
    return () => clearTimeout(timer);
  }, [startLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEnd(endLocation);
    }, 1000);
    return () => clearTimeout(timer);
  }, [endLocation]);

  return (
    <form onSubmit={onSubmit} className="add-journey-form">
      <div className="add-journey-form__field">
        <label htmlFor="startLocation" className="add-journey-form__label">
          Départ
        </label>
        <input
          type="text"
          id="startLocation"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="add-journey-form__input"
          placeholder="Lieu de départ"
          required
        />
      </div>

      <div className="add-journey-form__field">
        <label htmlFor="endLocation" className="add-journey-form__label">
          Arrivée
        </label>
        <input
          type="text"
          id="endLocation"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="add-journey-form__input"
          placeholder="Lieu d'arrivée"
          required
        />
      </div>

      {debouncedStart && debouncedEnd && (
        <div className="add-journey-form__map">
          <MapPreview 
            origin={debouncedStart} 
            destination={debouncedEnd} 
          />
        </div>
      )}

      <div className="add-journey-form__field">
        <label htmlFor="transportMode" className="add-journey-form__label">
          Mode de transport
        </label>
        <select
          id="transportMode"
          value={transportMode}
          onChange={(e) => setTransportMode(e.target.value)}
          className="add-journey-form__select"
          required
        >
          <option value="car" className="add-journey-form__option">Voiture</option>
          <option value="bus" className="add-journey-form__option">Bus</option>
          <option value="train" className="add-journey-form__option">Train</option>
          <option value="bike" className="add-journey-form__option">Vélo</option>
          <option value="walk" className="add-journey-form__option">Marche</option>
        </select>
      </div>

      <div className="add-journey-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="add-journey-form__button add-journey-form__button--cancel"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="add-journey-form__button add-journey-form__button--submit"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
};
