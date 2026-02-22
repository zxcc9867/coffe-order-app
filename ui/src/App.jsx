import { useState } from 'react'
import Nav from './components/Nav'
import OrderPage from './components/OrderPage'
import AdminPage from './components/admin/AdminPage'
import './App.css'

function App() {
  const [view, setView] = useState('order')

  return (
    <div className="app">
      <Nav currentView={view} onNavigate={setView} />
      <main className="app__main">
        {view === 'order' ? <OrderPage /> : <AdminPage />}
      </main>
    </div>
  )
}

export default App
