import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, Check, Truck, Shield, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import Price from "@shared/currency/Price";
import Footer from "../../components/Footer.jsx";

const STEPS = ['Shipping', 'Payment', 'Confirmation']

const PAYMENT_METHODS = [
  { id: 'card',   label: 'Credit / Debit Card',  icon: '💳' },
  { id: 'cash',   label: 'Cash on Delivery',      icon: '💵' },
  { id: 'wallet', label: 'Digital Wallet',         icon: '📱' },
]

  // ── Step 0: Shipping ──
  
function ShippingStep({
  form,
  errors,
  setF,
  inputClass,
  validateShipping,
  setStep
}) {

  return (
  
  <div>
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
  <MapPin size={16} className="text-violet-600" />
  Shipping Address
</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { k:'firstName', label:'First Name', type:'text',  placeholder:'Foulen'           },
          { k:'lastName',  label:'Last Name',  type:'text',  placeholder:'Loufen'          },
          { k:'email',     label:'Email',      type:'email', placeholder:'you@example.com', full:true },
          { k:'phone',     label:'Phone',      type:'tel',   placeholder:'+216 XX XXX XXX' },
          { k:'address',   label:'Address',    type:'text',  placeholder:'123 Main Street', full:true },
          { k:'city',      label:'City',       type:'text',  placeholder:'Gafsa'           },
          { k:'country',   label:'Country',    type:'text',  placeholder:'Tunisia'         },
          { k:'zip',       label:'ZIP Code',   type:'text',  placeholder:'1000'            },
        ].map(f => (
          <div key={f.k} className={f.full ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{f.label}</label>
            <input type={f.type} value={form[f.k]} onChange={e => setF(f.k, e.target.value)}
              placeholder={f.placeholder} className={inputClass(f.k)}/>
            {errors[f.k] && <p className="text-[11px] text-red-500 mt-0.5">{errors[f.k]}</p>}
          </div>
        ))}
      </div>
      <motion.button whileTap={{ scale:0.97 }}
        onClick={() => { if (validateShipping()) setStep(1) }}
        className="mt-6 w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
        Continue to Payment <ChevronRight size={16}/>
      </motion.button>
    </div>
  )
}

    // ── Step 1: Payment ──
  function PaymentStep({
  payment,
  setPayment,
  cardForm,
  setCardForm,
  loading,
  handlePlaceOrder,
  finalTotal,
  setStep
}) {
  return (
    <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><CreditCard size={16} className="text-violet-600"/> Payment Method</h2>
      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map(m => (
          <label key={m.id}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              payment === m.id
? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-violet-300'
            }`}>
            <input type="radio" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-violet-600"/>
            <span className="text-xl">{m.icon}</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">{m.label}</span>
            {payment === m.id && <Check size={16} className="text-violet-600 ml-auto"/>}
          </label>
        ))}
      </div>

      {payment === 'card' && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="space-y-4 mb-6 overflow-hidden">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Card Number</label>
            <input value={cardForm.number} onChange={e => setCardForm(p=>({...p, number: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()}))}
              placeholder="1234 5678 9012 3456" maxLength={19}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Expiry</label>
              <input value={cardForm.expiry} onChange={e => setCardForm(p=>({...p, expiry: e.target.value}))}
                placeholder="MM/YY" maxLength={5}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">CVV</label>
              <input value={cardForm.cvv} onChange={e => setCardForm(p=>({...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))}
                placeholder="123" maxLength={4} type="password"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Cardholder Name</label>
            <input value={cardForm.name} onChange={e => setCardForm(p=>({...p, name: e.target.value}))}
              placeholder="FOULEN LOUFEN"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm uppercase tracking-wide focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <Shield size={13} className="text-emerald-500 flex-shrink-0"/>
        Your payment information is encrypted and secure.
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(0)}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 transition-all flex items-center gap-2">
          <ArrowLeft size={14}/> Back
        </button>
        <motion.button whileTap={{ scale:0.97 }} onClick={handlePlaceOrder} disabled={loading}
          className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing...</>
            : (
  <>
    <Check size={16} />
    Place Order — <Price value={finalTotal} />
  </>
)}
        </motion.button>
      </div>
    </motion.div>
  )
}
export default function CheckoutPage() {
  const navigate  = useNavigate()
  const { items, subtotal, discount, shipping, tax, totalPrice, coupon, clearCart } = useCart()
  const toast = useToast()
  const { user }  = useAuth()

  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [payment, setPayment] = useState('card')

  const [form, setForm] = useState({
    firstName: user?.username?.split(' ')[0] || '',
    lastName:  user?.username?.split(' ')[1] || '',
    email:     user?.email || '',
    phone:     '',
    address:   '',
    city:      '',
    country:   'Tunisia',
    zip:       '',
  })
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})

  const finalTotal = totalPrice

  const validateShipping = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.email)     e.email     = 'Required'
    if (!form.phone)     e.phone     = 'Required'
    if (!form.address)   e.address   = 'Required'
    if (!form.city)      e.city      = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: items.map(i => ({
  product: i._id,
  productName: i.name,
  quantity: i.qty,
  price: i.finalPrice || i.price,
  image: i.image,
  isBundle: i.isBundle || false,
})),
        total:           finalTotal,
        shippingAddress: `${form.address}, ${form.city}, ${form.country}`,
        customerName:    `${form.firstName} ${form.lastName}`.trim(),
        customerEmail:   form.email,
        paymentMethod:   payment,
        couponCode:      coupon?.code,
        status:          'PENDING',
      }
      const result = await api.createOrder(orderData)
      setOrderId(result._id || result.orderId || 'ORD-' + Date.now())
      clearCart()
      setStep(2)
      toast.success('Order placed !', 'Thank you for your purchase', { duration: 3500 })
    } catch (err) {
      toast.error('Order failed', err.message || 'Please try again.')
    } finally { setLoading(false) }
  }

const inputClass = (key) =>
  `w-full px-3.5 py-2.5 border rounded-xl text-sm
   bg-white dark:bg-gray-900
   text-gray-900 dark:text-white
   border-gray-200 dark:border-gray-700
   placeholder:text-gray-400 dark:placeholder:text-gray-500
   focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100
   transition-all ${
     errors[key] ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''
   }`

  const setF = (k, v) => { setForm(p => ({...p, [k]: v})); setErrors(p => ({...p, [k]: ''})) }



  // ── Step 2: Confirmation ──
  const ConfirmationStep = () => (
    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
      className="text-center py-8">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300, delay:0.1 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Check size={36} className="text-emerald-600" strokeWidth={2.5}/>
      </motion.div>
      <h2 className="text-2xl font-urbanist font-bold text-gray-900 mb-2">Order Confirmed !</h2>
      <p className="text-gray-500 text-sm mb-1">Thank you for your purchase.</p>
      {orderId && <p className="text-xs text-violet-600 font-mono font-bold mb-6">Order ID: #{String(orderId).slice(-8).toUpperCase()}</p>}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 text-left mb-6 text-sm text-gray-600 dark:text-gray-300 space-y-2.5">
        <div className="flex items-center gap-2"><Truck size={15} className="text-violet-600"/> Estimated delivery: <strong>2-5 business days</strong></div>
        <div className="flex items-center gap-2"><Shield size={15} className="text-violet-600"/> Confirmation sent to: <strong>{form.email}</strong></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => navigate('/user/orders')}
          className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all text-sm">
          Track My Order
        </button>
        <button onClick={() => navigate('/products-list')}
          className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 dark:bg-gray-800 transition-all text-sm">
          Continue Shopping
        </button>
      </div>
    </motion.div>
  )

  // ── Order Summary sidebar ──
  const OrderSummary = () => (
<div
  className="
    rounded-2xl
    p-5
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-700
    shadow-sm
    transition-colors duration-300
  "
>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
        {items.map(i => (
          <div key={i._id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
  src={
    i.image?.startsWith("http")
      ? i.image
      : `http://localhost:5000${i.image}`
  }
  alt={i.name}
  className="w-full h-full object-contain p-0.5"
/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{i.name}</p>
              <p className="text-[11px] text-gray-400">Qty: {i.qty}</p>
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
  <Price value={(i.salePrice || i.price) * i.qty} />
</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 text-xs text-gray-300">
        <div className="flex justify-between"><span>Subtotal</span><span>
  <Price value={subtotal} />
</span></div>
        {discount > 0 && <div className="flex justify-between text-emerald-600 font-semibold"><span>Discount</span><span>
  -<Price value={discount} />
</span></div>}
        <div className="flex justify-between"><span>Shipping</span><span>
  {shipping === 0 ? (
    <span className="text-emerald-600">Free</span>
  ) : (
    <Price value={shipping} />
  )}
</span></div>
        <div className="flex justify-between"><span>Tax (8%)</span><span>
  <Price value={tax} />
</span></div>
        <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700"><span>Total</span><span>
  <Price value={finalTotal} />
</span></div>
      </div>
    </div>
  )

  return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors text-gray-900 dark:text-white">
        <div className="flex items-center gap-3 mb-8">
          <button
  onClick={() => navigate('/user/cart')}
  className="
w-9 h-9
rounded-xl
border border-gray-200 dark:border-gray-700
bg-white dark:bg-gray-900
flex items-center justify-center
hover:border-violet-500
transition-all
"
>
  <ArrowLeft
  size={16}
  className="text-gray-700 dark:text-white"
/>
</button>
          <h1 className="text-2xl font-urbanist font-bold text-gray-900 dark:text-white">Checkout</h1>
        </div>

        {/* Steps indicator */}
        {step < 2 && (
          <div className="flex items-center gap-0 mb-8">
            {STEPS.slice(0,2).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i === step ? 'bg-violet-600 text-white' : i < step ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-white text-violet-600' : 'bg-gray-300 text-white'
                  }`}>{i < step ? '✓' : i+1}</span>
                  {s}
                </div>
                {i < 1 && <div className={`w-8 h-px mx-1 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`}/>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div
  className="
    lg:col-span-2
    rounded-2xl
    p-6
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-700
    shadow-sm
    transition-colors duration-300
  "
>
            <AnimatePresence mode="wait">
              {step === 0 && <ShippingStep
  form={form}
  errors={errors}
  setF={setF}
  inputClass={inputClass}
  validateShipping={validateShipping}
  setStep={setStep}
/>}
              {step === 1 && (
  <PaymentStep
    key="payment"
    payment={payment}
    setPayment={setPayment}
    cardForm={cardForm}
    setCardForm={setCardForm}
    loading={loading}
    handlePlaceOrder={handlePlaceOrder}
    finalTotal={finalTotal}
    setStep={setStep}
  />
)}
              {step === 2 && <ConfirmationStep key="confirm"/>}
            </AnimatePresence>
          </div>
          {step < 2 && (
            <div className="lg:col-span-1">
              <OrderSummary/>
            </div>
          )}
        </div>
      </div>
        <Footer />
    </div>
  )
}