import { useState } from 'react'
import { BASE_URL } from '../api/config'

export default function LoginPage({ setCurrentView, setCurrentUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(BASE_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.')
        return
      }

      setCurrentUser({
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        id: data.user_id,
      })
      setCurrentView('dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-sm shadow-sm">
        <p className="text-4xl text-center">🖥️</p>
        <h1 className="text-xl font-bold text-slate-800 text-center mt-2">
          ERA Tech Solutions
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">Help Desk Portal</p>

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mt-1 mb-4"
          />

          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mt-1 mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
