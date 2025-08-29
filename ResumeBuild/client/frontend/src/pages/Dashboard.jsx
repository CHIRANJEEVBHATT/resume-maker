import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../config/apiPaths'

const Dashboard = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchResumes = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
      setResumes(data || [])
    } catch (err) {
      setError('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResumes() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(id))
      setResumes((prev) => prev.filter(r => r._id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="py-10">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Your Resumes</h1>
        <Link to="/resume/new" className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">Create New</Link>
      </div>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold">{r.personalInfo?.fullName || 'Untitled'}</h3>
              <p className="text-sm text-gray-600">{r.personalInfo?.designation}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200" to={`/resume/${r._id}/edit`}>Edit</Link>
              <button className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(r._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard


