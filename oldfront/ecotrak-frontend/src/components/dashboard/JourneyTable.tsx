import React from 'react';
import { Journey } from '@/types/journey';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, ArrowUpDown, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDisplayDate } from '@/lib/utils/date';
import { fr } from 'date-fns/locale';

interface JourneyTableProps {
  journeys: Journey[];
  onSort?: (column: keyof Journey) => void;
  onEdit: (journey: Journey) => void;
  onDelete: (journey: Journey) => void;
}

const transportEmoji: Record<string, string> = {
  'car': '🚗',
  'bus': '🚌',
  'train': '🚂',
  'bike': '🚲',
  'walk': '🚶',
};

interface Journey {
  id: string;
  date: string;
  start_address: string;
  end_address: string;
  transport_mode: string;
  distance_km: number;
  duration_min: number;
  co2_kg: number;
}

const JourneyTable: React.FC<JourneyTableProps> = ({
  journeys,
  onSort,
  onEdit,
  onDelete,
}) => {
  const [viewMode, setViewMode] = React.useState('table');
  const [sortConfig, setSortConfig] = React.useState({
    field: 'date',
    order: 'desc',
  });

  const handleSort = (field: keyof Journey) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedJourneys = [...journeys].sort((a, b) => {
    const order = sortConfig.order === 'asc' ? 1 : -1;

    // Helper to safely compare dates
    const compareDates = (dateA: string | null, dateB: string | null) => {
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return (new Date(dateA).getTime() - new Date(dateB).getTime()) * order;
    };

    // Helper to safely compare numbers
    const compareNumbers = (numA: number | null, numB: number | null) => {
      if (numA === null && numB === null) return 0;
      if (numA === null) return 1;
      if (numB === null) return -1;
      return (numA - numB) * order;
    };

    switch (sortConfig.field) {
      case 'date':
        return compareDates(a.date, b.date);
      case 'distance_km':
        return compareNumbers(a.distance_km, b.distance_km);
      case 'duration_min':
        return compareNumbers(a.duration_min, b.duration_min);
      case 'co2_kg':
        return compareNumbers(a.co2_kg, b.co2_kg);
      default:
        const valA = a[sortConfig.field]?.toString() || '';
        const valB = b[sortConfig.field]?.toString() || '';
        return valA.localeCompare(valB, 'fr', { sensitivity: 'base' }) * order;
    }
  });

  const viewProps = {
    journeys: sortedJourneys,
    sortConfig,
    onSort: handleSort,
    onEdit,
    onDelete,
  };

  return (
    <div className="card bg-background shadow hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-muted/20">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trajets récents</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/10 text-muted'
              }`}
              aria-label="Vue tableau"
            >
              <span className="icon icon-table text-base" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/10 text-muted'
              }`}
              aria-label="Vue liste"
            >
              <span className="icon icon-list text-base" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/10 text-muted'
              }`}
              aria-label="Vue grille"
            >
              <span className="icon icon-grid text-base" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {viewMode === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle>Tous les Trajets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" onClick={() => onSort?.('date')} className="-ml-4">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => onSort?.('start_address')} className="-ml-4">
                        Départ
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => onSort?.('end_address')} className="-ml-4">
                        Arrivée
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => onSort?.('distance_km')} className="-mr-4">
                        Distance
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => onSort?.('duration_min')} className="-mr-4">
                        Durée
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => onSort?.('co2_kg')} className="-mr-4">
                        CO₂
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedJourneys.map((journey) => (
                    <TableRow key={journey.id}>
                      <TableCell className="font-medium">
                        {formatDisplayDate(journey.date)}
                      </TableCell>
                      <TableCell>{journey.start_address}</TableCell>
                      <TableCell>{journey.end_address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {transportEmoji[journey.transport_mode] || '🚗'}
                          </span>
                          <span className="capitalize">{journey.transport_mode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{journey.distance_km.toFixed(1)} km</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="h-4 w-4" />
                          {journey.duration_min} min
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {journey.co2_kg.toFixed(1)} kg
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(journey)}>
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(journey)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(journey)}
                              className="text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {viewMode === 'list' && <div>List view</div>}
        {viewMode === 'grid' && <div>Grid view</div>}
      </div>
    </div>
  );
};

export default JourneyTable;
