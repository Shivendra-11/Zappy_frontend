import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventAPI } from '../api/api'
import { toast } from 'react-toastify'
import './Dashboard.css'

const Dashboard = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getEvents()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      'checked-in': '#3b82f6',
      started: '#8b5cf6',
      'in-progress': '#06b6d4',
      completed: '#10b981'
    }
    return colors[status] || '#6b7280'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDeleteEvent = async (e, eventId, eventName) => {
    e.stopPropagation()

    const ok = window.confirm(`Delete "${eventName}"? This cannot be undone.`)
    if (!ok) return

    try {
      await eventAPI.deleteEvent(eventId)
      toast.success('Event deleted')
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Event Dashboard</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-event')}
          >
            + Create New Event
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No Events Yet</h2>
            <p>Create your first event to start tracking vendor activities</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="event-card"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <div className="event-header">
                  <h3>{event.eventName}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(event.status) }}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="event-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date:</span>
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Location:</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👤 Customer:</span>
                    <span>{event.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📧 Email:</span>
                    <span>{event.customerEmail}</span>
                  </div>
                </div>

                <div className="event-progress">
                  <div className="progress-item">
                    <span className={event.checkIn?.timestamp ? 'completed' : ''}>
                      {event.checkIn?.timestamp ? '✅' : '⬜'} Check-in
                    </span>
                  </div>
                  <div className="progress-item">
                    <span className={event.startOTP?.isVerified ? 'completed' : ''}>
                      {event.startOTP?.isVerified ? '✅' : '⬜'} Start OTP
                    </span>
                  </div>
                  <div className="progress-item">
                    <span className={(event.eventSetup?.preSetupPhotos?.length || 0) > 0 ? 'completed' : ''}>
                      {(event.eventSetup?.preSetupPhotos?.length || 0) > 0 ? '✅' : '⬜'} Pre-Photos ({event.eventSetup?.preSetupPhotos?.length || 0})
                    </span>
                  </div>
                  <div className="progress-item">
                    <span className={(event.eventSetup?.postSetupPhotos?.length || 0) > 0 ? 'completed' : ''}>
                      {(event.eventSetup?.postSetupPhotos?.length || 0) > 0 ? '✅' : '⬜'} Post-Photos ({event.eventSetup?.postSetupPhotos?.length || 0})
                    </span>
                  </div>
                  <div className="progress-item">
                    <span className={event.closingOTP?.isVerified ? 'completed' : ''}>
                      {event.closingOTP?.isVerified ? '✅' : '⬜'} Closing OTP
                    </span>
                  </div>
                </div>

                <div className="event-footer">
                  <small>Created: {formatDate(event.createdAt)}</small>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDeleteEvent(e, event._id, event.eventName)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
