import { useState, useEffect } from 'react'
import { BASE_URL } from '../api/config'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'

export default function TicketDetailPage({ selectedTicketId, currentUser, setCurrentView }) {
  const [ticket, setTicket] = useState(null)
  const [notes, setNotes] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [noteText, setNoteText] = useState('')
  const [addedBy, setAddedBy] = useState(currentUser?.first_name || '')
  const [submitting, setSubmitting] = useState(false)
  const [noteError, setNoteError] = useState('')
  const [noteSuccess, setNoteSuccess] = useState('')

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        const [ticketRes, notesRes, logsRes] = await Promise.all([
          fetch(BASE_URL + '/tickets/' + selectedTicketId + "/details"),
          fetch(BASE_URL + '/ticket-notes/' + selectedTicketId),
          fetch(BASE_URL + '/activity-logs'),
        ])

        if (!ticketRes.ok) throw new Error('Failed to fetch ticket.')
        if (!notesRes.ok) throw new Error('Failed to fetch notes.')
        if (!logsRes.ok) throw new Error('Failed to fetch activity logs.')

        const ticketData = await ticketRes.json()
        const notesData = await notesRes.json()
        const logsData = await logsRes.json()

        setTicket(ticketData)
        setNotes(notesData)

        const filtered = logsData.filter(
          (log) => Number(log.ticket_id) === Number(selectedTicketId)
        )
        setLogs(filtered)
      } catch (err) {
        setError(err.message || 'Failed to load ticket details.')
      } finally {
        setLoading(false)
      }
    }

    if (selectedTicketId) fetchAll()
  }, [selectedTicketId])

  async function fetchNotes() {
    try {
      const response = await fetch(BASE_URL + '/ticket-notes/' + selectedTicketId)
      if (!response.ok) throw new Error('Failed to fetch notes.')
      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setNoteError('Failed to refresh notes.')
    }
  }

  async function handleAddNote(e) {
    e.preventDefault()
    setSubmitting(true)
    setNoteError('')
    setNoteSuccess('')

    try {
      const response = await fetch(BASE_URL + '/ticket-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: selectedTicketId,
          note: noteText,
          added_by: addedBy,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNoteError(data.error || 'Failed to add note.')
        return
      }

      await fetchNotes()
      setNoteText('')
      setNoteSuccess('Note added successfully!')
      setTimeout(() => setNoteSuccess(''), 3000)
    } catch (err) {
      setNoteError(err.message || 'Failed to add note.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('tickets')}
        className="text-blue-600 hover:underline text-sm cursor-pointer mb-6 block"
      >
        ← Back to All Tickets
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : !ticket ? (
        <p className="text-slate-400 text-sm">Ticket not found.</p>
      ) : (
        <>
          {/* SECTION 1 — Ticket Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">{ticket.title}</h1>
                <p className="text-sm text-slate-400 mt-1">Ticket #{ticket.ticket_id}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            <p className="text-xs text-slate-400 italic mb-4">
              🗄️ Ticket data stored in MySQL
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Description
                </p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  {ticket.description}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Department
                </p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  {ticket.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Submitted By
                </p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  {ticket.submitted_by}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Assigned To
                </p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  {ticket.assigned_to ||'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Created
                </p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Technician Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <h2 className="font-semibold text-slate-800">Technician Notes</h2>
              <span className="text-xs text-slate-400 italic ml-2">
                📦 Notes stored in MongoDB
              </span>
            </div>

            {notes.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No notes added yet.</p>
            ) : (
              <div>
                {notes.map((note, index) => (
                  <div
                    key={note._id || index}
                    className="bg-gray-50 rounded p-3 mb-3"
                  >
                    <p className="text-sm text-slate-700">{note.note}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Added by {note.added_by} ·{' '}
                      {new Date(note.created_at || note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Note Form */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Add a Note</p>
              <form onSubmit={handleAddNote}>
                <textarea
                  rows={3}
                  placeholder="Type your technician note here..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="mt-2">
                  <label className="text-xs text-slate-500">Added by</label>
                  <input
                    type="text"
                    value={addedBy}
                    onChange={(e) => setAddedBy(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Note'}
                </button>
                {noteSuccess && (
                  <p className="text-green-600 text-sm mt-2">{noteSuccess}</p>
                )}
                {noteError && (
                  <p className="text-red-600 text-sm mt-2">{noteError}</p>
                )}
              </form>
            </div>
          </div>

          {/* SECTION 3 — Activity Log */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <h2 className="font-semibold text-slate-800">Activity Log</h2>
              <span className="text-xs text-slate-400 italic ml-2">
                📦 Activity data stored in MongoDB
              </span>
            </div>

            {logs.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">
                No activity recorded for this ticket.
              </p>
            ) : (
              <ul>
                {logs.map((log, index) => (
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
