import { useState } from 'react'
import { COFFEE_MENU } from '../data/menu'
import MenuCard from './MenuCard'
import Cart from './Cart'
import './OrderPage.css'

let cartIdSeq = 0

function makeCartKey(name, optionLabels) {
  return name + '|' + optionLabels.slice().sort().join(',')
}

export default function OrderPage({ onPlaceOrder }) {
  const [cartRows, setCartRows] = useState([])

  const addToCart = (payload) => {
    const addQty = Math.max(1, Number(payload.quantity) || 1)
    const key = makeCartKey(payload.name, payload.optionLabels)
    setCartRows((prev) => {
      const existing = prev.find(
        (r) => makeCartKey(r.name, r.optionLabels) === key
      )
      if (existing) {
        return prev.map((r) =>
          r.cartId === existing.cartId
            ? { ...r, quantity: r.quantity + addQty }
            : r
        )
      }
      const unitPrice = payload.basePrice + payload.optionAddPrice
      return [
        ...prev,
        {
          cartId: `cart-${++cartIdSeq}`,
          name: payload.name,
          optionLabels: payload.optionLabels,
          basePrice: payload.basePrice,
          optionAddPrice: payload.optionAddPrice,
          unitPrice,
          quantity: addQty,
        },
      ]
    })
  }

  const handleOrder = () => {
    if (cartRows.length === 0) return
    if (typeof onPlaceOrder === 'function') {
      onPlaceOrder(cartRows)
    }
    setCartRows([])
    alert('주문이 접수되었습니다.')
  }

  return (
    <main className="order-page">
      <section className="order-page__menu">
        <h2 className="order-page__menu-title">메뉴</h2>
        <div className="order-page__menu-grid">
          {COFFEE_MENU.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
      <Cart items={cartRows} onOrder={handleOrder} />
    </main>
  )
}
