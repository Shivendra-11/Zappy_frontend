import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Configure axios instance
const api = axios.create({
  baseURL: API_URL
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Event API
export const eventAPI = {
  // Get all events
  getEvents: async () => {
    const response = await api.get('/events')
    return response.data
  },

  // Get single event
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`)
    return response.data
  },

  // Create event
  createEvent: async (data) => {
    const response = await api.post('/events', data)
    return response.data
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`)
    return response.data
  },

  // Vendor check-in
  checkIn: async (eventId, formData) => {
    const response = await api.post(`/events/${eventId}/checkin`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Trigger start OTP
  triggerStartOTP: async (eventId) => {
    const response = await api.post(`/events/${eventId}/start-otp`)
    return response.data
  },

  // Verify start OTP
  verifyStartOTP: async (eventId, otp) => {
    const response = await api.post(`/events/${eventId}/verify-start-otp`, { otp })
    return response.data
  },

  // Upload setup photos
  uploadSetupPhotos: async (eventId, formData) => {
    const response = await api.post(`/events/${eventId}/setup-photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Trigger closing OTP
  triggerClosingOTP: async (eventId) => {
    const response = await api.post(`/events/${eventId}/closing-otp`)
    return response.data
  },

  // Verify closing OTP
  verifyClosingOTP: async (eventId, otp) => {
    const response = await api.post(`/events/${eventId}/verify-closing-otp`, { otp })
    return response.data
  }
}

export default api
