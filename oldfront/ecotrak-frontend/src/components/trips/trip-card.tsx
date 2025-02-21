// src/components/trips/trip-card.tsx
import { Journey, TransportMode } from "@/lib/types/journey";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatDistance, formatEmissions } from "@/lib/utils";
import { 
  CarIcon, 
  TrainIcon, 
  BusIcon,
  BicycleIcon,
  FootstepsIcon 
} from "lucide-react";

const transportIcons = {
  [TransportMode.CAR]: CarIcon,
  [TransportMode.TRAIN]: TrainIcon,
  [TransportMode.BUS]: BusIcon,
  [TransportMode.BIKE]: BicycleIcon,
  [TransportMode.WALK]: FootstepsIcon,
};

interface TripCardProps {
  journey: Journey;
  onClick?: () => void;
}

export function TripCard({ journey, onClick }: TripCardProps) {
  const Icon = transportIcons[journey.transportMode];

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <span>{journey.startPoint} → {journey.endPoint}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Distance</p>
            <p className="font-medium">{formatDistance(journey.distance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Émissions</p>
            <p className="font-medium">{formatEmissions(journey.emissions)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">
              {new Date(journey.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}