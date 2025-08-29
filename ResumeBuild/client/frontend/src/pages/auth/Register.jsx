import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'

const Register = () => {
  const { register, login } = useContext(UserContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      await login({ email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" required value={form.password} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <button disabled={loading} className="w-full py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-sm mt-4">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
    </div>
  )
}

export default Register


