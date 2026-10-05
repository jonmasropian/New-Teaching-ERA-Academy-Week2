import { useState, useEffect } from 'react'
import { BASE_URL } from '../api/config'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateTicketPage({ currentUser, setCurrentView }) {
  const [departments, setDepartments] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [departmentId, setDepartmentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingDepts, setFetchingDepts] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [newTicketId, setNewTicketId] = useState(null)

  useEffect(() => {
    async function fetchDepartments() {
      setFetchingDepts(true)
      try {
        const response = await fetch(BASE_URL + '/departments')
        if (!response.ok) throw new Error('Failed to fetch departments.')
        const data = await response.json()
        setDepartments(data)
      } catch (err) {
        setError(err.message || 'Failed to load departments.')
      } finally {
        setFetchingDepts(false)
      }
    }

    fetchDepartments()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(BASE_URL + '/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: description,
          priority: priority,
          status: 'open',
          submitted_by: currentUser.id || 1,
          department_id: parseInt(departmentId),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit ticket.')
        return
      }

      setSuccess(true)
      setNewTicketId(data.ticketId)
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDepartmentId('')
    } catch (err) {
      setError(err.message || 'Failed to submit ticket.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmitAnother() {
    setSuccess(false)
    setNewTicketId(null)
    setError('')
  }

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mt-1'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Submit a Support Ticket</h1>
      <span className="text-xs text-slate-400 italic mt-1 block">
        🗄️ Ticket will be saved to MySQL
      </span>

      {success ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
          <p className="text-green-700 font-semibold text-lg">
            ✅ Ticket submitted successfully!
          </p>
          <p className="text-slate-500 mt-1">Ticket ID: #{newTicketId}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmitAnother}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm"
            >
              Submit Another Ticket
            </button>
            <button
              onClick={() => setCurrentView('tickets')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              View All Tickets
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
          {fetchingDepts ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <select
                  required
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={inputClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>
                <select
                  required
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
