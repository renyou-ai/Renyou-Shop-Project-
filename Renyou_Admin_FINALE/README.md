# 💜 Renyou Admin — E-Commerce Dashboard

> Premium React + Node.js + MongoDB admin panel for Renyou Shop

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Option 1 — Manual

```bash
# 1. Clone / extract project
cd renyou-admin

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev          # runs on http://localhost:5001

# 3. Frontend (new terminal)
cd ../frontend
npm install
npm run dev          # runs on http://localhost:5173
```

### Option 2 — Docker (recommended)

```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend:  http://localhost:5001
```

### Demo Login

```
Email:    admin@renyou.com
Password: admin123@
```

---

## 📁 Project Structure

```
renyou-admin/
├── backend/
│   └── src/
│       ├── models/
│       │   ├── User.js
│       │   ├── Product.js
│       │   ├── Category.js
│       │   ├── Brand.js
│       │   ├── Order.js
│       │   ├── Customer.js
│       │   ├── Promotion.js      (+ Coupon)
│       │   ├── Notification.js
│       │   └── Settings.js       ← Dedicated settings model
│       ├── controllers/
│       │   └── settingsController.js  ← getSettings + updateSettings
│       ├── routes/
│       │   ├── auth.js           (login, /me, change-password)
│       │   ├── products.js
│       │   ├── categories.js     (real productCount from DB)
│       │   ├── brands.js         (real productCount from DB)
│       │   ├── orders.js
│       │   ├── customers.js      (avatar auto-sync with name)
│       │   ├── promotions.js
│       │   ├── coupons.js
│       │   ├── users.js          (profile update + initials)
│       │   ├── notifications.js
│       │   ├── dashboard.js      (5 periods, English months MON→SUN)
│       │   └── settings.js       ← GET/PUT /api/settings
│       ├── middleware/
│       │   └── auth.js           (JWT)
│       ├── utils/
│       │   └── deepMerge.js      ← Recursive merge for settings
│       ├── seed.js               (15 products, 10 customers, real data)
│       └── index.js
│
├── frontend/
│   └── src/
│       ├── api.js                (all API calls incl. getSettings/saveSettings)
│       ├── App.jsx               (protected routes)
│       ├── styles.css            (Inter font, CSS vars, dark mode, responsive)
│       ├── components/
│       │   ├── Sidebar.jsx       (Urbanist logo, dark mode toggle, premium dropup)
│       │   ├── Topbar.jsx        (debounced search, animated notifications)
│       │   ├── Toast.jsx         (premium toasts with progress bar)
│       │   └── Layouts.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── NotifContext.jsx
│       │   └── ThemeContext.jsx  (dark mode + theme color + sidebar width)
│       ├── utils/
│       │   └── flags.js          (195+ country flags)
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx  (AI SKIN ANALYSES, stock alerts, bar chart)
│           ├── InventoryPage.jsx  (CSV export, inventory report, pagination)
│           ├── CustomersPage.jsx  (country flags, avatar sync, CSV export)
│           ├── CustomerProfilePage.jsx
│           ├── OrdersPage.jsx     (print invoice, CSV export, status update)
│           ├── PromotionsPage.jsx
│           ├── CouponsPage.jsx    (auto-generate code, copy)
│           ├── BrandsPage.jsx     (195+ country flags)
│           ├── CategoriesPage.jsx (real productCount from DB)
│           ├── UsersPage.jsx      (smart initials, real count)
│           └── SettingsPage.jsx   (5 tabs, all functional, DB persistence)
│
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user |
| POST | `/api/auth/change-password` | Change password |
| PUT  | `/api/users/me` | Update profile (name, email, avatar) |
| **GET**  | **`/api/settings`** | **Fetch user settings (upsert)** |
| **PUT**  | **`/api/settings`** | **Save settings (deep merge)** |
| GET  | `/api/dashboard/stats` | Global stats |
| GET  | `/api/dashboard/revenue-chart?period=7j` | Revenue chart (7j/30j/90j/6m/1an) |
| GET  | `/api/dashboard/stock-alerts` | Products needing attention |
| GET  | `/api/products?search=&stockStatus=&page=` | Products list |
| GET  | `/api/categories` | Categories with real productCount |
| GET  | `/api/brands` | Brands with real productCount |
| GET  | `/api/orders?search=&status=&page=` | Orders |
| GET  | `/api/customers?search=&status=&loyalty=&page=` | Customers |
| ... | All CRUD routes | See route files |

---

## Features

### Settings

- **General**: Store name, email, currency (USD default), language (EN default), timezone
- **Profile**: Name, email, avatar (emoji presets + photo upload from PC), password change
- **Notifications**: 4 toggles — all saved to MongoDB
- **Security**: 2FA, IP whitelist, session timeout — all saved
- **Appearance**: Dark/Light mode, 8 theme colors + custom picker, sidebar width

### Dashboard

- 4 stat cards with icons: Total Revenue ($), Total Orders, Active Products, AI Skin Analyses
- Revenue Trends: Area chart, 5 periods (7D/30D/90D/6M/1Y),
- Sales by Category: Bar chart
- Stock Alerts card with **Inventory Report button**
- Animated smooth refresh

### All Pages

- Search bars with debounce (280ms) — functional on all pages
- Pagination on all tables
- CSV export (Products, Orders, Customers)
- Print invoice (Orders)
- 195+ country flags (Customers, Brands)
- Toast notifications on all actions
- Dark mode support across all components
- Fully responsive (mobile, tablet, desktop)

---

## Environment Variables

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/renyou
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

---

## Tech Stack

**Frontend:** React 18, Vite, React Router v7, Framer Motion, Recharts, Lucide React, Inter + Urbanist fonts

**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs

**Database:** MongoDB with dedicated Settings collection

---

*Built with 💜 for Renyou Shop*
