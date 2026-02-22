import { ORDER_STATUS_LABEL } from '../../data/admin'
import { formatPrice, formatOrderDate } from '../../utils/format'
import './AdminOrderList.css'

function formatOrderItems(items) {
  return (items || [])
    .map((it) => {
      const opt = it.optionLabels?.length ? ` (${it.optionLabels.join(', ')})` : ''
      return `${it.name}${opt} x ${it.quantity}`
    })
    .join(', ')
}

export default function AdminOrderList({ orders, onStartMaking, onCompleteOrder }) {
  const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <section className="admin-orders">
      <h2 className="admin-orders__title">주문 현황</h2>
      {sortedOrders.length === 0 ? (
        <p className="admin-orders__empty">접수된 주문이 없습니다.</p>
      ) : (
        <ul className="admin-orders__list">
          {sortedOrders.map((order) => (
            <li key={order.id} className="admin-orders__item">
              <div className="admin-orders__item-main">
                <span className="admin-orders__item-date">{formatOrderDate(order.createdAt)}</span>
                <span className="admin-orders__item-menus">{formatOrderItems(order.items)}</span>
                <span className="admin-orders__item-price">{formatPrice(order.total)}</span>
                <span className="admin-orders__item-status">{ORDER_STATUS_LABEL[order.status] || order.status}</span>
              </div>
              {order.status === 'received' && (
                <button type="button" className="admin-orders__btn" onClick={() => onStartMaking(order.id)}>제조 시작</button>
              )}
              {order.status === 'making' && onCompleteOrder && (
                <button type="button" className="admin-orders__btn admin-orders__btn--complete" onClick={() => onCompleteOrder(order.id)}>제조 완료</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
