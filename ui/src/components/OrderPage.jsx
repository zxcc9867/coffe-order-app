import { useState, useEffect } from 'react'
import { api } from '../api'
import MenuCard from './MenuCard'
import Cart from './Cart'
import Toast from './Toast'
import './OrderPage.css'

const TOAST_DURATION = 3000
let cartIdSeq = 0

function makeCartKey(name, optionLabels) {
  return name + '|' + (optionLabels || []).slice().sort().join(',')
}

export default function OrderPage() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartRows, setCartRows] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    api.getMenus().then(setMenus).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const t = setTimeout(() => setToastMessage(''), TOAST_DURATION)
    return () => clearTimeout(t)
  }, [toastMessage])

  const addToCart = (payload) => {
    const addQty = Math.max(1, Number(payload.quantity) || 1)
    const key = makeCartKey(payload.name, payload.optionLabels)
    setCartRows((prev) => {
      const existing = prev.find((r) => makeCartKey(r.name, r.optionLabels) === key)
      if (existing) {
        return prev.map((r) =>
          r.cartId === existing.cartId ? { ...r, quantity: r.quantity + addQty } : r
        )
      }
      const unitPrice = payload.basePrice + (payload.optionAddPrice || 0)
      return [
        ...prev,
        {
          cartId: `cart-${++cartIdSeq}`,
          menuId: payload.menuId,
          name: payload.name,
          optionLabels: payload.optionLabels || [],
          basePrice: payload.basePrice,
          optionAddPrice: payload.optionAddPrice || 0,
          unitPrice,
          quantity: addQty,
        },
      ]
    })
  }

  const handleCartQuantityChange = (cartId, delta) => {
    setCartRows((prev) =>
      prev.map((r) => {
        if (r.cartId !== cartId) return r
        const next = r.quantity + delta
        const quantity = Math.max(1, Math.min(99, next))
        return { ...r, quantity }
      })
    )
  }

  const handleOrder = async () => {
    if (cartRows.length === 0) return
    const total = cartRows.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
    try {
      await api.postOrder({
        items: cartRows.map((r) => ({
          menuId: r.menuId,
          name: r.name,
          optionLabels: r.optionLabels,
          quantity: r.quantity,
          unitPrice: r.unitPrice,
        })),
        total,
      })
      setCartRows([])
      setToastMessage('주문이 완료되었습니다.')
    } catch (e) {
      setToastMessage('주문 접수에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  if (loading) return <main className="order-page"><p className="order-page__loading">메뉴를 불러오는 중...</p></main>
  if (error) return <main className="order-page"><p className="order-page__error">메뉴를 불러올 수 없습니다. ({error})</p></main>

  return (
    <main className="order-page">
      <Toast message={toastMessage} visible={!!toastMessage} />
      <section className="order-page__menu">
        <h2 className="order-page__menu-title">메뉴</h2>
        <div className="order-page__menu-grid">
          {menus.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
      <Cart
        items={cartRows}
        onOrder={handleOrder}
        onQuantityChange={handleCartQuantityChange}
      />
    </main>
  )
}
