import { ORDER_STATUS } from '../data/admin'
import AdminDashboard from './admin/AdminDashboard'
import AdminInventory from './admin/AdminInventory'
import AdminOrderList from './admin/AdminOrderList'
import './AdminPage.css'

export default function AdminPage({
  orders,
  stock,
  onUpdateStock,
  onStartMaking,
}) {
  const total = orders.length
  const received = orders.filter((o) => o.status === ORDER_STATUS.received).length
  const making = orders.filter((o) => o.status === ORDER_STATUS.making).length
  const done = orders.filter((o) => o.status === ORDER_STATUS.done).length

  const handleIncrease = (menuId) => {
    onUpdateStock(menuId, (stock[menuId] ?? 0) + 1)
  }

  const handleDecrease = (menuId) => {
    const current = stock[menuId] ?? 0
    if (current <= 0) return
    onUpdateStock(menuId, current - 1)
  }

  return (
    <main className="admin-page">
      <AdminDashboard
        total={total}
        received={received}
        making={making}
        done={done}
      />
      <AdminInventory
        stock={stock}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />
      <AdminOrderList orders={orders} onStartMaking={onStartMaking} />
    </main>
  )
}
