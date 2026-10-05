import { useState, useEffect } from 'react'
import { BASE_URL } from '../api/config'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'

export default function TicketsPage({ currentUser, setCurrentView, setSelectedTicketId }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(BASE_URL + '/tickets')
        if (!response.ok) throw new Error('Failed to fetch tickets.')
        const data = await response.json()
        setTickets(data)
      } catch (err) {
        setError(err.message || 'Failed to load tickets.')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ]

  const filteredTickets =
    filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  function truncateTitle(title) {
    if (!title) return ''
    return title.length > 40 ? title.slice(0, 40) + '...' : title
  }

  function handleViewDetails(ticketId) {
    setSelectedTicketId(ticketId)
    setCurrentView('ticket-detail')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Support Tickets</h1>
          <span className="text-xs text-slate-400 italic block mt-1">
            🗄️ Data from MySQL
          </span>
        </div>
        <span className="text-sm text-slate-500">{tickets.length} tickets</span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={
              filter === opt.value
                ? 'bg-blue-600 text-white px-3 py-1 rounded text-sm'
                : 'border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50'
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Title', 'Priority', 'Status', 'Department', 'Created', 'Action'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-slate-400 text-center py-8 text-sm">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {ticket.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {truncateTitle(ticket.title)}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {ticket.department_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(ticket.id)}
                        className="text-blue-600 text-sm hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
