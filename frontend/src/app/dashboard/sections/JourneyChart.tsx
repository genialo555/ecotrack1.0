'use client';

import { useEffect, useState } from 'react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

interface Journey {
  id: string;
  transport_mode: string;
  distance_km: number;
  co2_emissions: number;
  start_time: string;
}

const calculateTotalDistance = (journeys: Journey[]): number => {
  return journeys.reduce((total, journey) => {
    const distance = parseFloat(journey.distance_km?.toString() || '0');
    return total + (isNaN(distance) ? 0 : distance);
  }, 0);
};

const calculateAverageDistance = (totalDistance: number, journeyCount: number): number => {
  if (journeyCount === 0) return 0;
  return totalDistance / journeyCount;
};

const calculateStats = (data: any[]) => {
  if (!data.length) return { totalDistance: 0, averageDistance: 0, trend: 0, mainMode: 'unknown' };

  const totalDistance = data.reduce((sum, item) => sum + item.distance, 0);
  const averageDistance = totalDistance / data.length;

  // Calculate trend based on the last two periods
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);
  
  const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.distance, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.distance, 0) / secondHalf.length;
  
  const trend = firstHalfAvg !== 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
    : 0;

  // Calculate main transport mode
  const modes: { [key: string]: number } = {};
  data.forEach(item => {
    const mode = item.transport_mode || 'unknown';
    modes[mode] = (modes[mode] || 0) + item.distance;
  });

  const mainMode = Object.entries(modes)
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    totalDistance,
    averageDistance,
    trend,
    mainMode
  };
};

const calculateMovingAverage = (data: any[], field: string, window: number = 7) => {
  return data.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const end = index + 1;
    const windowData = data.slice(start, end);
    const sum = windowData.reduce((acc, item) => acc + (item[field] || 0), 0);
    return sum / windowData.length;
  });
};

export function JourneyChart() {
  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [stats, setStats] = useState({
    totalDistance: 0,
    averageDistance: 0,
    trend: 0,
    mainMode: ''
  });

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/journeys`, {
          credentials: 'include',
        });
        const journeys: Journey[] = await response.json();

        // Group data by period
        const groupedData = journeys.reduce((acc: any[], journey: Journey) => {
          const date = new Date(journey.start_time);
          let periodKey;
          
          switch (period) {
            case 'monthly':
              periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              break;
            case 'weekly':
              const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
              periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-W${weekNumber}`;
              break;
            default: // daily
              periodKey = journey.start_time.split('T')[0];
          }

          const existingPeriod = acc.find(item => item.date === periodKey);
          if (existingPeriod) {
            existingPeriod.distance += Number(journey.distance_km || 0);
            existingPeriod.co2_emissions += Number(journey.co2_emissions || 0);
            if (!existingPeriod.transport_modes) existingPeriod.transport_modes = {};
            existingPeriod.transport_modes[journey.transport_mode] = 
              (existingPeriod.transport_modes[journey.transport_mode] || 0) + Number(journey.distance_km || 0);
            existingPeriod.transport_mode = Object.entries(existingPeriod.transport_modes)
              .sort((a, b) => b[1] - a[1])[0][0];
          } else {
            acc.push({
              date: periodKey,
              distance: Number(journey.distance_km || 0),
              co2_emissions: Number(journey.co2_emissions || 0),
              transport_mode: journey.transport_mode,
              transport_modes: { [journey.transport_mode]: Number(journey.distance_km || 0) }
            });
          }
          return acc;
        }, []);

        // Sort data by date
        const sortedData = groupedData.sort((a, b) => a.date.localeCompare(b.date));

        // Calculate moving averages with appropriate window sizes
        const windowSize = period === 'monthly' ? 3 : period === 'weekly' ? 4 : 7;
        const movingAvgDistance = calculateMovingAverage(sortedData, 'distance', windowSize);
        const movingAvgCO2 = calculateMovingAverage(sortedData, 'co2_emissions', windowSize);

        // Add moving averages to data
        const dataWithMovingAvg = sortedData.map((item, index) => ({
          ...item,
          movingAvgDistance: movingAvgDistance[index],
          movingAvgCO2: movingAvgCO2[index]
        }));

        // Calculate stats based on the current period's data
        const totalDistance = sortedData.reduce((sum, item) => sum + item.distance, 0);
        const periodCount = sortedData.length;
        const averageDistance = periodCount > 0 ? totalDistance / periodCount : 0;

        // Calculate trend
        const midPoint = Math.floor(sortedData.length / 2);
        const firstHalf = sortedData.slice(0, midPoint);
        const secondHalf = sortedData.slice(midPoint);
        
        const firstHalfAvg = firstHalf.length > 0 
          ? firstHalf.reduce((sum, item) => sum + item.distance, 0) / firstHalf.length 
          : 0;
        const secondHalfAvg = secondHalf.length > 0 
          ? secondHalf.reduce((sum, item) => sum + item.distance, 0) / secondHalf.length 
          : 0;
        
        const trend = firstHalfAvg !== 0 
          ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
          : 0;

        // Calculate main transport mode from the current period's data
        const modes = sortedData.reduce((acc, item) => {
          const mode = item.transport_mode;
          acc[mode] = (acc[mode] || 0) + item.distance;
          return acc;
        }, {} as Record<string, number>);

        const mainMode = Object.entries(modes)
          .sort((a, b) => b[1] - a[1])[0][0];

        setData(dataWithMovingAvg);
        setStats({
          totalDistance,
          averageDistance,
          trend,
          mainMode
        });

      } catch (error) {
        console.error('Error fetching journeys:', error);
      }
    };

    fetchJourneys();
  }, [period]);

  const translateTransportMode = (mode: string): string => {
    const translations: { [key: string]: string } = {
      'car': 'voiture',
      'bike': 'vélo',
      'walk': 'marche',
      'bus': 'bus',
      'train': 'train',
      'other': 'autre'
    };
    return translations[mode.toLowerCase()] || mode;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
              Analyse des Trajets
            </h2>
            <div className="flex gap-4 items-center">
              <select
                className="select select-bordered select-primary w-40 text-base"
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              >
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
              <label className="flex cursor-pointer gap-2 items-center">
                <input
                  type="checkbox"
                  checked={showMovingAverage}
                  onChange={(e) => setShowMovingAverage(e.target.checked)}
                  className="toggle toggle-primary"
                />
                <span className="label-text">Afficher la moyenne mobile</span>
              </label>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats shadow bg-base-200 w-full">
            <div className="stat">
              <div className="stat-title">Distance totale</div>
              <div className="stat-value text-primary">{stats.totalDistance.toFixed(1)} km</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Distance moyenne</div>
              <div className="stat-value text-secondary">{stats.averageDistance.toFixed(1)} km</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Tendance</div>
              <div className="stat-value text-accent flex items-center gap-1">
                <span className={stats.trend > 0 ? 'text-success' : stats.trend < 0 ? 'text-error' : 'text-info'}>
                  {stats.trend > 0 ? '↑' : stats.trend < 0 ? '↓' : '→'}
                </span>
                <span>{Math.abs(stats.trend).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Mode de transport principal</div>
              <div className="stat-value text-info capitalize">{translateTransportMode(stats.mainMode)}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full rounded-box p-4 relative" style={{ height: '500px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(249, 115, 22, 0.05))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={data} 
                margin={{ top: 30, right: 50, left: 30, bottom: 90 }}
              >
                <defs>
                  <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{
                    fill: '#3B82F6',
                    fontWeight: 'bold'
                  }}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{fill: '#22C55E'}}
                  label={{ 
                    value: 'Distance (km)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 0,
                    style: { fill: '#22C55E', fontWeight: 'bold' }
                  }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{fill: '#EF4444'}}
                  label={{ 
                    value: 'Émissions CO₂ (kg)', 
                    angle: 90, 
                    position: 'insideRight',
                    offset: 0,
                    style: { fill: '#EF4444', fontWeight: 'bold' }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--b1))', 
                    border: 'none',
                    borderRadius: '1rem',
                    color: 'hsl(var(--bc))',
                    padding: '1rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                  labelStyle={{
                    color: 'hsl(var(--p))',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--bc))',
                    padding: '0.25rem 0'
                  }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '20px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fillOpacity={0.6}
                  fill="url(#colorDistance)"
                  yAxisId="left"
                  name="Distance (km)"
                />
                <Line
                  type="monotone"
                  dataKey="co2_emissions"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={false}
                  yAxisId="right"
                  name="Émissions CO₂ (kg)"
                />
                {showMovingAverage && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="movingAvgDistance"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      yAxisId="left"
                      name="Moyenne mobile distance"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="movingAvgCO2"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      yAxisId="right"
                      name="Moyenne mobile CO₂"
                      strokeDasharray="5 5"
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
