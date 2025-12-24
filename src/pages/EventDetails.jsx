import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eventAPI } from '../api/api'
import { toast } from 'react-toastify'
import './EventDetails.css'

const EventDetails = () => {
  const { eventId, id } = useParams()
  const resolvedEventId = eventId || id
  const navigate = useNavigate()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('checkin')
  
  // Check-in state
  const [checkInPhoto, setCheckInPhoto] = useState(null)
  const [checkInLoading, setCheckInLoading] = useState(false)
  
  // OTP states
  const [startOtpInput, setStartOtpInput] = useState('')
  const [closingOtpInput, setClosingOtpInput] = useState('')

  // OTP countdown (10 minutes)
  const OTP_TTL_MS = 10 * 60 * 1000
  const [startOtpRemainingMs, setStartOtpRemainingMs] = useState(null)
  const [closingOtpRemainingMs, setClosingOtpRemainingMs] = useState(null)
  
  // Setup photos states
  const [prePhotos, setPrePhotos] = useState([])
  const [postPhotos, setPostPhotos] = useState([])
  const [preNotes, setPreNotes] = useState('')
  const [postNotes, setPostNotes] = useState('')

  useEffect(() => {
    fetchEventDetails()
  }, [resolvedEventId])

  const computeRemainingMs = (sentAt) => {
    if (!sentAt) return null
    const sentAtMs = new Date(sentAt).getTime()
    if (Number.isNaN(sentAtMs)) return null
    return Math.max(0, OTP_TTL_MS - (Date.now() - sentAtMs))
  }

  const formatRemaining = (ms) => {
    if (ms == null) return ''
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  useEffect(() => {
    if (!event?.startOTP?.sentAt || event?.startOTP?.isVerified) {
      setStartOtpRemainingMs(null)
      return
    }

    const tick = () => setStartOtpRemainingMs(computeRemainingMs(event.startOTP.sentAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [event?.startOTP?.sentAt, event?.startOTP?.isVerified])

  useEffect(() => {
    if (!event?.closingOTP?.sentAt || event?.closingOTP?.isVerified) {
      setClosingOtpRemainingMs(null)
      return
    }

    const tick = () => setClosingOtpRemainingMs(computeRemainingMs(event.closingOTP.sentAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [event?.closingOTP?.sentAt, event?.closingOTP?.isVerified])

  const fetchEventDetails = async () => {
    if (!resolvedEventId) {
      toast.error('Invalid event link')
      setLoading(false)
      navigate('/')
      return
    }
    try {
      const data = await eventAPI.getEventById(resolvedEventId)
      setEvent(data.event)
    } catch (error) {
      toast.error('Failed to load event details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    const ok = window.confirm(`Delete "${event?.eventName || 'this event'}"? This cannot be undone.`)
    if (!ok) return

    try {
      await eventAPI.deleteEvent(resolvedEventId)
      toast.success('Event deleted')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  // Check-in Handler
  const handleCheckIn = async () => {
    if (!resolvedEventId) {
      toast.error('Invalid event link')
      return
    }
    if (!checkInPhoto) {
      toast.error('Please select a photo')
      return
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setCheckInLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const formData = new FormData()
          formData.append('arrivalPhoto', checkInPhoto)
          formData.append('latitude', position.coords.latitude)
          formData.append('longitude', position.coords.longitude)

          const data = await eventAPI.checkIn(resolvedEventId, formData)
          setEvent(prevEvent => ({
            ...prevEvent,
            ...data.event,
            checkIn: data.event.checkIn,
            status: data.event.status
          }))
          toast.success('Check-in successful!')
          setCheckInPhoto(null)
        } catch (error) {
          toast.error(error.response?.data?.message || 'Check-in failed')
        } finally {
          setCheckInLoading(false)
        }
      },
      (error) => {
        toast.error('Unable to get your location')
        setCheckInLoading(false)
      }
    )
  }

  // Start OTP Handlers
  const handleTriggerStartOTP = async (mode = 'send') => {
    try {
      const data = await eventAPI.triggerStartOTP(resolvedEventId)
      setEvent(prevEvent => ({
        ...prevEvent,
        ...data.event,
        startOTP: data.event.startOTP
      }))
      toast.info(mode === 'resend' ? 'Start OTP resent to customer email' : 'OTP sent to customer email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to trigger OTP')
    }
  }

  const handleVerifyStartOTP = async () => {
    if (startOtpRemainingMs !== null && startOtpRemainingMs <= 0) {
      toast.error('OTP expired. Please resend a new OTP.')
      return
    }
    if (!startOtpInput || startOtpInput.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      const data = await eventAPI.verifyStartOTP(resolvedEventId, startOtpInput)
      setEvent(prevEvent => ({
        ...prevEvent,
        ...data.event,
        startOTP: data.event.startOTP,
        status: data.event.status
      }))
      toast.success('Start OTP verified! Event started.')
      setStartOtpInput('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    }
  }

  // Setup Photos Handlers
  const handleUploadSetupPhotos = async (type) => {
    const photos = type === 'pre' ? prePhotos : postPhotos
    const notes = type === 'pre' ? preNotes : postNotes

    if (photos.length === 0) {
      toast.error('Please select at least one photo')
      return
    }

    try {
      const formData = new FormData()
      photos.forEach(photo => formData.append('photos', photo))
      formData.append('type', type)
      if (notes) formData.append('notes', notes)

      const data = await eventAPI.uploadSetupPhotos(resolvedEventId, formData)
      setEvent(prevEvent => ({
        ...prevEvent,
        ...data.event,
        eventSetup: data.event.eventSetup,
        status: data.event.status
      }))
      toast.success(`${type === 'pre' ? 'Pre' : 'Post'}-event photos uploaded successfully!`)
      
      if (type === 'pre') {
        setPrePhotos([])
        setPreNotes('')
      } else {
        setPostPhotos([])
        setPostNotes('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  }

  // Closing OTP Handlers
  const handleTriggerClosingOTP = async (mode = 'send') => {
    try {
      const data = await eventAPI.triggerClosingOTP(resolvedEventId)
      setEvent(prevEvent => ({
        ...prevEvent,
        ...data.event,
        closingOTP: data.event.closingOTP
      }))
      toast.info(mode === 'resend' ? 'Closing OTP resent to customer email' : 'Closing OTP sent to customer email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to trigger closing OTP')
    }
  }

  const handleVerifyClosingOTP = async () => {
    if (closingOtpRemainingMs !== null && closingOtpRemainingMs <= 0) {
      toast.error('OTP expired. Please resend a new OTP.')
      return
    }
    if (!closingOtpInput || closingOtpInput.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      const data = await eventAPI.verifyClosingOTP(resolvedEventId, closingOtpInput)
      setEvent(prevEvent => ({
        ...prevEvent,
        ...data.event,
        closingOTP: data.event.closingOTP,
        status: data.event.status
      }))
      toast.success('🎉 Event completed successfully!')
      setClosingOtpInput('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">Loading event details...</div>
    )
  }

  if (!event) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="event-details-container">
      {/* Event Header */}
      <div className="event-details-header">
        <div>
          <h1>{event.eventName}</h1>
          <p className="event-meta">
            📅 {formatDate(event.eventDate)} | 📍 {event.location}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="status-badge-large" style={{ backgroundColor: getStatusColor(event.status) }}>
            {event.status}
          </div>
          <button className="btn btn-danger" onClick={handleDeleteEvent}>
            Delete Event
          </button>
        </div>
      </div>

        {/* Event Info Card */}
        <div className="info-card">
          <h3>Customer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span>{event.customerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span>{event.customerEmail}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span>{event.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="workflow-tabs">
          <button 
            className={activeSection === 'checkin' ? 'active' : ''}
            onClick={() => setActiveSection('checkin')}
          >
            {event.checkIn.timestamp ? '✅' : '1.'} Check-In
          </button>
          <button 
            className={activeSection === 'start-otp' ? 'active' : ''}
            onClick={() => setActiveSection('start-otp')}
            disabled={!event.checkIn?.timestamp}
          >
            {event.startOTP?.isVerified ? '✅' : '2.'} Start OTP
          </button>
          <button 
            className={activeSection === 'setup' ? 'active' : ''}
            onClick={() => setActiveSection('setup')}
            disabled={!event.startOTP?.isVerified}
          >
            3. Event Setup
          </button>
          <button 
            className={activeSection === 'closing' ? 'active' : ''}
            onClick={() => setActiveSection('closing')}
            disabled={event.status !== 'in-progress'}
          >
            {event.closingOTP?.isVerified ? '✅' : '4.'} Close Event
          </button>
        </div>

        {/* Workflow Content */}
        <div className="workflow-content">
          {/* Check-In Section */}
          {activeSection === 'checkin' && (
            <div className="workflow-section">
              <h2>Vendor Check-In</h2>
              {event.checkIn?.timestamp ? (
                <div className="completed-section">
                  <div className="success-icon">✅</div>
                  <h3>Check-in Completed</h3>
                  <div className="checkin-details">
                    <img src={event.checkIn.arrivalPhoto} alt="Check-in" className="checkin-photo" />
                    <div className="checkin-info">
                      <p><strong>Time:</strong> {formatDate(event.checkIn.timestamp)}</p>
                      <p><strong>Location:</strong> {event.checkIn.location?.latitude}, {event.checkIn.location?.longitude}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="action-section">
                  <p>Upload a photo and capture your location to check-in to the event</p>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCheckInPhoto(e.target.files[0])}
                      id="checkin-photo"
                    />
                    <label htmlFor="checkin-photo" className="file-label">
                      {checkInPhoto ? checkInPhoto.name : 'Choose Photo'}
                    </label>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleCheckIn}
                    disabled={checkInLoading || !checkInPhoto}
                  >
                    {checkInLoading ? 'Checking in...' : 'Check In with Location'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Start OTP Section */}
          {activeSection === 'start-otp' && (
            <div className="workflow-section">
              <h2>Start Event OTP Verification</h2>
              {event.startOTP?.isVerified ? (
                <div className="completed-section">
                  <div className="success-icon">✅</div>
                  <h3>Event Started</h3>
                  <p>Verified at: {formatDate(event.startOTP.verifiedAt)}</p>
                </div>
              ) : (
                <div className="action-section">
                  <p>Send an OTP to the customer to confirm event start</p>
                  {!event.startOTP?.sentAt ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleTriggerStartOTP('send')}
                    >
                      Send Start OTP to Customer
                    </button>
                  ) : (
                    <div className="otp-verify-section">
                      <p className="otp-sent">OTP sent to {event.customerEmail}</p>
                      <div className="otp-timer-row">
                        <span className="otp-timer">
                          {startOtpRemainingMs !== null && startOtpRemainingMs > 0
                            ? `Expires in ${formatRemaining(startOtpRemainingMs)}`
                            : 'OTP expired — resend to get a new code'}
                        </span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleTriggerStartOTP('resend')}
                        >
                          Resend OTP
                        </button>
                      </div>
                      <p className="otp-display">Check the customer's email for the code</p>
                      <div className="otp-input-group">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={startOtpInput}
                          onChange={(e) => setStartOtpInput(e.target.value)}
                          maxLength="6"
                        />
                        <button 
                          className="btn btn-primary"
                          onClick={handleVerifyStartOTP}
                          disabled={startOtpRemainingMs !== null && startOtpRemainingMs <= 0}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Event Setup Section */}
          {activeSection === 'setup' && (
            <div className="workflow-section">
              <h2>Event Setup Progress</h2>
              
              {/* Pre-Event Photos */}
              <div className="setup-subsection">
                <h3>Pre-Event Setup Photos</h3>
                {(event.eventSetup?.preSetupPhotos?.length || 0) > 0 ? (
                  <div className="photos-grid">
                    {event.eventSetup.preSetupPhotos.map((photo, index) => (
                      <img key={index} src={photo.url} alt={`Pre-setup ${index + 1}`} className="setup-photo" />
                    ))}
                  </div>
                ) : (
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setPrePhotos(Array.from(e.target.files))}
                      id="pre-photos"
                    />
                    <label htmlFor="pre-photos" className="file-label">
                      {prePhotos.length > 0 ? `${prePhotos.length} photos selected` : 'Choose Photos'}
                    </label>
                    <textarea
                      placeholder="Add notes (optional)"
                      value={preNotes}
                      onChange={(e) => setPreNotes(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleUploadSetupPhotos('pre')}
                      disabled={prePhotos.length === 0}
                    >
                      Upload Pre-Event Photos
                    </button>
                  </div>
                )}
              </div>

              {/* Post-Event Photos */}
              <div className="setup-subsection">
                <h3>Post-Event Setup Photos</h3>
                {(event.eventSetup?.postSetupPhotos?.length || 0) > 0 ? (
                  <div className="photos-grid">
                    {event.eventSetup.postSetupPhotos.map((photo, index) => (
                      <img key={index} src={photo.url} alt={`Post-setup ${index + 1}`} className="setup-photo" />
                    ))}
                  </div>
                ) : (
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setPostPhotos(Array.from(e.target.files))}
                      id="post-photos"
                    />
                    <label htmlFor="post-photos" className="file-label">
                      {postPhotos.length > 0 ? `${postPhotos.length} photos selected` : 'Choose Photos'}
                    </label>
                    <textarea
                      placeholder="Add notes (optional)"
                      value={postNotes}
                      onChange={(e) => setPostNotes(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleUploadSetupPhotos('post')}
                      disabled={postPhotos.length === 0}
                    >
                      Upload Post-Event Photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Closing OTP Section */}
          {activeSection === 'closing' && (
            <div className="workflow-section">
              <h2>Close Event with OTP</h2>
              {event.closingOTP?.isVerified ? (
                <div className="completed-section">
                  <div className="success-icon">🎉</div>
                  <h3>Event Completed Successfully!</h3>
                  <p>Closed at: {formatDate(event.closingOTP.verifiedAt)}</p>
                </div>
              ) : (
                <div className="action-section">
                  <p>Send a closing OTP to the customer to confirm event completion</p>
                  {!event.closingOTP?.sentAt ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleTriggerClosingOTP('send')}
                    >
                      Send Closing OTP to Customer
                    </button>
                  ) : (
                    <div className="otp-verify-section">
                      <p className="otp-sent">OTP sent to {event.customerEmail}</p>
                      <div className="otp-timer-row">
                        <span className="otp-timer">
                          {closingOtpRemainingMs !== null && closingOtpRemainingMs > 0
                            ? `Expires in ${formatRemaining(closingOtpRemainingMs)}`
                            : 'OTP expired — resend to get a new code'}
                        </span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleTriggerClosingOTP('resend')}
                        >
                          Resend OTP
                        </button>
                      </div>
                      <p className="otp-display">Check the customer's email for the code</p>
                      <div className="otp-input-group">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={closingOtpInput}
                          onChange={(e) => setClosingOtpInput(e.target.value)}
                          maxLength="6"
                        />
                        <button 
                          className="btn btn-primary"
                          onClick={handleVerifyClosingOTP}
                          disabled={closingOtpRemainingMs !== null && closingOtpRemainingMs <= 0}
                        >
                          Verify & Close Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  )
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

export default EventDetails
