import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-semibold mb-3">Build a beautiful resume in minutes</h1>
      <p className="text-gray-600 mb-6">Create, edit, and download your resume as PDF. Free and simple.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/register" className="px-5 py-3 rounded-md bg-gray-900 text-white hover:bg-gray-800">Get Started</Link>
        <Link to="/login" className="px-5 py-3 rounded-md border border-gray-300 hover:bg-gray-100">Login</Link>
      </div>
    </div>
  )
}

export default LandingPage
