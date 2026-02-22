/**
 * 커피 메뉴 데이터 (PRD 기준 옵션: 샷 추가 +500원, 시럽 추가 +0원)
 */
export const MENU_OPTIONS = [
  { id: 'shot', label: '샷 추가', addPrice: 500 },
  { id: 'syrup', label: '시럽 추가', addPrice: 0 },
]

export const COFFEE_MENU = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    basePrice: 4000,
    description: '에스프레소에 찬물과 얼음을 더한 시원한 아메리카노',
    options: MENU_OPTIONS,
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    basePrice: 4000,
    description: '에스프레소에 뜨거운 물을 더한 클래식 아메리카노',
    options: MENU_OPTIONS,
  },
  {
    id: 'caffe-latte',
    name: '카페라떼',
    basePrice: 5000,
    description: '에스프레소와 스팀 밀크의 조화',
    options: MENU_OPTIONS,
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼',
    basePrice: 5500,
    description: '바닐라 시럽이 들어간 부드러운 라떼',
    options: MENU_OPTIONS,
  },
  {
    id: 'cold-brew',
    name: '콜드브루',
    basePrice: 4500,
    description: '차가운 물로 긴 시간 추출한 깔끔한 커피',
    options: MENU_OPTIONS,
  },
]
