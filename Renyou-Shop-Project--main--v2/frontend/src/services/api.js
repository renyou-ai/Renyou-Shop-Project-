const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem('token');
}

async function req(path, options = {}) {
    const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const text = await res.text();

const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function exportCSV(filename, rows, headers) {
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const api = {
  // ── Auth ─────────────────────────────────────────────────────
  login:          (email, password) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me:             ()               => req('/auth/me'),
  changePassword: (data)           => req('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // ── Me / profile ─────────────────────────────────────────────
  updateMe:         (data) => req('/users/me',          { method: 'PUT', body: JSON.stringify(data) }),
  updateMySettings: (data) => req('/users/me/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // ── Store Settings ───────────────────────────────────────────
getStoreSettings: () => req('/settings/store'),

updateStoreSettings: (data) =>
  req('/settings/store', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // ── Dashboard ─────────────────────────────────────────────────
  dashboardStats: ()              => req('/dashboard/stats'),
  revenueChart:   (period='7j')  => req(`/dashboard/revenue-chart?period=${period}`),
  categorySales:  (period='7j')  => req(`/dashboard/category-sales?period=${period}`),
  monthlyTrend:   ()              => req('/dashboard/monthly-trend'),
  recentOrders:   ()              => req('/dashboard/recent-orders'),
  stockAlerts:    ()              => req('/dashboard/stock-alerts'),
  topProducts:    ()              => req('/dashboard/top-products'),
  topCustomers:   ()              => req('/dashboard/top-customers'),

  // ── Products ──────────────────────────────────────────────────
  getProducts:      (params={}) => req('/products?' + new URLSearchParams(params)),
  getPublicProducts: (params = {}) =>
  req('/products/public/list?' + new URLSearchParams(params)),
  getFeaturedProducts: () =>
  req("/products/public/featured"),
  getPublicProduct: (id) => req(`/products/public/${id}`),
  getProductAlerts: ()          => req('/products/alerts'),
  getProductStats:  ()          => req('/products/stats'),
  createProduct:    (data)      => req('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct:    (id, data)  => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct:    (id)        => req(`/products/${id}`, { method: 'DELETE' }),

  // ── Categories ────────────────────────────────────────────────
  getCategories:  (params={}) => req('/categories/public/list?' + new URLSearchParams(params)),
  createCategory: (data)      => req('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data)  => req(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id)        => req(`/categories/${id}`, { method: 'DELETE' }),

  // ── Brands ────────────────────────────────────────────────────
  getBrands:  (params={}) => req('/brands/public/list?' + new URLSearchParams(params)),
  createBrand:(data)      => req('/brands', { method: 'POST', body: JSON.stringify(data) }),
  updateBrand:(id, data)  => req(`/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBrand:(id)        => req(`/brands/${id}`, { method: 'DELETE' }),

  // ── Orders ────────────────────────────────────────────────────
  getOrders:   (params={}) => req('/orders?' + new URLSearchParams(params)),
  getOrder:    (id)        => req(`/orders/${id}`),
  getOrderStats:()         => req('/orders/stats'),
  createOrder: (data)      => req('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id, data)  => req(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // ── Customers ─────────────────────────────────────────────────
  getCustomers:    (params={}) => req('/customers?' + new URLSearchParams(params)),
  getCustomer:     (id)        => req(`/customers/${id}`),
  getCustomerStats:()          => req('/customers/stats'),
  createCustomer:  (data)      => req('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer:  (id, data)  => req(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer:  (id)        => req(`/customers/${id}`, { method: 'DELETE' }),

  // ── Promotions ────────────────────────────────────────────────
  getPromotions:  (params={}) => req('/promotions?' + new URLSearchParams(params)),
  createPromotion:(data)      => req('/promotions', { method: 'POST', body: JSON.stringify(data) }),
  updatePromotion:(id, data)  => req(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePromotion:(id)        => req(`/promotions/${id}`, { method: 'DELETE' }),

    // ── Flash Sale ───────────────────────────────────────────────────
  getFlashSale: () => req('/promotions/flash-sale'),

  // ── Coupons ───────────────────────────────────────────────────
  getCoupons:  (params={}) => req('/coupons/public?' + new URLSearchParams(params)),
  createCoupon:(data)      => req('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon:(id, data)  => req(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon:(id)        => req(`/coupons/${id}`, { method: 'DELETE' }),

  // ── Bundles ───────────────────────────
  getBundles: () => req('/bundles'),
  getBundleById: (id) => req(`/bundles/${id}`),

  // ── Users (admin) ─────────────────────────────────────────────
  getUsers:   (params={}) => req('/users?' + new URLSearchParams(params)),
  createUser: (data)      => req('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data)  => req(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id)        => req(`/users/${id}`, { method: 'DELETE' }),

  // ── Notifications (admin) ───────────────────────────────────────
  getNotifications:   ()   => req('/notifications'),
  markRead:           (id) => req(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead:        ()   => req('/notifications/read-all', { method: 'PUT' }),
  deleteNotification: (id) => req(`/notifications/${id}`, { method: 'DELETE' }),

  // ── Notifications (client / "my" scope) ─────────────────────────
  getMyNotifications:   ()   => req('/notifications'),
  markMyNotifRead:      (id) => req(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllMyNotifRead:   ()   => req('/notifications/read-all', { method: 'PUT' }),
  deleteMyNotification: (id) => req(`/notifications/${id}`, { method: 'DELETE' }),
};