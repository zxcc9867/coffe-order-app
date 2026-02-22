import { useState } from 'react'
import Nav from './components/Nav'
import OrderPage from './components/OrderPage'
import './App.css'

function App() {
  const [view, setView] = useState('order')

  return (
    <div className="app">
      <Nav currentView={view} onNavigate={setView} />
      {view === 'order' && <OrderPage />}
      {view === 'admin' && (
        <main className="app-placeholder">
          <p>관리자 화면은 추후 구현 예정입니다.</p>
        </main>
      )}
    </div>
  )
}

export default App
