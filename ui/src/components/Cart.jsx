import { formatPrice } from '../utils/format'
import './Cart.css'

export default function Cart({ items, onOrder }) {
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
                  {it.optionLabels?.length > 0 && ` (${it.optionLabels.join(', ')})`} X {it.quantity}
                </span>
                <span className="cart__item-price">
                  {formatPrice(it.unitPrice * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="cart__total">
            <span className="cart__total-label">총 금액</span>
            <strong className="cart__total-value">{formatPrice(total)}</strong>
          </div>
          <button type="button" className="cart__order-btn" onClick={onOrder}>
            주문하기
          </button>
        </>
      )}
    </section>
  )
}
