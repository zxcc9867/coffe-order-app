/**
 * 관리자 화면용 상수 (PRD: 재고 현황 메뉴 3개)
 */
import { COFFEE_MENU } from './menu'

export const ADMIN_INVENTORY_MENU_IDS = ['americano-ice', 'americano-hot', 'caffe-latte']

export const getInventoryMenuItems = () =>
  COFFEE_MENU.filter((m) => ADMIN_INVENTORY_MENU_IDS.includes(m.id))

export const getStockStatus = (count) => {
  if (count <= 0) return { label: '품절', type: 'out' }
  if (count < 5) return { label: '주의', type: 'warn' }
  return { label: '정상', type: 'ok' }
}

export const ORDER_STATUS = {
  received: 'received',   // 주문 접수
  making: 'making',       // 제조 중
  done: 'done',          // 제조 완료
}

export const ORDER_STATUS_LABEL = {
  received: '주문 접수',
  making: '제조 중',
  done: '제조 완료',
}
