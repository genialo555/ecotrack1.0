'use client';

import { useEffect, useState } from 'react';
import { 
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { fetchAllUsers, fetchAllJourneys, type Journey, type User } from '@/services/admin.service';

const parseNumber = (value: any): number => {
  const num = parseFloat(value?.toString() || '0');
  return isNaN(num) ? 0 : num;
};

interface ChartData {
  date: string;
  totalJourneys: number;
  totalDistance: number;
  totalEmissions: number;
  uniqueUsers: number;
  byMode: {
    [key: string]: number;
  };
  movingAvgDistance?: number;
  movingAvgEmissions?: number;
}

interface StatsData {
  totalJourneys: number;
  totalDistance: number;
  totalEmissions: number;
  activeUsers: number;
  trend: number;
  popularMode: string;
  averageJourneysPerUser: number;
}

const calculateStats = (data: ChartData[]): StatsData => {
  if (!data.length) {
    return {
      totalJourneys: 0,
      totalDistance: 0,
      totalEmissions: 0,
      activeUsers: 0,
      trend: 0,
      popularMode: 'N/A',
      averageJourneysPerUser: 0
    };
  }

  const totalJourneys = data.reduce((sum, item) => sum + parseNumber(item.totalJourneys), 0);
  const totalDistance = data.reduce((sum, item) => sum + parseNumber(item.totalDistance), 0);
  const totalEmissions = data.reduce((sum, item) => sum + parseNumber(item.totalEmissions), 0);
  const activeUsers = Math.max(...data.map(item => parseNumber(item.uniqueUsers)));

  // Calculate trend
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);
  
  const firstHalfAvg = firstHalf.reduce((sum, item) => sum + parseNumber(item.totalJourneys), 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, item) => sum + parseNumber(item.totalJourneys), 0) / secondHalf.length;
  
  const trend = firstHalfAvg !== 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
    : 0;

  // Calculate most popular mode
  const modeCount: { [key: string]: number } = {};
  data.forEach(item => {
    Object.entries(item.byMode || {}).forEach(([mode, count]) => {
      modeCount[mode] = parseNumber(modeCount[mode]) + parseNumber(count);
    });
  });

  const popularMode = Object.entries(modeCount).length > 0
    ? Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';

  return {
    totalJourneys,
    totalDistance,
    totalEmissions,
    activeUsers,
    trend,
    popularMode,
    averageJourneysPerUser: activeUsers ? totalJourneys / activeUsers : 0
  };
};

const calculateMovingAverage = (data: ChartData[], field: keyof ChartData, window: number = 7) => {
  return data.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const end = index + 1;
    const windowData = data.slice(start, end);
    const sum = windowData.reduce((acc, item) => acc + parseNumber(item[field]), 0);
    return sum / windowData.length;
  });
};

export function AdminStatsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    totalJourneys: 0,
    totalDistance: 0,
    totalEmissions: 0,
    activeUsers: 0,
    trend: 0,
    popularMode: 'N/A',
    averageJourneysPerUser: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both users and journeys in parallel
        const [users, journeys] = await Promise.all([
          fetchAllUsers(),
          fetchAllJourneys()
        ]);

        if (!journeys.length) {
          setError('No journey data available');
          return;
        }

        // Group journeys by period
        const groupedData = journeys.reduce((acc: { [key: string]: ChartData & { userSet: Set<string> } }, journey: Journey) => {
          const date = new Date(journey.start_time);
          let periodKey;
          
          switch (period) {
            case 'monthly':
              periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              break;
            case 'weekly':
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              periodKey = weekStart.toISOString().split('T')[0];
              break;
            default: // daily
              periodKey = date.toISOString().split('T')[0];
          }

          if (!acc[periodKey]) {
            acc[periodKey] = {
              date: periodKey,
              totalJourneys: 0,
              totalDistance: 0,
              totalEmissions: 0,
              uniqueUsers: 0,
              byMode: {},
              userSet: new Set()
            };
          }

          acc[periodKey].totalJourneys++;
          acc[periodKey].totalDistance += parseNumber(journey.distance_km);
          acc[periodKey].totalEmissions += parseNumber(journey.co2_emissions);
          acc[periodKey].byMode[journey.transport_mode] = parseNumber(acc[periodKey].byMode[journey.transport_mode]) + 1;
          acc[periodKey].userSet.add(journey.user_id);
          acc[periodKey].uniqueUsers = acc[periodKey].userSet.size;

          return acc;
        }, {});

        // Convert to array and sort by date
        const sortedData = Object.values(groupedData)
          .map(({ userSet, ...rest }) => rest)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate moving averages if enabled
        if (showMovingAverage) {
          const distanceMA = calculateMovingAverage(sortedData, 'totalDistance');
          const emissionsMA = calculateMovingAverage(sortedData, 'totalEmissions');
          
          sortedData.forEach((item, index) => {
            item.movingAvgDistance = parseNumber(distanceMA[index]);
            item.movingAvgEmissions = parseNumber(emissionsMA[index]);
          });
        }

        setData(sortedData);
        setStats(calculateStats(sortedData));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, showMovingAverage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-box p-6 shadow-xl">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="stats shadow bg-gradient-to-br from-rose-500/10 to-rose-600/20 text-rose-900 dark:text-rose-100">
          <div className="stat">
            <div className="stat-title font-medium">Total Journeys</div>
            <div className="stat-value text-rose-600 dark:text-rose-400">
              {parseNumber(stats.totalJourneys).toLocaleString()}
            </div>
            <div className={`stat-desc font-medium ${stats.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {stats.trend > 0 ? '↗' : '↘'} {Math.abs(parseNumber(stats.trend)).toFixed(1)}% from previous period
            </div>
          </div>
        </div>
        
        <div className="stats shadow bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-900 dark:text-amber-100">
          <div className="stat">
            <div className="stat-title font-medium">Active Users</div>
            <div className="stat-value text-amber-600 dark:text-amber-400">
              {parseNumber(stats.activeUsers).toLocaleString()}
            </div>
            <div className="stat-desc font-medium text-amber-700 dark:text-amber-300">
              ~{parseNumber(stats.averageJourneysPerUser).toFixed(1)} journeys per user
            </div>
          </div>
        </div>

        <div className="stats shadow bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-900 dark:text-blue-100">
          <div className="stat">
            <div className="stat-title font-medium">Total Distance</div>
            <div className="stat-value text-blue-600 dark:text-blue-400">
              {parseNumber(stats.totalDistance).toFixed(1)} km
            </div>
            <div className="stat-desc font-medium text-blue-700 dark:text-blue-300">
              Most used: {stats.popularMode || 'N/A'}
            </div>
          </div>
        </div>

        <div className="stats shadow bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-900 dark:text-emerald-100">
          <div className="stat">
            <div className="stat-title font-medium">CO₂ Emissions</div>
            <div className="stat-value text-emerald-600 dark:text-emerald-400">
              {parseNumber(stats.totalEmissions).toFixed(1)} kg
            </div>
            <div className="stat-desc font-medium text-emerald-700 dark:text-emerald-300">
              Total carbon impact
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 bg-base-200/50 p-3 rounded-lg">
        <div className="flex gap-2">
          <select 
            className="select select-sm bg-base-100/50 border-none" 
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <label className="cursor-pointer label">
            <span className="label-text mr-2">Show Trends</span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
              checked={showMovingAverage}
              onChange={(e) => setShowMovingAverage(e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return period === 'monthly' 
                  ? date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                  : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              tick={{ fontSize: 12 }} 
              label={{ value: 'Journeys', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Distance (km) / CO₂ (kg)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Area
              yAxisId="left"
              dataKey="totalJourneys"
              fill="#ef4444"
              stroke="#dc2626"
              name="Total Journeys"
              fillOpacity={0.3}
              stackId="1"
            />
            <Area
              yAxisId="right"
              dataKey="totalDistance"
              fill="#3b82f6"
              stroke="#2563eb"
              fillOpacity={0.3}
              name="Distance (km)"
              stackId="2"
            />
            <Area
              yAxisId="right"
              dataKey="totalEmissions"
              fill="#22c55e"
              stroke="#16a34a"
              fillOpacity={0.3}
              name="CO₂ Emissions (kg)"
              stackId="2"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
