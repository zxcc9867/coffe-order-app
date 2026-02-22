import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'
import AdminDashboard from './AdminDashboard'
import AdminInventory from './AdminInventory'
import AdminOrderList from './AdminOrderList'
import './AdminPage.css'

export default function AdminPage() {
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ total: 0, received: 0, making: 0, done: 0 })
  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const [menusRes, ordersRes, statsRes, stockRes] = await Promise.all([
        api.getMenus(),
        api.getOrders(),
        api.getOrdersStats(),
        api.getStock(),
      ])
      setMenus(Array.isArray(menusRes) ? menusRes : [])
      setOrders(Array.isArray(ordersRes) ? ordersRes : [])
      setStats(statsRes && typeof statsRes === 'object' ? statsRes : { total: 0, received: 0, making: 0, done: 0 })
      setStock(stockRes && typeof stockRes === 'object' ? stockRes : {})
    } catch (e) {
      setError(e.message || '데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleIncrease = async (menuId) => {
    const current = stock[menuId] ?? 0
    try {
      await api.patchStock(menuId, current + 1)
      setStock((prev) => ({ ...prev, [menuId]: current + 1 }))
    } catch (e) {
      setError(e.message || '재고 수정에 실패했습니다.')
    }
  }

  const handleDecrease = async (menuId) => {
    const current = stock[menuId] ?? 0
    if (current <= 0) return
    try {
      await api.patchStock(menuId, current - 1)
      setStock((prev) => ({ ...prev, [menuId]: current - 1 }))
    } catch (e) {
      setError(e.message || '재고 수정에 실패했습니다.')
    }
  }

  const handleStartMaking = async (orderId) => {
    try {
      await api.patchOrderStatus(orderId, 'making')
      await load()
    } catch (e) {
      setError(e.message || '상태 변경에 실패했습니다.')
    }
  }

  const handleCompleteOrder = async (orderId) => {
    try {
      await api.patchOrderStatus(orderId, 'done')
      await load()
    } catch (e) {
      setError(e.message || '상태 변경에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-page__loading">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-page__error">{error}</p>
        <button type="button" className="admin-page__retry" onClick={load}>다시 시도</button>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <AdminDashboard total={stats.total} received={stats.received} making={stats.making} done={stats.done} />
      <AdminInventory
        menus={menus}
        stock={stock}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRefresh={load}
      />
      <AdminOrderList
        orders={orders}
        onStartMaking={handleStartMaking}
        onCompleteOrder={handleCompleteOrder}
      />
    </div>
  )
}
