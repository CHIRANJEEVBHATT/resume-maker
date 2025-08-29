import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../config/apiPaths'
import { UserContext } from '../context/UserContext.jsx'

const Profile = () => {
  const { user, updateUser, fetchProfile } = useContext(UserContext)
  const [form, setForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' })
    }
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await updateUser(form)
      setMessage('Profile updated')
      await fetchProfile()
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      {message && <div className="mb-3 text-sm">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <button disabled={saving} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default Profile


