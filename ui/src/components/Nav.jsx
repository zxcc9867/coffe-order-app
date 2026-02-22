import './Nav.css'

export default function Nav({ currentView, onNavigate }) {
  return (
    <header className="nav">
      <div className="nav-brand">COZY</div>
      <nav className="nav-tabs">
        <button
          type="button"
          className={`nav-tab ${currentView === 'order' ? 'nav-tab--active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`nav-tab ${currentView === 'admin' ? 'nav-tab--active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}
