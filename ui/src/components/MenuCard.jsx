import { useState } from 'react'
import { formatPrice } from '../utils/format'
import './MenuCard.css'

const MIN_QTY = 1
const MAX_QTY = 99

export default function MenuCard({ item, onAddToCart }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState([])
  const [quantity, setQuantity] = useState(1)

  const toggleOption = (optionId) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    )
  }

  const increaseQty = () => {
    setQuantity((q) => (q >= MAX_QTY ? MAX_QTY : q + 1))
  }

  const decreaseQty = () => {
    setQuantity((q) => (q <= MIN_QTY ? MIN_QTY : q - 1))
  }

  const handleAdd = () => {
    const selectedOptions = item.options.filter((opt) =>
      selectedOptionIds.includes(opt.id)
    )
    const optionLabels = selectedOptions.map((o) => o.label)
    const optionAddPrice = selectedOptions.reduce((sum, o) => sum + o.addPrice, 0)
    onAddToCart({
      menuId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      optionLabels,
      optionAddPrice,
      quantity,
    })
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image" aria-hidden>
        <span className="menu-card__image-placeholder">이미지</span>
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">
        {formatPrice(item.basePrice)}
      </p>
      <p className="menu-card__desc">{item.description}</p>
      <div className="menu-card__options">
        {item.options.map((opt) => (
          <label key={opt.id} className="menu-card__option">
            <input
              type="checkbox"
              checked={selectedOptionIds.includes(opt.id)}
              onChange={() => toggleOption(opt.id)}
            />
            <span>
              {opt.label} ({opt.addPrice > 0 ? `+${formatPrice(opt.addPrice)}` : '+0원'})
            </span>
          </label>
        ))}
      </div>
      <div className="menu-card__qty">
        <span className="menu-card__qty-label">수량</span>
        <div className="menu-card__qty-control">
          <button
            type="button"
            className="menu-card__qty-btn"
            onClick={increaseQty}
            disabled={quantity >= MAX_QTY}
            aria-label="수량 늘리기"
          >
            ▲
          </button>
          <span className="menu-card__qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="menu-card__qty-btn"
            onClick={decreaseQty}
            disabled={quantity <= MIN_QTY}
            aria-label="수량 줄이기"
          >
            ▼
          </button>
        </div>
      </div>
      <button type="button" className="menu-card__btn" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}
