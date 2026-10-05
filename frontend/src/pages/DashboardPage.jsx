import { useState, useEffect } from 'react'
import { BASE_URL } from '../api/config'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'

export default function DashboardPage({ currentUser, setCurrentView }) {
  const [tickets, setTickets] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const [ticketsRes, logsRes] = await Promise.all([
          fetch(BASE_URL + '/tickets'),
          fetch(BASE_URL + '/activity-logs'),
        ])

        if (!ticketsRes.ok) throw new Error('Failed to fetch tickets.')
        if (!logsRes.ok) throw new Error('Failed to fetch activity logs.')

        const ticketsData = await ticketsRes.json()
        const logsData = await logsRes.json()

        setTickets(ticketsData)
        setLogs(logsData)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalTickets = tickets.length
  const openCount = tickets.filter((t) => t.status === 'open').length
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length

  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {currentUser?.first_name}!
        </h1>
        <div className="mt-1">
          <span
            className={`text-xs px-2 py-1 rounded ${
              currentUser?.role === 'it_staff'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-600 text-white'
            }`}
          >
            {currentUser?.role === 'it_staff' ? 'IT Staff' : 'Employee'}
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          You are logged into the ERA Tech Solutions Help Desk.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setCurrentView('create-ticket')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit New Ticket
          </button>
          <button
            onClick={() => setCurrentView('tickets')}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm"
          >
            View All Tickets
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600 text-sm mb-6">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-800">{totalTickets}</p>
              <p className="text-sm text-slate-500 mt-1">Total Tickets</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{openCount}</p>
              <p className="text-sm text-slate-500 mt-1">Open</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{inProgressCount}</p>
              <p className="text-sm text-slate-500 mt-1">In Progress</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
              <p className="text-sm text-slate-500 mt-1">Resolved</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <h2 className="font-semibold text-slate-800">Recent Activity</h2>
              <span className="text-xs text-slate-400 italic ml-2">
                📦 Powered by MongoDB
              </span>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No activity yet.
              </p>
            ) : (
              <ul>
                {recentLogs.map((log, index) => (
                  <li
                    key={log._id || index}
                    className="border-b border-gray-100 py-3 last:border-0"
                  >
                    <p className="text-sm font-medium text-slate-700 capitalize">
                      {log.action}
                    </p>
                    {log.details && (
                      <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
