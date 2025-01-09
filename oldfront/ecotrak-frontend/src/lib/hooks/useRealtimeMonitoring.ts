// src/lib/hooks/useRealtimeMonitoring.ts
import { useState, useEffect } from 'react';
import { AdminMonitoringService } from '../services/admin-monitoring.service';

export function useRealtimeMonitoring() {
  const [liveData, setLiveData] = useState({
    activeUsers: 0,
    currentJourneys: [],
    totalEmissionsToday: 0,
    realtimeEmissions: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const [activeUsers, currentJourneys, emissions] = await Promise.all([
        AdminMonitoringService.getActiveUsers(),
        AdminMonitoringService.getCurrentJourneys(),
        AdminMonitoringService.getRealtimeEmissions()
      ]);

      setLiveData({
        activeUsers,
        currentJourneys,
        totalEmissionsToday: emissions.today,
        realtimeEmissions: emissions.realtime
      });
    };

    // Mise à jour toutes les 30 secondes
    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return liveData;
}