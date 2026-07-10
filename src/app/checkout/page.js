"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { ShieldCheck, Tag, CreditCard, Check, AlertCircle, ShoppingBag, Truck, MapPin, Lock, ChevronRight, Sparkles, Package } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponQuery = searchParams.get('coupon') || '';

  const { cart, clearCart, user, orders, setOrders, cms } = useAppState();

  const [step, setStep] = useState(1); // 1 = address, 2 = payment
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponCode, setCouponCode] = useState(couponQuery);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    if (couponQuery && couponQuery.toUpperCase() === cms.couponCode.toUpperCase()) {
      setDiscountPercent(cms.couponDiscount);
      setCouponSuccess(true);
    }
  }, [couponQuery]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === cms.couponCode.toUpperCase()) {
      setDiscountPercent(cms.couponDiscount);
      setCouponSuccess(true);
      setError('');
    } else {
      setError('Invalid coupon code. Try PASTEUR30.');
      setDiscountPercent(0);
      setCouponSuccess(false);
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      setError('Please fill in all shipping address fields.');
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(async () => {
      try {
        const orderId = 'SV-ORD-' + Math.floor(Math.random() * 900000 + 100000);

        const items = cart.map(item => ({
          productId: item.id,
          name: item.name,
          priceAtPurchase: item.price,
          quantity: item.quantity,
          size: item.size
        }));

        const newOrder = {
          orderId,
          date: new Date().toISOString().split('T')[0],
          total: finalTotal,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
          trackingStatus: 'placed',
          shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
          items,
          deviceDetails: null
        };

        try {
          const res = await fetch('http://localhost:5000/api/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?.uid || 'guest_101',
              items,
              total: finalTotal,
              address: shippingAddress,
              gateway: paymentMethod === 'COD' ? 'COD' : 'UPI_Direct',
              paymentMethod
            })
          });
          const resData = await res.json();
          console.log("Backend:", resData);
        } catch (apiErr) {
          console.log("API offline, saving locally.", apiErr);
        }

        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        router.push(`/orders/track/${orderId}?new=true`);
      } catch (err) {
        setError('Transaction failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const paymentOptions = [
    {
      id: 'UPI',
      name: 'UPI Payment',
      desc: 'GPay, PhonePe, Paytm',
      icon: '⚡',
      badge: 'INSTANT'
    },
    {
      id: 'Credit Card',
      name: 'Credit / Debit Card',
      desc: 'Visa, Mastercard, RuPay',
      icon: '💳',
      badge: 'SECURE'
    },
    {
      id: 'Net Banking',
      name: 'Net Banking',
      desc: 'All major Indian banks',
      icon: '🏦',
      badge: null
    },
    {
      id: 'COD',
      name: 'Cash On Delivery',
      desc: 'Pay when you receive',
      icon: '📦',
      badge: null
    }
  ];

  const addressComplete = shippingAddress.street && shippingAddress.city && shippingAddress.postalCode && shippingAddress.country;

  return (
    <div className="min-h-screen bg-[#f7f6f3]">

      {/* Top Progress Bar */}
      <div className="bg-white border-b border-luxury-border sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={13} className="text-gold" />
            <span className="text-[10px] tracking-widest font-bold text-primary uppercase">Secure Checkout</span>
          </div>
          
          {/* Steps */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all ${step >= 1 ? 'bg-primary text-white' : 'text-gray-400'}`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px]">1</span>
              Address
            </button>
            <ChevronRight size={12} className="text-gray-300" />
            <button
              onClick={() => addressComplete && setStep(2)}
              className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all ${step === 2 ? 'bg-primary text-white' : addressComplete ? 'text-primary border border-luxury-border' : 'text-gray-300 cursor-not-allowed'}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 2 ? 'bg-white/20' : 'bg-luxury-gray border border-luxury-border'}`}>2</span>
              Payment
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <ShieldCheck size={13} className="text-gold" />
            SSL Encrypted
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ---- LEFT PANEL: Form ---- */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          <AnimatePresence mode="wait">
            {/* STEP 1: Shipping Address */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-luxury-border rounded-xl overflow-hidden shadow-sm"
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-luxury-border bg-[#fafafa]">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <h2 className="text-[11px] font-bold tracking-widest uppercase text-primary">Delivery Address</h2>
                    <p className="text-[10px] text-gray-400">Where should we send your order?</p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">Street Address *</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Plot No. 5, Chanakyapuri"
                      className="text-[12px] p-3.5 border border-luxury-border rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all bg-[#fafafa]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New Delhi"
                      className="text-[12px] p-3.5 border border-luxury-border rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all bg-[#fafafa]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">PIN Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="110021"
                      className="text-[12px] p-3.5 border border-luxury-border rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all bg-[#fafafa]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">Country *</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="India"
                      className="text-[12px] p-3.5 border border-luxury-border rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all bg-[#fafafa]"
                      required
                    />
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (addressComplete) {
                        const addressStr = encodeURIComponent(`${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`);
                        router.push(`/payment?total=${finalTotal}&address=${addressStr}`);
                      } else {
                        setError('Please fill in all address fields.');
                      }
                    }}
                    className="w-full bg-primary text-white text-[10px] tracking-[0.25em] font-bold py-4 rounded-lg hover:bg-gold transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-md"
                  >
                    Continue to Payment <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Address Summary (Confirmed) */}
                <div className="bg-white border border-luxury-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-primary uppercase">Delivery Address</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{shippingAddress.street}, {shippingAddress.city} — {shippingAddress.postalCode}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[9px] font-bold text-gold uppercase tracking-wider hover:underline">Edit</button>
                </div>

                {/* Payment Card */}
                <div className="bg-white border border-luxury-border rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-luxury-border bg-[#fafafa]">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <h2 className="text-[11px] font-bold tracking-widest uppercase text-primary">Payment Method</h2>
                      <p className="text-[10px] text-gray-400">Choose your preferred payment option</p>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`relative text-left p-4 border-2 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                          paymentMethod === opt.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-luxury-border bg-[#fafafa] hover:border-gray-300'
                        }`}
                      >
                        {opt.badge && (
                          <span className="absolute top-2 right-2 text-[8px] font-bold tracking-wider bg-gold text-white px-1.5 py-0.5 rounded uppercase">
                            {opt.badge}
                          </span>
                        )}
                        <span className="text-xl mt-0.5">{opt.icon}</span>
                        <div className="flex-grow">
                          <p className="text-[12px] font-bold text-primary">{opt.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          paymentMethod === opt.id ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}>
                          {paymentMethod === opt.id && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full bg-primary text-white text-[10px] tracking-[0.25em] font-bold py-4 rounded-lg hover:bg-gold transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing Secure Payment...
                        </>
                      ) : (
                        <>
                          <Lock size={13} />
                          Place Order · ₹{finalTotal.toLocaleString('en-IN')}
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                      <ShieldCheck size={11} className="text-gold" />
                      256-bit SSL encrypted · Powered by Razorpay
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-[11px] flex items-center gap-2 rounded-lg"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---- RIGHT PANEL: Order Summary ---- */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-[72px]">

          {/* Order Summary Card */}
          <div className="bg-white border border-luxury-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-luxury-border bg-[#fafafa]">
              <ShoppingBag size={14} className="text-gold" />
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-primary">
                Order Summary <span className="text-gray-400 font-normal">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
              </h3>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col divide-y divide-luxury-border max-h-[280px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-[12px]">Your bag is empty</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4">
                    <div className="relative w-14 h-18 shrink-0 rounded-lg overflow-hidden border border-luxury-border bg-luxury-gray" style={{ height: '72px' }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center gap-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-primary leading-snug truncate">{item.name}</h4>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider">Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}</p>
                    </div>
                    <span className="text-[12px] font-bold text-primary shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>

            {/* Coupon */}
            <div className="p-4 border-t border-luxury-border">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo code (PASTEUR30)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`w-full text-[10px] tracking-wider pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:border-gold transition-all ${couponSuccess ? 'border-green-400 bg-green-50' : 'border-luxury-border bg-[#fafafa]'}`}
                  />
                </div>
                <button
                  type="submit"
                  className="text-[10px] font-bold tracking-wider bg-primary text-white px-4 py-2.5 hover:bg-gold transition-colors rounded-lg shrink-0"
                >
                  APPLY
                </button>
              </form>
              {couponSuccess && (
                <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1">
                  <Check size={11} /> {discountPercent}% discount applied!
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="p-5 border-t border-luxury-border flex flex-col gap-2.5 bg-[#fafafa]">
              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[12px] text-green-600 font-semibold">
                  <span>Promo ({discountPercent}% OFF)</span>
                  <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Shipping</span>
                <span className="text-gold font-bold text-[10px] tracking-wider uppercase">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-luxury-border mt-1">
                <span className="text-[12px] font-bold tracking-widest uppercase text-primary">Total</span>
                <span className="text-2xl font-editorial font-bold text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white border border-luxury-border rounded-xl p-4 grid grid-cols-3 gap-3">
            {[
              { icon: <Truck size={16} className="text-gold" />, label: 'Free Delivery', sub: 'On orders ₹1500+' },
              { icon: <Package size={16} className="text-gold" />, label: 'Easy Returns', sub: '14-day policy' },
              { icon: <Sparkles size={16} className="text-gold" />, label: 'Luxury Box', sub: 'Premium packaging' }
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">{b.icon}</div>
                <p className="text-[10px] font-bold text-primary">{b.label}</p>
                <p className="text-[9px] text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-luxury-black font-semibold">
        Initializing Secure Atelier Gateways...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
