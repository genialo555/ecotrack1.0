import React from 'react';
import { Journey } from '@/types/journey';
import { formatDisplayDate } from '@/lib/utils/date';
import { fr } from 'date-fns/locale';

interface TableViewProps {
  journeys: Journey[];
  sortConfig: {
    field: string;
    order: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (journey: Journey) => void;
  onDelete: (journey: Journey) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  journeys,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field) return null;
    return (
      <span className={`icon ${sortConfig.order === 'asc' ? 'icon-chevron-up' : 'icon-chevron-down'} text-muted`} />
    );
  };

  const calculateDuration = (start: Date | null, end: Date | null) => {
    if (!start || !end) return 0;
    try {
      return end.getTime() - start.getTime();
    } catch (error) {
      return 0;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`
      : `${remainingMinutes}m`;
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '-';
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1
    }).format(num);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-muted/20">
            <th className="py-3 px-4 text-left font-medium text-muted">
              <button 
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => onSort('date')}
              >
                Date
                <SortIcon field="date" />
              </button>
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              <button 
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => onSort('start_address')}
              >
                Départ
                <SortIcon field="start_address" />
              </button>
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              <button 
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => onSort('end_address')}
              >
                Arrivée
                <SortIcon field="end_address" />
              </button>
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              <button 
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => onSort('distance_km')}
              >
                Distance
                <SortIcon field="distance_km" />
              </button>
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              <button 
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => onSort('co2_kg')}
              >
                CO₂
                <SortIcon field="co2_kg" />
              </button>
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              Durée
            </th>
            <th className="py-3 px-4 text-left font-medium text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((journey, index) => {
            const duration = calculateDuration(
              journey.date ? new Date(journey.date) : null,
              null
            );

            return (
              <tr 
                key={journey.id || index}
                className="border-b border-muted/10 hover:bg-muted/5 transition-colors"
              >
                <td className="py-3 px-4">
                  {formatDisplayDate(journey.date)}
                </td>
                <td className="py-3 px-4">
                  {journey.start_address || '-'}
                </td>
                <td className="py-3 px-4">
                  {journey.end_address || '-'}
                </td>
                <td className="py-3 px-4">
                  {formatNumber(journey.distance_km)} km
                </td>
                <td className="py-3 px-4">
                  {formatNumber(journey.co2_kg)} kg
                </td>
                <td className="py-3 px-4">
                  {formatTime(duration / 60000)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(journey)}
                      className="p-2 text-muted hover:text-primary transition-colors"
                      aria-label="Modifier"
                    >
                      <span className="icon icon-edit" />
                    </button>
                    <button
                      onClick={() => onDelete(journey)}
                      className="p-2 text-muted hover:text-destructive transition-colors"
                      aria-label="Supprimer"
                    >
                      <span className="icon icon-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
