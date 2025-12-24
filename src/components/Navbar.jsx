import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaChartBar, FaHome, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
  const { vendor, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>🎉 Zappy Vendor Tracker</h1>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-item" title="Dashboard">
            <FaHome size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/create-event" className="navbar-item" title="Create Event">
            <FaPlus size={20} />
            <span>New Event</span>
          </Link>

          <Link to="/analytics" className="navbar-item" title="Analytics Dashboard">
            <FaChartBar size={20} />
            <span>Analytics</span>
          </Link>
          
          <div className="navbar-user">
            <FaUser size={16} />
            <span>{vendor?.name}</span>
          </div>
          
          <button onClick={handleLogout} className="navbar-logout" title="Logout">
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
