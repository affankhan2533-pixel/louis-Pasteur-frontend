"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { ChevronLeft, Plus, Minus, Search, Check, Truck, Shield, Lock, CreditCard, Smartphone, ShieldAlert, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Bank data for Net Banking
const BANKS = [
  { id: 'HDFC', name: 'HDFC Bank', color: '#004C8F', textColor: '#fff' },
  { id: 'ICICI', name: 'ICICI Bank', color: '#F37021', textColor: '#fff' },
  { id: 'SBI', name: 'State Bank of India', color: '#2D4E8A', textColor: '#fff' },
  { id: 'AXIS', name: 'Axis Bank', color: '#97144D', textColor: '#fff' },
  { id: 'KOTAK', name: 'Kotak Mahindra', color: '#ED1C24', textColor: '#fff' },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, orders, setOrders, user } = useAppState();

  // URL parameters from checkout page
  const totalFromUrl = Number(searchParams.get('total') || 0);
  const addressFromUrl = searchParams.get('address') || '';

  const total = totalFromUrl || cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Gateway Configurations fetched from Backend
  const [config, setConfig] = useState({
    merchantUpiId: 'affankhan2533@okaxis',
    merchantName: 'LOUIS PASTEUR',
    isRazorpayEnabled: false,
    razorpayKeyId: ''
  });

  // Unique Order ID generated for this transaction session
  const [sessionOrderId, setSessionOrderId] = useState('');

  // Accordion / Payment tab states
  const [openSection, setOpenSection] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // UPI QR Code states
  const [utr, setUtr] = useState('');
  const [countdown, setCountdown] = useState(900); // 15 minutes timer
  const [showUtrField, setShowUtrField] = useState(false);

  // Card details states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState('');
  const [bankSearch, setBankSearch] = useState('');

  // Load backend configurations and set a temporary order identifier
  useEffect(() => {
    // Fetch configuration settings from backend
    fetch('http://localhost:5000/api/orders/config')
      .then(res => res.json())
      .then(data => {
        if (data) setConfig(data);
      })
      .catch(err => console.error("Error loading payment configuration:", err));

    // Generate static order ID for this checkout flow
    const rId = 'SV-ORD-' + Math.floor(Math.random() * 900000 + 100000);
    setSessionOrderId(rId);

    // QR countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format countdown seconds into MM:SS format
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  // Dynamically load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Master handler for checkout submission
  const handlePaymentSubmit = async (methodType) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // Pre-calculate items
    const items = cart.map(item => ({
      productId: item.id,
      name: item.name,
      priceAtPurchase: item.price,
      quantity: item.quantity,
      size: item.size
    }));

    if (cart.length === 0) {
      setError('Your shopping cart session is empty.');
      setLoading(false);
      return;
    }

    try {
      // 1. Send checkout request to Express server
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'guest',
          items,
          total,
          address: addressFromUrl,
          gateway: methodType === 'Razorpay' ? 'Razorpay' : (methodType === 'COD' ? 'COD' : 'UPI_Direct'),
          paymentMethod: methodType
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Order creation failed.');
      }

      const activeOrderId = resData.order?.orderId || sessionOrderId;
      const dbId = resData.order?.dbId;

      // 2. Route transaction workflow based on method
      if (methodType === 'Razorpay' && config.isRazorpayEnabled && resData.order?.razorpayOrder) {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error('Failed to load Razorpay Payment Gateway SDK.');
        }

        const options = {
          key: config.razorpayKeyId,
          amount: resData.order.razorpayOrder.amount,
          currency: "INR",
          name: config.merchantName,
          description: `Order Secure Payment - #${activeOrderId}`,
          order_id: resData.order.razorpayOrder.id,
          handler: async function (paymentResponse) {
            setLoading(true);
            try {
              const verifyRes = await fetch('http://localhost:5000/api/orders/payment/verify-razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderId: activeOrderId
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                // Success
                finalizeLocalOrder(activeOrderId, 'Credit Card (Razorpay)', 'Paid');
              } else {
                setError(verifyData.error || 'Payment confirmation signature failed.');
              }
            } catch (err) {
              setError('Failed to securely verify Razorpay transaction.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#1a1a1a'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failRes) {
          setError(failRes.error.description || 'Razorpay payment rejected.');
          setLoading(false);
        });
        rzp.open();
      } 
      else if (methodType === 'UPI') {
        // Direct UPI QR code flow - user has scanned and is prompted to enter UTR to log in database
        setShowUtrField(true);
        setLoading(false);
      } 
      else {
        // Fallback or Cash On Delivery
        finalizeLocalOrder(activeOrderId, methodType, methodType === 'COD' ? 'Pending' : 'Paid');
      }

    } catch (err) {
      console.error("Payment submission failure:", err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  // Submits the 12-digit UTR for UPI Direct payments
  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    if (!utr || utr.length !== 12 || isNaN(utr)) {
      setError('Please enter a valid 12-digit Transaction Reference (UTR) number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/orders/payment/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sessionOrderId,
          utr: utr
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'UTR submission failed.');
      }

      setSuccessMsg('UTR verified! Direct money transfer recorded in database.');
      setTimeout(() => {
        finalizeLocalOrder(sessionOrderId, `UPI Direct (Ref: ${utr})`, 'Paid');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Verification failed. Double check your UTR number.');
      setLoading(false);
    }
  };

  // Completes checkout state in client context and routes to tracking
  const finalizeLocalOrder = (orderId, methodText, paymentStatus) => {
    const finalOrder = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      total,
      paymentMethod: methodText,
      paymentStatus: paymentStatus,
      trackingStatus: 'placed',
      shippingAddress: addressFromUrl || `${user?.address?.street}, ${user?.address?.city}, ${user?.address?.country}`,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        priceAtPurchase: item.price,
        quantity: item.quantity,
        size: item.size
      }))
    };

    setOrders(prev => [finalOrder, ...prev]);
    clearCart();
    router.push(`/orders/track/${orderId}?new=true`);
  };

  // Generate dynamic UPI Deep-Link URL
  const upiUrl = `upi://pay?pa=${config.merchantUpiId}&pn=${encodeURIComponent(config.merchantName)}&am=${total}&cu=INR&tn=${sessionOrderId}`;
  
  // Dynamic QR Code API (high quality, dynamic background, zero imports)
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}&margin=10`;

  const sections = [
    { id: 'UPI', label: 'UPI / Dynamic QR Code', desc: 'Direct Transfer (GPay, PhonePe, Paytm)', icon: '⚡' },
    { id: 'CARD', label: 'Credit / Debit Card', desc: 'Secure Checkout powered by Razorpay', icon: '💳' },
    { id: 'NETBANKING', label: 'Net Banking', desc: 'Secure direct bank transfer', icon: '🏦' },
    { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay when your package arrives', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      {/* Secure Header */}
      <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-500 uppercase hover:text-black transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-1.5 text-black font-semibold text-sm">
            <Lock size={15} className="text-amber-500" />
            <span className="tracking-widest uppercase text-xs">Secure Payment Gateway</span>
          </div>

          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-500" />
            SSL Secured
          </div>
        </div>
      </header>

      {/* Main Payment Checkout Form */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Branded Cart summary */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#121212] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-5 w-44 h-44 rounded-full border-4 border-white" />
            
            <span className="text-[9px] tracking-[0.25em] text-amber-500 font-bold uppercase">Premium Menswear Atelier</span>
            <h1 className="text-3xl font-bold font-serif tracking-wide mt-1 uppercase text-[#F3F3F3]">
              {config.merchantName || 'LOUIS PASTEUR'}
            </h1>
            
            <div className="mt-8 flex flex-col gap-1">
              <span className="text-[10px] tracking-wider text-gray-400 uppercase">Payment Due</span>
              <span className="text-4xl font-serif font-bold text-amber-400">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Order Reference ID</span>
                <span className="font-mono text-white font-semibold">{sessionOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="text-white font-semibold">{cart.length} pcs</span>
              </div>
              <div className="flex justify-between">
                <span>Priority Air Shipping</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Free Delivery</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="text-white font-semibold">{deliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Cart Item Row List */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-gray-800 uppercase mb-4">Purchased Items</h3>
            <div className="flex flex-col divide-y divide-gray-100 max-h-[200px] overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="relative w-10 h-13 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate leading-snug">{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Tabbed Payment Method selectors */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Messages Alert Panels */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium rounded-xl flex items-center gap-2"
              >
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure Payment Options */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-[#FAFAFA]">
              <h2 className="text-xs font-bold tracking-widest text-gray-800 uppercase">Select Payment Option</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">All transactions are secure and encrypted</p>
            </div>

            <div className="divide-y divide-gray-100">
              {sections.map((section) => {
                const isOpen = openSection === section.id;
                return (
                  <div key={section.id} className="transition-colors">
                    {/* Header trigger button */}
                    <button
                      type="button"
                      onClick={() => { setOpenSection(section.id); setError(''); }}
                      className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all hover:bg-gray-50/50 ${isOpen ? 'bg-amber-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          {section.icon}
                        </span>
                        <div>
                          <p className={`text-xs font-bold tracking-wide transition-colors ${isOpen ? 'text-black' : 'text-gray-700'}`}>
                            {section.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{section.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isOpen ? 'border-black bg-black' : 'border-gray-300'}`}>
                        {isOpen && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                    </button>

                    {/* Accordion panel content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden bg-[#FCFCFC] border-t border-gray-50"
                        >
                          <div className="px-6 py-6 flex flex-col gap-4">
                            
                            {/* UPI Panel - Dynamic QR Code & Mobile Deep Links */}
                            {section.id === 'UPI' && (
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                
                                {/* Desktop/Scannable QR Column */}
                                <div className="md:col-span-5 flex flex-col items-center justify-center bg-white p-4 border border-gray-100 rounded-2xl shadow-inner relative group">
                                  <div className="relative w-48 h-48 flex items-center justify-center">
                                    <img
                                      src={qrCodeSrc}
                                      alt="UPI Payment QR Code"
                                      className="object-contain w-full h-full"
                                    />
                                    {/* Central Brand Watermark Overlay */}
                                    <div className="absolute w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm p-1">
                                      <span className="font-serif font-black text-[9px] tracking-tighter text-black">LP</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-amber-50 px-2.5 py-1 rounded-full text-amber-800">
                                    <Clock size={11} />
                                    <span>Expires in {formatTime(countdown)}</span>
                                  </div>
                                </div>

                                {/* Dynamic QR Info & Mobile intent launches */}
                                <div className="md:col-span-7 flex flex-col gap-4">
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-800">Scan via any UPI App</h4>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                                      Scan the dynamic QR code on the left with GPay, PhonePe, Paytm, or BHIM to pay exactly <span className="font-bold text-black">₹{total.toLocaleString('en-IN')}</span> instantly.
                                    </p>
                                  </div>

                                  {/* Mobile quick links */}
                                  <div className="block">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Or Quick Pay via mobile apps</p>
                                    <div className="flex gap-2 flex-wrap">
                                      {[
                                        { name: 'PhonePe', color: '#5F259F', logo: 'P' },
                                        { name: 'GPay', color: '#4285F4', logo: 'G' },
                                        { name: 'Paytm', color: '#002970', logo: 'Py' },
                                        { name: 'BHIM', color: '#E01E35', logo: 'B' }
                                      ].map((app) => (
                                        <a
                                          key={app.name}
                                          href={upiUrl}
                                          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl hover:border-black transition-colors"
                                        >
                                          <div
                                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                            style={{ backgroundColor: app.color }}
                                          >
                                            {app.logo}
                                          </div>
                                          <span className="text-[10px] font-semibold text-gray-700">{app.name}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {!showUtrField ? (
                                    <button
                                      type="button"
                                      onClick={() => handlePaymentSubmit('UPI')}
                                      className="w-full bg-black hover:bg-gray-800 text-white text-[11px] font-bold tracking-widest py-3.5 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      I have paid this amount
                                    </button>
                                  ) : (
                                    <form onSubmit={handleUtrSubmit} className="flex flex-col gap-2.5 pt-3 border-t border-gray-100">
                                      <div>
                                        <label className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">12-Digit Transaction ID / UTR Number</label>
                                        <div className="flex gap-2 mt-1">
                                          <input
                                            type="text"
                                            value={utr}
                                            onChange={e => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                            placeholder="Enter UTR (e.g. 361234567890)"
                                            maxLength={12}
                                            className="flex-grow border border-gray-300 rounded-xl px-4 py-3 text-xs tracking-wider focus:outline-none focus:border-black transition-colors font-mono"
                                            required
                                          />
                                          <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-[11px] font-bold px-5 py-3 rounded-xl transition-colors uppercase shrink-0"
                                          >
                                            {loading ? 'VERIFYING...' : 'VERIFY'}
                                          </button>
                                        </div>
                                      </div>
                                      <p className="text-[9px] text-gray-400">Please enter the 12-digit UTR shown in your bank statement/UPI app transaction details to confirm the transaction.</p>
                                    </form>
                                  )}

                                </div>
                              </div>
                            )}

                            {/* Credit Card Panel */}
                            {section.id === 'CARD' && (
                              <div className="flex flex-col gap-4">
                                {config.isRazorpayEnabled ? (
                                  <div className="text-center py-6 flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                      <Lock size={20} />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-bold text-gray-800">Secure Razorpay Gateway Activated</h4>
                                      <p className="text-[10px] text-gray-400 mt-1 max-w-sm mx-auto">
                                        Pay securely using credit/debit card, netbanking, or wallet via Razorpay checkout overlay.
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handlePaymentSubmit('Razorpay')}
                                      disabled={loading}
                                      className="mt-2 bg-black hover:bg-gray-800 text-white text-[11px] tracking-widest font-bold px-8 py-3.5 rounded-xl transition-colors uppercase shadow-sm"
                                    >
                                      {loading ? 'LOADING SECURE GATEWAY...' : 'OPEN SECURE CHECKOUT'}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-3">
                                    <div className="p-3.5 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-start gap-2.5">
                                      <Lock size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                      <p className="text-[10px] text-amber-800 leading-normal">
                                        <strong>Integration Mode:</strong> The payment page will simulate a secure checkout pipeline. To test actual payments, please configure `RAZORPAY_KEY_ID` or use the <strong>UPI / QR Code</strong> scan.
                                      </p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                      <input
                                        type="text"
                                        placeholder="Card Number"
                                        value={cardNumber}
                                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                        maxLength={19}
                                        className="border border-gray-300 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors font-mono tracking-widest bg-white"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Name On Card"
                                        value={cardName}
                                        onChange={e => setCardName(e.target.value)}
                                        className="border border-gray-300 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors bg-white font-medium"
                                      />
                                      <div className="grid grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Validity (MM/YY)"
                                          value={cardExpiry}
                                          onChange={e => {
                                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                                            setCardExpiry(val);
                                          }}
                                          maxLength={5}
                                          className="border border-gray-300 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors bg-white font-medium"
                                        />
                                        <input
                                          type="password"
                                          placeholder="CVV"
                                          value={cardCvv}
                                          onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                          maxLength={3}
                                          className="border border-gray-300 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors bg-white font-mono tracking-widest"
                                        />
                                      </div>

                                      <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                                        <div
                                          onClick={() => setSaveCard(!saveCard)}
                                          className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${saveCard ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}
                                        >
                                          {saveCard && <Check size={11} strokeWidth={3} />}
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-medium">Save card details securely for future use</span>
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                                            setError('Please fill in all credit card details.');
                                            return;
                                          }
                                          handlePaymentSubmit('Credit Card (Sandbox)');
                                        }}
                                        disabled={loading}
                                        className="w-full py-4 bg-black text-white text-[11px] font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 mt-1"
                                      >
                                        {loading ? 'PROCESSING SECURE PAY...' : `PAY ₹${total.toLocaleString('en-IN')}`}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Net Banking */}
                            {section.id === 'NETBANKING' && (
                              <div className="flex flex-col gap-4">
                                {config.isRazorpayEnabled ? (
                                  <div className="text-center py-4">
                                    <p className="text-xs text-gray-600">Secure Net Banking is managed by Razorpay</p>
                                    <button
                                      type="button"
                                      onClick={() => handlePaymentSubmit('Razorpay')}
                                      className="mt-3 bg-black hover:bg-gray-800 text-white text-[11px] tracking-widest font-bold px-6 py-3 rounded-xl transition-colors uppercase shadow-sm"
                                    >
                                      PAY SECURELY WITH RAZORPAY
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-5 gap-3">
                                      {BANKS.map(bank => (
                                        <button
                                          key={bank.id}
                                          type="button"
                                          onClick={() => setSelectedBank(bank.id)}
                                          className="flex flex-col items-center gap-1.5 group focus:outline-none"
                                        >
                                          <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-[9px] font-bold tracking-wide transition-all duration-200 ${
                                              selectedBank === bank.id
                                                ? 'ring-2 ring-black ring-offset-2 scale-105 shadow-md'
                                                : 'hover:scale-105 border border-gray-100 shadow-sm'
                                            }`}
                                            style={{ backgroundColor: bank.color }}
                                          >
                                            {bank.id}
                                          </div>
                                          <span className={`text-[9px] font-bold tracking-wider uppercase transition-colors ${
                                            selectedBank === bank.id ? 'text-black' : 'text-gray-400'
                                          }`}>{bank.id}</span>
                                        </button>
                                      ))}
                                    </div>

                                    <div className="flex items-center gap-3 py-1">
                                      <div className="flex-grow h-px bg-gray-100" />
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or search other banks</span>
                                      <div className="flex-grow h-px bg-gray-100" />
                                    </div>

                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder="Type name of your bank"
                                        value={bankSearch}
                                        onChange={e => setBankSearch(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors pr-12 bg-white"
                                      />
                                      <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const bank = selectedBank || bankSearch;
                                        if (!bank) { setError('Please select or write a bank name.'); return; }
                                        handlePaymentSubmit(`Net Banking (${bank})`);
                                      }}
                                      disabled={loading || (!selectedBank && !bankSearch)}
                                      className={`w-full py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all ${
                                        (selectedBank || bankSearch) && !loading
                                          ? 'bg-black text-white hover:bg-gray-800'
                                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      }`}
                                    >
                                      {loading ? 'PROCESSING...' : `PAY ₹${total.toLocaleString('en-IN')}`}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* COD (Cash On Delivery) */}
                            {section.id === 'COD' && (
                              <div className="flex flex-col gap-4">
                                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3">
                                  <Truck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">Cash On Delivery (COD)</p>
                                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                                      Pay in cash to our courier executive at the time of delivery. Please ensure exact change is available at your shipping destination.
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handlePaymentSubmit('COD')}
                                  disabled={loading}
                                  className="w-full py-4 bg-black text-white text-[11px] font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                                >
                                  {loading ? 'PROCESSING ORDER...' : 'CONFIRM CASH ON DELIVERY'}
                                </button>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secure Trust Footer badges */}
          <div className="mt-2 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 gap-4 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Shield size={13} className="text-emerald-500" /> PCI-DSS Compliant</span>
              <span className="flex items-center gap-1"><Lock size={13} className="text-amber-500" /> 256-bit SSL Encrypted</span>
            </div>
            <p className="text-center sm:text-right">
              Atelier Security Services · Real-time Dynamic UPI Routing
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xs tracking-widest uppercase font-semibold bg-white">
        Connecting to Secure Atelier Gateways...
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
