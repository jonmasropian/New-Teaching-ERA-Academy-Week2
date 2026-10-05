import { useState } from 'react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import CreateTicketPage from './pages/CreateTicketPage'

export default function App() {
  const [currentView, setCurrentView] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView !== 'login' && (
        <Navbar
          currentUser={currentUser}
          setCurrentView={setCurrentView}
          setCurrentUser={setCurrentUser}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          setCurrentView={setCurrentView}
          setCurrentUser={setCurrentUser}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardPage
          currentUser={currentUser}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'tickets' && (
        <TicketsPage
          currentUser={currentUser}
          setCurrentView={setCurrentView}
          setSelectedTicketId={setSelectedTicketId}
        />
      )}

      {currentView === 'ticket-detail' && (
        <TicketDetailPage
          selectedTicketId={selectedTicketId}
          currentUser={currentUser}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'create-ticket' && (
        <CreateTicketPage
          currentUser={currentUser}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  )
}
