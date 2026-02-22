/**
 * 공통 포맷 유틸
 */

export function formatPrice(n) {
  return Number(n).toLocaleString('ko-KR') + '원'
}

export function formatOrderDate(d) {
  const date = d instanceof Date ? d : new Date(d)
  const m = date.getMonth() + 1
  const day = date.getDate()
  const h = date.getHours()
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${m}월 ${day}일 ${h}:${min}`
}
