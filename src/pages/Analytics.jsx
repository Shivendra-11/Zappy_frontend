import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { eventAPI } from '../api/api'
import './Analytics.css'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventAPI.getAnalytics()
        setAnalytics(data.analytics || null)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load analytics')
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDuration = (ms) => {
    if (ms == null) return '—'
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  const statusItems = useMemo(() => {
    const map = analytics?.statusCounts || {}
    const order = ['pending', 'checked-in', 'started', 'in-progress', 'completed', 'cancelled']
    return order
      .filter((k) => map[k] != null)
      .map((k) => ({ key: k, value: map[k] }))
  }, [analytics])

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="analytics-subtitle">Track totals, statuses, and time-based performance.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Events</button>
      </div>

      {!analytics ? (
        <div className="analytics-empty">
          <h2>No analytics available</h2>
          <p>Create a few events to see analytics here.</p>
        </div>
      ) : (
        <>
          <div className="analytics-cards">
            <div className="analytics-card">
              <div className="analytics-label">Total Events</div>
              <div className="analytics-value">{analytics.totals?.all ?? 0}</div>
              <div className="analytics-meta">Active: {analytics.totals?.active ?? 0} • Deleted: {analytics.totals?.deleted ?? 0}</div>
            </div>

            <div className="analytics-card">
              <div className="analytics-label">Completed</div>
              <div className="analytics-value">{analytics.statusCounts?.completed ?? 0}</div>
              <div className="analytics-meta">In-progress: {analytics.statusCounts?.['in-progress'] ?? 0}</div>
            </div>

            <div className="analytics-card">
              <div className="analytics-label">Avg Check-in → Start</div>
              <div className="analytics-value">{formatDuration(analytics.avgDurationsMs?.checkInToStarted)}</div>
              <div className="analytics-meta">From completed events</div>
            </div>

            <div className="analytics-card">
              <div className="analytics-label">Avg Check-in → Complete</div>
              <div className="analytics-value">{formatDuration(analytics.avgDurationsMs?.checkInToCompleted)}</div>
              <div className="analytics-meta">From completed events</div>
            </div>
          </div>

          <div className="analytics-panels">
            <div className="analytics-panel">
              <h2>Status Breakdown</h2>
              {statusItems.length === 0 ? (
                <p className="analytics-muted">No status data yet.</p>
              ) : (
                <div className="status-grid">
                  {statusItems.map((s) => (
                    <div key={s.key} className="status-item">
                      <span className="status-name">{s.key}</span>
                      <span className="status-count">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="analytics-panel">
              <h2>Average Durations</h2>
              <div className="duration-grid">
                <div className="duration-item">
                  <span className="duration-name">Check-in → Start</span>
                  <span className="duration-value">{formatDuration(analytics.avgDurationsMs?.checkInToStarted)}</span>
                </div>
                <div className="duration-item">
                  <span className="duration-name">Start → Complete</span>
                  <span className="duration-value">{formatDuration(analytics.avgDurationsMs?.startedToCompleted)}</span>
                </div>
                <div className="duration-item">
                  <span className="duration-name">Check-in → Complete</span>
                  <span className="duration-value">{formatDuration(analytics.avgDurationsMs?.checkInToCompleted)}</span>
                </div>
              </div>
              <p className="analytics-muted">These averages are calculated from completed events.</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics
