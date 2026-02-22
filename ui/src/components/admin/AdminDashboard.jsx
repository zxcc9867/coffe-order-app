import './AdminDashboard.css'

const ITEMS = [
  { key: 'total', label: '총 주문' },
  { key: 'received', label: '주문 접수' },
  { key: 'making', label: '제조 중' },
  { key: 'done', label: '제조 완료' },
]

export default function AdminDashboard({ total, received, making, done }) {
  const counts = { total, received, making, done }

  return (
    <section className="admin-dashboard">
      <h2 className="admin-dashboard__title">관리자 대시보드</h2>
      <div className="admin-dashboard__grid">
        {ITEMS.map(({ key, label }) => (
          <div key={key} className="admin-dashboard__card">
            <span className="admin-dashboard__card-label">{label}</span>
            <span className="admin-dashboard__card-value">{counts[key]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
