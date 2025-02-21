import { Journey } from '@/types/journey';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface JourneyChartProps {
  journeys: Journey[];
}

export function JourneyChart({ journeys }: JourneyChartProps) {
  // Préparer les données pour le graphique
  const chartData = journeys.map(journey => ({
    date: new Date(journey.start_time).toLocaleDateString(),
    distance: journey.distance_km,
    co2: journey.co2_emissions
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="distance"
          stroke="#8884d8"
          name="Distance (km)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="co2"
          stroke="#82ca9d"
          name="CO₂ (kg)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
