import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EventDetails from './pages/EventDetails'

// Components
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const { vendor, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
       <div>
        <h2>Please wait...</h2>
       </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        {vendor && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={vendor ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={vendor ? <Navigate to="/" /> : <Register />} 
          />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <PrivateRoute>
                <EventDetails />
              </PrivateRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

export default App
