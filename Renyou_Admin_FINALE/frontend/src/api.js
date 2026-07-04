

function getToken() {
  const token = localStorage.getItem('renyou_token');

  return token;
}

async function req(path, options = {}) {

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

async function uploadFile(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
}

export function exportCSV(filename, rows, headers) {
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  // ── Auth ──
  login:          (email, password) => req('/auth/login', { method:'POST', body:JSON.stringify({ email, password }) }),
  me:             ()                => req('/auth/me'),
  changePassword: (data)            => req('/auth/change-password', { method:'POST', body:JSON.stringify(data) }),

  // ── Profile (name, email, avatar only) ──
updateMe: (data) => req('/users/me', {
  method:'PUT',
  body:JSON.stringify(data)
}),

uploadAvatar: (formData) =>
  uploadFile('/users/avatar', formData),

  // ── Settings (dedicated endpoint) ──
  getSettings:    ()     => req('/settings'),
  saveSettings:   (data) => req('/settings', { method:'PUT', body:JSON.stringify(data) }),

  // ── Dashboard ──
  dashboardStats:  ()           => req('/dashboard/stats'),
  revenueChart:    (period='7j')=> req(`/dashboard/revenue-chart?period=${period}`),
  categorySales:   (period='7j')=> req(`/dashboard/category-sales?period=${period}`),
  monthlyTrend:    ()           => req('/dashboard/monthly-trend'),
  recentOrders:    ()           => req('/dashboard/recent-orders'),
  stockAlerts:     ()           => req('/dashboard/stock-alerts'),
  topProducts:     ()           => req('/dashboard/top-products'),
  topCustomers:    ()           => req('/dashboard/top-customers'),

  // ── Products ──
  getProducts:    (p={}) => req('/products?'      + new URLSearchParams(p)),
  getProductAlerts:()    => req('/products/alerts'),
  getProductStats: ()    => req('/products/stats'),
  createProduct:  (d)    => req('/products',            { method:'POST',   body:JSON.stringify(d) }),
  updateProduct:  (id,d) => req(`/products/${id}`,      { method:'PUT',    body:JSON.stringify(d) }),
  deleteProduct:  (id)   => req(`/products/${id}`,      { method:'DELETE' }),

  // ── Categories ──
  getCategories:  (p={}) => req('/categories?'    + new URLSearchParams(p)),
  createCategory: (d)    => req('/categories',          { method:'POST',   body:JSON.stringify(d) }),
  updateCategory: (id,d) => req(`/categories/${id}`,    { method:'PUT',    body:JSON.stringify(d) }),
  deleteCategory: (id)   => req(`/categories/${id}`,    { method:'DELETE' }),

  // ── Brands ──
  getBrands:      (p={}) => req('/brands?'        + new URLSearchParams(p)),
  createBrand:    (d)    => req('/brands',              { method:'POST',   body:JSON.stringify(d) }),
  updateBrand:    (id,d) => req(`/brands/${id}`,        { method:'PUT',    body:JSON.stringify(d) }),
  deleteBrand:    (id)   => req(`/brands/${id}`,        { method:'DELETE' }),

  // ── Orders ──
  getOrders:      (p={}) => req('/orders?'        + new URLSearchParams(p)),
  getOrder:       (id)   => req(`/orders/${id}`),
  getOrderStats:  ()     => req('/orders/stats'),
  updateOrder:    (id,d) => req(`/orders/${id}`,        { method:'PUT',    body:JSON.stringify(d) }),
  createOrder:    (d)    => req('/orders',              { method:'POST',   body:JSON.stringify(d) }),

  // ── Customers ──
  getCustomers:   (p={}) => req('/customers?'     + new URLSearchParams(p)),
  getCustomer:    (id)   => req(`/customers/${id}`),
  getCustomerStats:()    => req('/customers/stats'),
  createCustomer: (d)    => req('/customers',           { method:'POST',   body:JSON.stringify(d) }),
  updateCustomer: (id,d) => req(`/customers/${id}`,     { method:'PUT',    body:JSON.stringify(d) }),
  deleteCustomer: (id)   => req(`/customers/${id}`,     { method:'DELETE' }),

  // ── Promotions ──
  getPromotions:  (p={}) => req('/promotions?'    + new URLSearchParams(p)),
  createPromotion:(d)    => req('/promotions',          { method:'POST',   body:JSON.stringify(d) }),
  updatePromotion:(id,d) => req(`/promotions/${id}`,    { method:'PUT',    body:JSON.stringify(d) }),
  deletePromotion:(id)   => req(`/promotions/${id}`,    { method:'DELETE' }),

  // ── Coupons ──
  getCoupons:     (p={}) => req('/coupons?'       + new URLSearchParams(p)),
  createCoupon:   (d)    => req('/coupons',             { method:'POST',   body:JSON.stringify(d) }),
  updateCoupon:   (id,d) => req(`/coupons/${id}`,       { method:'PUT',    body:JSON.stringify(d) }),
  deleteCoupon:   (id)   => req(`/coupons/${id}`,       { method:'DELETE' }),

  // ── Users ──
  getUsers:       (p={}) => req('/users?'         + new URLSearchParams(p)),
  createUser:     (d)    => req('/users',               { method:'POST',   body:JSON.stringify(d) }),
  updateUser:     (id,d) => req(`/users/${id}`,         { method:'PUT',    body:JSON.stringify(d) }),
  deleteUser:     (id)   => req(`/users/${id}`,         { method:'DELETE' }),

  // ── Notifications ──
  getNotifications: ()   => req('/notifications'),
  markRead:        (id)  => req(`/notifications/${id}/read`, { method:'PUT' }),
  markAllRead:     ()    => req('/notifications/read-all',   { method:'PUT' }),
  deleteNotification:(id)=> req(`/notifications/${id}`,      { method:'DELETE' }),
};
