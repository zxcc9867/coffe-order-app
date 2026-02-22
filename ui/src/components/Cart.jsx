import { formatPrice } from '../utils/format'
import './Cart.css'

const MIN_QTY = 1
const MAX_QTY = 99

export default function Cart({ items, onOrder, onQuantityChange }) {
  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
  return (
    <section className="cart">
      <h2 className="cart__title">장바구니</h2>
      {items.length === 0 ? (
        <p className="cart__empty">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="cart__list">
            {items.map((it) => (
              <li key={it.cartId} className="cart__item">
                <span className="cart__item-label">
                  {it.name}
                  {it.optionLabels?.length > 0 && ` (${it.optionLabels.join(', ')})`}
                </span>
                <div className="cart__item-qty">
                  <button
                    type="button"
                    className="cart__qty-btn"
                    onClick={() => onQuantityChange?.(it.cartId, -1)}
                    disabled={it.quantity <= MIN_QTY}
                    aria-label="수량 줄이기"
                  >
                    −
                  </button>
                  <span className="cart__qty-value" aria-live="polite">{it.quantity}</span>
                  <button
                    type="button"
                    className="cart__qty-btn"
                    onClick={() => onQuantityChange?.(it.cartId, 1)}
                    disabled={it.quantity >= MAX_QTY}
                    aria-label="수량 늘리기"
                  >
                    +
                  </button>
                </div>
                <span className="cart__item-price">{formatPrice(it.unitPrice * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="cart__total">
            <span className="cart__total-label">총 금액</span>
            <strong className="cart__total-value">{formatPrice(total)}</strong>
          </div>
          <button type="button" className="cart__order-btn" onClick={onOrder}>주문하기</button>
        </>
      )}
    </section>
  )
}
