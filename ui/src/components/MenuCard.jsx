import { useState } from 'react'
import { formatPrice } from '../utils/format'
import './MenuCard.css'

export default function MenuCard({ item, onAddToCart }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState([])
  const [imgError, setImgError] = useState(false)

  const toggleOption = (optionId) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    )
  }

  const handleAdd = () => {
    const selectedOptions = (item.options || []).filter((opt) => selectedOptionIds.includes(opt.id))
    const optionLabels = selectedOptions.map((o) => o.label)
    const optionAddPrice = selectedOptions.reduce((sum, o) => sum + (o.addPrice || 0), 0)
    onAddToCart({
      menuId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      optionLabels,
      optionAddPrice,
      quantity: 1,
    })
  }

  const imageSrc = `/images/${item.id}.png`

  return (
    <article className="menu-card">
      <div className="menu-card__image" aria-hidden>
        {imgError ? (
          <span className="menu-card__image-placeholder">이미지</span>
        ) : (
          <img src={imageSrc} alt="" className="menu-card__img" onError={() => setImgError(true)} />
        )}
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">{formatPrice(item.basePrice)}</p>
      <p className="menu-card__desc">{item.description || ''}</p>
      <div className="menu-card__options">
        {(item.options || []).map((opt) => (
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
      <button type="button" className="menu-card__btn" onClick={handleAdd}>담기</button>
    </article>
  )
}
