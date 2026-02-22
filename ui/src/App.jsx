import { useState, useCallback } from 'react'
import { ORDER_STATUS } from './data/admin'
import Nav from './components/Nav'
import OrderPage from './components/OrderPage'
import AdminPage from './components/AdminPage'
import './App.css'

const INITIAL_STOCK = {
  'americano-ice': 10,
  'americano-hot': 10,
  'caffe-latte': 10,
}

let orderIdSeq = 0

function App() {
  const [view, setView] = useState('order')
  const [orders, setOrders] = useState([])
  const [stock, setStock] = useState(INITIAL_STOCK)

  const onPlaceOrder = useCallback((items) => {
    const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
    setOrders((prev) => [
      ...prev,
      {
        id: `order-${++orderIdSeq}`,
        createdAt: new Date().toISOString(),
        items: items.map(({ name, optionLabels, quantity, unitPrice }) => ({
          name,
          optionLabels: optionLabels || [],
          quantity,
          unitPrice,
        })),
        total,
        status: ORDER_STATUS.received,
      },
    ])
  }, [])

  const onUpdateStock = useCallback((menuId, count) => {
    setStock((prev) => ({ ...prev, [menuId]: Math.max(0, count) }))
  }, [])

  const onStartMaking = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: ORDER_STATUS.making } : o
      )
    )
  }, [])

  return (
    <div className="app">
      <Nav currentView={view} onNavigate={setView} />
      {view === 'order' && <OrderPage onPlaceOrder={onPlaceOrder} />}
      {view === 'admin' && (
        <AdminPage
          orders={orders}
          stock={stock}
          onUpdateStock={onUpdateStock}
          onStartMaking={onStartMaking}
        />
      )}
    </div>
  )
}

export default App
