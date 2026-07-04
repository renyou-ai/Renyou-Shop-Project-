import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ArrowLeft, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react'
import { api } from '../../services/api.js'
import Price from "@shared/currency/Price";

const STATUS = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "#92400E",
    bg: "#FEF3C7",
    border: "#FCD34D",
  },
  PROCESSING: {
    label: "Processing",
    icon: RefreshCw,
    color: "#1D4ED8",
    bg: "#DBEAFE",
    border: "#93C5FD",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "#6D28D9",
    bg: "#EDE9FE",
    border: "#C4B5FD",
  },
  COMPLETED: {
    label: "Delivered",
    icon: CheckCircle,
    color: "#065F46",
    bg: "#D1FAE5",
    border: "#6EE7B7",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "#FCA5A5",
  },
}

export default function UserOrders() {
  const navigate = useNavigate()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('ALL')

  useEffect(() => {
  api.getOrders()
    .then(data => setOrders(Array.isArray(data) ? data : data.orders || []))
    .catch(() => setOrders([]))
    .finally(() => setLoading(false))
}, [])

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  const StatusBadge = ({ status }) => {
    const s = STATUS[status] || STATUS.PENDING
    const Icon = s.icon
    return (
<span
  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
  style={{
    color: s.color,
    background: s.bg,
    borderColor: s.border,
  }}
>
  <Icon size={11} />
  {s.label}
</span>
    )
  }

  return (
      <div
    className="min-h-screen"
    style={{
      background: "var(--color-background)",
      color: "var(--color-text)",
    }}
  >
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
<button
  onClick={() => navigate(-1)}
  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:border-violet-500"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  }}
>
  <ArrowLeft size={16} />
</button>

<div>
  <h1
  className="text-2xl font-urbanist font-bold"
  style={{ color: "var(--color-text)" }}
>
    My Orders
  </h1>
  <p
  className="text-sm"
  style={{ color: "var(--color-text-secondary)" }}
>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {['ALL', ...Object.keys(STATUS)].map(f => (
<button
  key={f}
  onClick={() => setFilter(f)}
  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
    filter === f ? "bg-violet-600 shadow-md" : "border hover:border-violet-500"
  }`}
  style={{
    background:
      filter === f ? undefined : "var(--color-surface)",
    borderColor:
      filter === f ? undefined : "var(--color-border)",
    color:
      filter === f ? "#fff" : "var(--color-text)",
  }}
>
  {f === "ALL" ? "All Orders" : STATUS[f]?.label}
  {f !== "ALL" && (
    <span className="ml-1.5 opacity-70">
      ({orders.filter(o => o.status === f).length})
    </span>
  )}
</button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
<div
  key={i}
  className="rounded-2xl p-5 animate-pulse"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
  <div
    className="h-4 rounded w-1/3 mb-3"
    style={{ background: "var(--color-border)" }}
  />
  <div
    className="h-3 rounded w-1/2 mb-2"
    style={{ background: "var(--color-border)" }}
  />
  <div
    className="h-3 rounded w-1/4"
    style={{ background: "var(--color-border)" }}
  />
</div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
<div className="flex flex-col items-center justify-center py-20 text-center">
  <Package
    size={52}
    strokeWidth={1.2}
    style={{ color: "var(--color-text-secondary)" }}
    className="mb-4"
  />

  <h3
    className="text-lg font-semibold mb-1"
    style={{ color: "var(--color-text)" }}
  >
    No orders found
  </h3>

  <p
    className="text-sm mb-5"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {filter === 'ALL'
      ? "You haven't placed any orders yet."
      : `No ${STATUS[filter]?.label?.toLowerCase()} orders.`}
  </p>

  <button
    onClick={() => navigate('/products-list')}
    className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all"
  >
    Start Shopping
  </button>
</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => (
<motion.div
  key={order._id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.05 }}
  className="rounded-2xl p-5 shadow-sm hover:border-violet-500 transition-all cursor-pointer group"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
  onClick={() => navigate(`/user/orders/${order._id}`)}
>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-violet-600">
                        #{(order.orderId || order._id)?.slice(-8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status}/>
                    </div>
                   <p
  className="text-xs"
  style={{ color: "var(--color-text-secondary)" }}
>
  Placed on {new Date(order.date || order.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  )}
</p>
                  </div>
                  <div className="text-right">
<Price
  value={Number(order.total || 0)}
  as="div"
  className="text-base font-bold"
  style={{ color: "var(--color-text)" }}
/>
                    <div
  className="text-xs"
  style={{ color: "var(--color-text-secondary)" }}
>
  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
</div>
                  </div>
                </div>

                {/* Items preview */}
                {order.items && order.items.length > 0 && (
                  <div
  className="mt-3 pt-3 border-t flex items-center gap-2"
  style={{ borderColor: "var(--color-border)" }}
>
                    <div className="flex -space-x-2">
                      {order.items.slice(0,3).map((item, j) => {

  return (
    <div
  key={j}
  className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg overflow-hidden flex-shrink-0"
  style={{
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>
      {item.image || item.product?.image ? (
        
<img
  src={
    (item.image || item.product?.image)?.startsWith("http")
      ? (item.image || item.product?.image)
      : `http://localhost:5000${item.image || item.product?.image}`
  }
  alt={item.productName}
  className="w-full h-full object-contain p-0.5"
/>
      ) : '🧴'}
    </div>
  );
})}
                      {order.items.length > 3 && (
                        <div
  className="w-9 h-9 rounded-lg bg-violet-900/20 border-2 flex items-center justify-center text-[10px] font-bold text-violet-300"
  style={{ borderColor: "var(--color-border)" }}
>
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <span
  className="text-xs flex-1 truncate ml-1"
  style={{ color: "var(--color-text)" }}
>
                      {order.items.map(i => i.productName).slice(0,2).join(', ')}
                      {order.items.length > 2 ? '...' : ''}
                    </span>
                    <ChevronRight
  size={15}
  className="group-hover:text-violet-400 transition-colors flex-shrink-0"
  style={{ color: "var(--color-text-secondary)" }}
/>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
