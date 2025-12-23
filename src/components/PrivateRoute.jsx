import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { vendor, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return vendor ? children : <Navigate to="/login" />
}

export default PrivateRoute
