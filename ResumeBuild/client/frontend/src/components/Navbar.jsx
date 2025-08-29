import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext.jsx'

const Navbar = () => {
  const { user, logout } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">Resume Builder</Link>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link className="px-4 py-2 text-sm rounded-md hover:bg-gray-100" to="/login">Login</Link>
              <Link className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800" to="/register">Register</Link>
            </>
          )}
          {user && (
            <>
              <Link className="px-3 py-2 text-sm rounded-md hover:bg-gray-100" to="/dashboard">Dashboard</Link>
              <Link className="px-3 py-2 text-sm rounded-md hover:bg-gray-100" to="/profile">{user?.name || 'Profile'}</Link>
              <button onClick={handleLogout} className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar


