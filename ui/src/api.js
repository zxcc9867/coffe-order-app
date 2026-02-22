const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!res.ok) {
    const err = new Error(res.statusText || 'Request failed')
    err.status = res.status
    try {
      err.body = await res.json()
    } catch (_) {}
    throw err
  }
  return res.json()
}

export const api = {
  getMenus: () => request('/api/menus'),
  getOrders: () => request('/api/orders'),
  getOrdersStats: () => request('/api/orders/stats'),
  getStock: () => request('/api/stock'),
  postOrder: (body) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  patchOrderStatus: (orderId, status) =>
    request(`/api/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  patchStock: (menuId, stock) =>
    request('/api/stock', { method: 'PATCH', body: JSON.stringify({ menuId, stock }) }),
}
