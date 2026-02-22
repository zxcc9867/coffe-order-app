const ADMIN_MENU_IDS = ['americano-ice', 'americano-hot', 'caffe-latte']

export function getStockStatus(count) {
  if (count <= 0) return { label: '품절', type: 'out' }
  if (count < 5) return { label: '주의', type: 'warn' }
  return { label: '정상', type: 'ok' }
}

export const ORDER_STATUS_LABEL = { received: '주문 접수', making: '제조 중', done: '제조 완료' }

export function getInventoryMenuItems(menus) {
  if (!menus || !Array.isArray(menus)) return []
  return menus.filter((m) => m && ADMIN_MENU_IDS.includes(m.id))
}
