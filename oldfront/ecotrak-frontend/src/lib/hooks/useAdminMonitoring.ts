// src/lib/hooks/useAdminMonitoring.ts
import { useState, useEffect } from 'react'
import type { Journey, DailyStats, EmissionDataPoint, MonitoringData } from '../types/monitoring'

export function useAdminMonitoring() {
  const [activeUsers, setActiveUsers] = useState<number>(0)
  const [liveJourneys, setLiveJourneys] = useState<Journey[]>([])
  const [todayStats, setTodayStats] = useState<DailyStats>({
    totalJourneys: 0,
    totalEmissions: 0,
    totalDistance: 0,
    averageEmissionsPerJourney: 0
  })
  const [realtimeEmissions, setRealtimeEmissions] = useState<EmissionDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/monitoring')
        if (!response.ok) throw new Error('Failed to fetch monitoring data')
        
        const data: MonitoringData = await response.json()
        setActiveUsers(data.activeUsers)
        setLiveJourneys(data.liveJourneys)
        setTodayStats(data.todayStats)
        setRealtimeEmissions(data.realtimeEmissions)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 30000) // Refresh every 30s

    return () => clearInterval(interval)
  }, [])

  return {
    activeUsers,
    liveJourneys,
    todayStats,
    realtimeEmissions,
    loading,
    error
  }
}