import { getInventoryMenuItems, getStockStatus } from '../../data/admin'
import './AdminInventory.css'

export default function AdminInventory({ stock, onIncrease, onDecrease }) {
  const items = getInventoryMenuItems()

  return (
    <section className="admin-inventory">
      <h2 className="admin-inventory__title">재고 현황</h2>
      <div className="admin-inventory__grid">
        {items.map((menu) => {
          const count = stock[menu.id] ?? 0
          const status = getStockStatus(count)
          return (
            <div key={menu.id} className="admin-inventory__card">
              <h3 className="admin-inventory__card-name">{menu.name}</h3>
              <p className="admin-inventory__card-stock">
                {count}개
              </p>
              <span className={`admin-inventory__card-status admin-inventory__card-status--${status.type}`}>
                {status.label}
              </span>
              <div className="admin-inventory__card-actions">
                <button
                  type="button"
                  className="admin-inventory__btn"
                  onClick={() => onDecrease(menu.id)}
                  disabled={count <= 0}
                  aria-label="재고 줄이기"
                >
                  −
                </button>
                <button
                  type="button"
                  className="admin-inventory__btn"
                  onClick={() => onIncrease(menu.id)}
                  aria-label="재고 늘리기"
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
