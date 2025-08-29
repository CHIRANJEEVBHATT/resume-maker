import React, { useContext, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'

const Login = () => {
  const { login } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" required value={form.password} onChange={handleChange} className="border rounded-md p-2 w-full" />
        </div>
        <button disabled={loading} className="w-full py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm mt-4">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  )
}

export default Login


