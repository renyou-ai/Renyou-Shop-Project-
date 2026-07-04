import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, RefreshCw,
  MapPin, CreditCard, Copy, Check, MessageCircle, Download
} from 'lucide-react'
import { api } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import Price from "@shared/currency/Price";

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED']

const STATUS_META = {
  PENDING:    { label:'Order Placed',  icon:Clock,       color:'text-yellow-600',  bg:'bg-yellow-50',  ring:'ring-yellow-200'  },
  PROCESSING: { label:'Processing',    icon:RefreshCw,   color:'text-blue-600',    bg:'bg-blue-50',    ring:'ring-blue-200'    },
  SHIPPED:    { label:'Shipped',       icon:Truck,       color:'text-purple-600',  bg:'bg-purple-50',  ring:'ring-purple-200'  },
  COMPLETED:  { label:'Delivered',     icon:CheckCircle2,color:'text-emerald-600', bg:'bg-emerald-50', ring:'ring-emerald-200' },
  CANCELLED:  { label:'Cancelled',     icon:XCircle,     color:'text-red-500',     bg:'bg-red-50',     ring:'ring-red-200'     },
}

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getOrder(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.orderId || order._id)
    setCopied(true)
    toast.success('Copied !', 'Order ID copied to clipboard', { duration: 1800 })
    setTimeout(() => setCopied(false), 1800)
  }

if (loading) {
  return (
    <div
      className="max-w-[800px] mx-auto px-4 sm:px-6 py-10"
      style={{ background: "var(--color-background)" }}
    >
      <div className="space-y-4">
        <div
          className="h-8 rounded w-1/3 animate-pulse"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="h-40 rounded-2xl animate-pulse"
          style={{ background: "var(--color-surface)" }}
        />
        <div
          className="h-60 rounded-2xl animate-pulse"
          style={{ background: "var(--color-surface)" }}
        />
      </div>
    </div>
  )
}

if (!order) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      <Package
        size={52}
        strokeWidth={1.2}
        style={{ color: "var(--color-text-secondary)" }}
      />

      <h2
        className="text-xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Order not found
      </h2>

      <p
        className="text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        We couldn't find an order matching this ID.
      </p>

      <button
        onClick={() => navigate('/user/orders')}
        className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all"
      >
        Back to Orders
      </button>
    </div>
  )
}

  const {
    orderId, status = 'PENDING', items = [], total = 0,
    shippingAddress, customerName, customerEmail, paymentMethod,
    createdAt, date, couponCode, subtotal, shippingCost = 0, discount = 0,
  } = order
  items.forEach(item => {
});

  const meta = STATUS_META[status] || STATUS_META.PENDING
  const StatusIcon = meta.icon
  const cancelled = status === 'CANCELLED'
  const currentStepIndex = STATUS_STEPS.indexOf(status)

  return (
    <div
  className="min-h-screen"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
<div className="flex items-center gap-3 mb-6">
  <button
    onClick={() => navigate('/user/orders')}
    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:border-violet-500"
    style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      color: "var(--color-text)",
    }}
  >
    <ArrowLeft size={16} />
  </button>

  <div className="flex-1">
    <div className="flex items-center gap-2 flex-wrap">
      <h1
        className="text-xl font-urbanist font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Order #{(orderId || order._id)?.slice(-8).toUpperCase()}
      </h1>

      <button
        onClick={copyOrderId}
        className="transition-colors hover:text-violet-500"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {copied ? (
          <Check size={14} className="text-emerald-500" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>

    <p
      className="text-xs mt-0.5"
      style={{ color: "var(--color-text-secondary)" }}
    >
      Placed on{" "}
      {new Date(date || createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>
</div>

        {/* Status hero */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-2xl border p-5 mb-6 flex items-center gap-4"
  style={{
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>
<div
  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${meta.color}`}
  style={{
    background: "var(--color-background)",
  }}
>
            <StatusIcon size={22}/>
          </div>
          <div>
            <p className={`text-base font-bold ${meta.color} dark:text-white`}>{meta.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {status === 'COMPLETED' ? 'Your order has been delivered successfully.'
                : status === 'SHIPPED' ? 'Your order is on its way!'
                : status === 'PROCESSING' ? "We're preparing your order."
                : cancelled ? 'This order was cancelled.'
                : 'Your order has been received.'}
            </p>
          </div>
        </motion.div>

        {/* Progress tracker */}
        {!cancelled && (
<div
  className="rounded-2xl p-6 mb-6"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
            <div className="flex items-center justify-between relative">
              <div
  className="absolute top-4 left-4 right-4 h-0.5"
  style={{
    background: "var(--color-border)",
  }}
/>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                className="absolute top-4 left-4 h-0.5 bg-violet-500"
                style={{ maxWidth: 'calc(100% - 2rem)' }}
              />
              {STATUS_STEPS.map((s, i) => {
                const stepMeta = STATUS_META[s]
                const StepIcon = stepMeta.icon
                const done = i <= currentStepIndex
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-2 flex-1">
<div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
done
? 'bg-violet-600 border-violet-600 text-white'
: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-300 dark:text-gray-500'
}`}>
                      <StepIcon size={13}/>
                    </div>
                    <span className={`text-[11px] font-semibold text-center ${
  done
    ? 'text-violet-700 dark:text-violet-400'
    : 'text-gray-400 dark:text-gray-500'
}`}>
                      {stepMeta.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Items */}
<div
  className="rounded-2xl p-5 mb-6"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
<h2
  className="text-sm font-bold mb-4 flex items-center gap-2"
  style={{ color: "var(--color-text)" }}
>
  <Package size={15} className="text-violet-600" />
  Items ({items.length})
</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div
  key={i}
  className="flex items-center gap-3 pb-3 last:border-0 last:pb-0"
  style={{
    borderBottom: i !== items.length - 1
      ? "1px solid var(--color-border)"
      : "none",
  }}
>
                <div
  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
  style={{
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
  }}
>
  
{(() => {
  const image = item.image || item.product?.image || "";

  return image ? (
    <img
      src={
        image.startsWith("http")
          ? image
          : `http://localhost:5000${image}`
      }
      alt={item.productName}
      className="w-full h-full object-contain p-1"
    />
  ) : (
    <span className="text-xl">🧴</span>
  );
})()}
</div>
                <div className="flex-1 min-w-0">
                  <p
  className="text-sm font-semibold truncate"
  style={{ color: "var(--color-text)" }}
>
  {item.productName}
</p>
                  <p
  className="text-xs flex items-center gap-1"
  style={{ color: "var(--color-text-secondary)" }}
>
  Qty: {item.quantity} ×
  <Price value={item.price} />
</p>
                </div>
<Price
  value={item.price * item.quantity}
  as="span"
  className="text-sm font-bold"
  style={{ color: "var(--color-text)" }}
/>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
<div
  className="rounded-2xl p-5"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
            <h3
  className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5"
  style={{ color: "var(--color-text-secondary)" }}
>
              <MapPin size={12}/> Shipping Address
            </h3>
            <p
  className="text-sm font-semibold"
  style={{ color: "var(--color-text)" }}
>
  {customerName}
</p>
            <p
  className="text-xs mt-1 leading-relaxed"
  style={{ color: "var(--color-text-secondary)" }}
>
  {shippingAddress}
</p>
            <p
  className="text-xs mt-1"
  style={{ color: "var(--color-text-secondary)" }}
>
  {customerEmail}
</p>
          </div>
<div
  className="rounded-2xl p-5"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
            <h3
  className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5"
  style={{ color: "var(--color-text-secondary)" }}
>
              <CreditCard size={12}/> Payment Method
            </h3>
            <p
  className="text-sm font-semibold capitalize"
  style={{ color: "var(--color-text)" }}
>
              {paymentMethod === 'card' ? '💳 Credit / Debit Card' : paymentMethod === 'cash' ? '💵 Cash on Delivery' : '📱 Digital Wallet'}
            </p>
            {couponCode && (
              <p className="text-xs text-emerald-600 mt-2 font-medium">🏷️ Coupon applied: {couponCode}</p>
            )}
          </div>
        </div>

        {/* Totals */}
<div
  className="rounded-2xl p-5"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
          <h3
  className="text-sm font-bold mb-3"
  style={{ color: "var(--color-text)" }}
>
  Order Summary
</h3>
          <div className="space-y-2 text-sm">
            <div
  className="flex justify-between"
  style={{ color: "var(--color-text-secondary)" }}
>
              <span>Subtotal</span><Price value={subtotal ?? total - shippingCost + discount} as="span" />
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span><span>
  -<Price value={discount} as="span" />
</span>
              </div>
            )}
            <div
  className="flex justify-between"
  style={{ color: "var(--color-text-secondary)" }}
>
              <span>Shipping</span><span>
  {shippingCost === 0
    ? 'Free'
    : <Price value={shippingCost} as="span" />}
</span>
            </div>
            <div
  className="flex justify-between font-bold text-base pt-2"
  style={{
    color: "var(--color-text)",
    borderTop: "1px solid var(--color-border)",
  }}
>
              <span>Total</span>
<Price
  value={total}
  as="span"
  className="font-bold text-base"
  style={{ color: "var(--color-text)" }}
/>
            </div>
          </div>
        </div>

        {/* Actions */}
<div className="flex flex-col sm:flex-row gap-3">
  <button
    onClick={() => window.print()}
    className="flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all text-sm hover:border-violet-500"
    style={{
      background: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    }}
  >
    <Download size={15} />
    Download Invoice
  </button>

  <a
    href={`https://wa.me/?text=${encodeURIComponent(
      "Hi, I need help with order #" + (orderId || order._id)?.slice(-8)
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all text-sm"
  >
    <MessageCircle size={15} />
    Contact Support
  </a>
</div>
      </div>
    </div>
  )
}
