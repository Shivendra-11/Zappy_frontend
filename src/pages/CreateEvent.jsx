import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventAPI } from '../api/api'
import { toast } from 'react-toastify'
import './CreateEvent.css'

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const eventName = formData.eventName.trim()
    const location = formData.location.trim()
    const customerName = formData.customerName.trim()
    const customerEmail = formData.customerEmail.trim()
    const customerPhone = formData.customerPhone.trim()

    if (eventName.length < 2) {
      toast.error('Event name must be at least 2 characters')
      return
    }
    if (!formData.eventDate) {
      toast.error('Please select event date')
      return
    }
    if (!location) {
      toast.error('Please provide event location')
      return
    }
    if (customerName.length < 2) {
      toast.error('Customer name must be at least 2 characters')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    if (!emailOk) {
      toast.error('Please provide a valid customer email')
      return
    }
    const phoneOk = /^[0-9+() -]{7,20}$/.test(customerPhone)
    if (!phoneOk) {
      toast.error('Please provide a valid customer phone (7-20 digits/characters)')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        eventName,
        eventDate: formData.eventDate,
        location,
        customerName,
        customerEmail,
        customerPhone
      }
      const data = await eventAPI.createEvent(payload)
      toast.success('Event created successfully!')
      navigate(`/event/${data.event._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="create-event-container">
        <div className="create-event-box">
          <h1>Create New Event</h1>
          <p className="subtitle">Fill in the details to creates a new event for tracking</p>

          <form onSubmit={handleSubmit} className="create-event-form">
            <div className="form-section">
              <h3>Event Information</h3>
              
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="e.g., Wedding Reception, Birthday Party"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Event venue address"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={200}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Customer Information</h3>
              
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full name of the customer"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Customer Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="customer@example.com"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div className="form-group">
                  <label>Customer Phone *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    placeholder="Customer phone number"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    minLength={7}
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateEvent
