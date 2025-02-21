import React, { useEffect, useState } from 'react';
import { FiPlus, FiX, FiArrowUp, FiArrowDown, FiMapPin } from 'react-icons/fi';
import { AddressSearch } from './AddressSearch';

interface Waypoint {
  id: string;
  location: string;
  placeId?: string;
  stopover: boolean;
}

interface WaypointsManagerProps {
  waypoints: Waypoint[];
  onChange: (waypoints: Waypoint[]) => void;
  maxWaypoints?: number;
}

export const WaypointsManager: React.FC<WaypointsManagerProps> = ({
  waypoints,
  onChange,
  maxWaypoints = 5
}) => {
  const addWaypoint = () => {
    if (waypoints.length >= maxWaypoints) return;

    const newWaypoint: Waypoint = {
      id: Math.random().toString(36).substr(2, 9),
      location: '',
      stopover: true
    };
    onChange([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: string) => {
    onChange(waypoints.filter(wp => wp.id !== id));
  };

  const updateWaypoint = (id: string, location: string, placeId?: string) => {
    onChange(
      waypoints.map(wp =>
        wp.id === id ? { ...wp, location, placeId } : wp
      )
    );
  };

  const toggleStopover = (id: string) => {
    onChange(
      waypoints.map(wp =>
        wp.id === id ? { ...wp, stopover: !wp.stopover } : wp
      )
    );
  };

  const moveWaypoint = (fromIndex: number, toIndex: number) => {
    const newWaypoints = [...waypoints];
    const [removed] = newWaypoints.splice(fromIndex, 1);
    newWaypoints.splice(toIndex, 0, removed);
    onChange(newWaypoints);
  };

  return (
    <div className="waypoints-manager">
      <div className="waypoints-manager__header">
        <label className="waypoints-manager__title">
          Étapes intermédiaires
        </label>
        <button
          type="button"
          onClick={addWaypoint}
          disabled={waypoints.length >= maxWaypoints}
          className="waypoints-manager__add-button"
        >
          <FiPlus size={16} />
          Ajouter une étape
        </button>
      </div>

      {waypoints.length > 0 ? (
        <div className="waypoints-manager__list">
          {waypoints.map((waypoint, index) => (
            <div
              key={waypoint.id}
              className="waypoints-manager__item"
            >
              <div className="waypoints-manager__input-container">
                <AddressSearch
                  label={`Étape ${index + 1}`}
                  placeholder="Saisissez une adresse"
                  value={waypoint.location}
                  onChange={(address, placeId) => updateWaypoint(waypoint.id, address, placeId)}
                />
              </div>

              <div className="waypoints-manager__actions">
                <button
                  type="button"
                  onClick={() => toggleStopover(waypoint.id)}
                  className={`waypoints-manager__action ${
                    waypoint.stopover
                      ? 'waypoints-manager__action--stopover-active'
                      : 'waypoints-manager__action--stopover'
                  }`}
                  title={waypoint.stopover ? 'Arrêt obligatoire' : 'Passage simple'}
                >
                  <FiMapPin size={16} />
                </button>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveWaypoint(index, index - 1)}
                    className="waypoints-manager__action waypoints-manager__action--move"
                    title="Monter"
                  >
                    <FiArrowUp size={16} />
                  </button>
                )}
                {index < waypoints.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveWaypoint(index, index + 1)}
                    className="waypoints-manager__action waypoints-manager__action--move"
                    title="Descendre"
                  >
                    <FiArrowDown size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeWaypoint(waypoint.id)}
                  className="waypoints-manager__action waypoints-manager__action--delete"
                  title="Supprimer"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="waypoints-manager__empty">
          Aucune étape intermédiaire
        </div>
      )}

      {waypoints.length >= maxWaypoints && (
        <div className="waypoints-manager__warning">
          Nombre maximum d'étapes atteint ({maxWaypoints})
        </div>
      )}
    </div>
  );
};
