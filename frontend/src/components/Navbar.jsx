export default function Navbar({ currentUser, setCurrentView, setCurrentUser }) {
  function handleLogout() {
    setCurrentUser(null)
    setCurrentView('login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 h-16 flex items-center px-6 w-full">
      <div className="flex items-center gap-3">
        <span className="text-white font-bold text-lg">ERA Tech Solutions</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 text-sm">Help Desk</span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {currentUser && (
          <span className="text-white text-sm">
            {currentUser.first_name} {currentUser.last_name}
          </span>
        )}

        {currentUser && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              currentUser.role === 'it_staff'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-600 text-white'
            }`}
          >
            {currentUser.role === 'it_staff' ? 'IT Staff' : 'Employee'}
          </span>
        )}

        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-slate-300 hover:text-white text-sm px-3"
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('tickets')}
          className="text-slate-300 hover:text-white text-sm px-3"
        >
          All Tickets
        </button>
        <button
          onClick={() => setCurrentView('create-ticket')}
          className="text-slate-300 hover:text-white text-sm px-3"
        >
          Submit Ticket
        </button>

        <button
          onClick={handleLogout}
          className="border border-slate-500 text-slate-300 rounded px-3 py-1 text-sm hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
