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

    if (!formData.location || formData.location.trim().length === 0) {
      toast.error('Please provide event location')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        location: formData.location.trim()
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
          <p className="subtitle">Fill in the details to create a new event for tracking</p>

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
