"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from './StateContext';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CartDrawer() {
  const router = useRouter();
  const { 
    cart, removeFromCart, updateCartQty, 
    cartOpen, setCartOpen, cms,
    clearCart, setOrders, user
  } = useAppState();
  
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const orderId = 'SV-ORD-' + Math.floor(Math.random() * 900000 + 100000);

    const items = cart.map(item => ({
      productId: item.id,
      name: item.name,
      priceAtPurchase: item.price,
      quantity: item.quantity,
      size: item.size
    }));

    const shippingAddressStr = user?.address 
      ? `${user.address.street}, ${user.address.city}, ${user.address.postalCode}, ${user.address.country}` 
      : 'To be provided via WhatsApp';

    // Register order in database
    try {
      await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'guest_101',
          items,
          total: finalTotal,
          address: user?.address || { street: 'Via WhatsApp', city: 'Via WhatsApp', postalCode: '000000', country: 'India' },
          gateway: 'WhatsApp',
          paymentMethod: 'WhatsApp'
        })
      });
    } catch (apiErr) {
      console.log("API offline, saved order locally.", apiErr);
    }

    // Save locally for tracking
    const newOrder = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      total: finalTotal,
      paymentMethod: 'WhatsApp',
      paymentStatus: 'Pending WhatsApp Confirmation',
      trackingStatus: 'placed',
      shippingAddress: shippingAddressStr,
      items
    };

    setOrders(prev => [newOrder, ...prev]);

    // Construct WhatsApp Message
    const itemsList = cart
      .map((item) => `• ${item.name} (${item.size}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const message = `*LOUIS PASTEUR - NEW WHATSAPP ORDER*\n` +
      `-----------------------------\n` +
      `*Customer Details:*\n` +
      `👤 Name: ${user?.name || 'Guest Customer'}\n` +
      `📧 Email: ${user?.email || 'N/A'}\n\n` +
      `*Items Ordered:*\n` +
      `${itemsList}\n\n` +
      `*Order Summary:*\n` +
      `💰 Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n` +
      `🏷️ Discount Applied: -₹${discountAmount.toLocaleString('en-IN')}\n` +
      `✨ *Total Amount:* ₹${finalTotal.toLocaleString('en-IN')}\n\n` +
      `-----------------------------\n` +
      `Hello! I would like to purchase these shirts (Order ID: *${orderId}*). Please verify details and share payment options.`;

    const whatsappUrl = `https://wa.me/918655773993?text=${encodeURIComponent(message)}`;

    // Reset drawer state and redirect
    setCartOpen(false);
    clearCart();
    setLoading(false);

    // Open WhatsApp in new tab and redirect main window to tracking page
    window.open(whatsappUrl, '_blank');
    router.push(`/orders/track/${orderId}?new=true`);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === cms.couponCode.toUpperCase()) {
      setDiscountPercent(cms.couponDiscount);
      setCouponError('');
      setCouponApplied(true);
    } else {
      setCouponError('Invalid promo code.');
      setDiscountPercent(0);
      setCouponApplied(false);
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-[100] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-luxury-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-gold" />
                <h3 className="text-sm font-semibold tracking-[0.15em] text-primary">SHOPPING BAG</h3>
                <span className="text-[11px] text-gray-400">({cart.length})</span>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-1 hover:text-gold transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Cart Content */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 py-12">
                  <ShoppingBag size={48} className="text-gray-200 stroke-1" />
                  <div>
                    <h4 className="text-[12px] font-bold tracking-[0.1em] text-primary">YOUR BAG IS EMPTY</h4>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-[240px]">Browse our latest collections to add curated luxury pieces.</p>
                  </div>
                  <Link 
                    href="/products" 
                    onClick={() => setCartOpen(false)}
                    className="text-[10px] tracking-[0.2em] font-semibold bg-primary text-white py-3 px-6 hover:bg-gold transition-colors mt-2"
                  >
                    DISCOVER NOW
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-luxury-border pb-4 last:border-0 last:pb-0">
                    <div className="relative w-20 h-24 overflow-hidden border border-luxury-border rounded bg-luxury-gray shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        sizes="80px"
                        className="object-cover object-center" 
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-[12px] font-semibold text-primary">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Size: <span className="font-semibold text-primary">{item.size}</span></p>
                      </div>
                      
                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-luxury-border">
                          <button 
                            onClick={() => updateCartQty(item.id, item.size, -1)}
                            className="p-1 px-2 hover:bg-luxury-gray text-gray-500"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-[11px] font-semibold px-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, item.size, 1)}
                            className="p-1 px-2 hover:bg-luxury-gray text-gray-500"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[12px] font-bold text-primary">₹{item.price * item.quantity}</span>
                      <p className="text-[9px] text-gray-400 mt-0.5">₹{item.price} each</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Summary & Coupon Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-luxury-border bg-luxury-gray flex flex-col gap-4">
                {/* Coupon Code Entry */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="ENTER PROMO CODE (e.g. PASTEUR30)" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full text-[10px] tracking-wider pl-8 pr-3 py-2.5 border border-luxury-border rounded bg-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="text-[10px] font-semibold tracking-wider bg-primary text-white px-4 hover:bg-gold transition-colors rounded"
                  >
                    APPLY
                  </button>
                </form>

                {couponError && <p className="text-[10px] text-red-500 -mt-2">{couponError}</p>}
                {couponApplied && <p className="text-[10px] text-green-600 -mt-2">Promo code applied: {discountPercent}% Off!</p>}

                {/* Subtotals */}
                <div className="flex flex-col gap-2 text-[12px] border-b border-luxury-border pb-3">
                  <div className="flex justify-between text-gray-500">
                    <span>Bag Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Loyalty Shipping</span>
                    <span className="text-gold font-bold uppercase">COMPLIMENTARY</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline py-1">
                  <span className="text-[11px] font-bold tracking-wider">TOTAL ESTIMATE</span>
                  <span className="text-lg font-editorial font-bold text-primary">₹{finalTotal}</span>
                </div>

                {/* WhatsApp Checkout Trigger */}
                <button 
                  onClick={handleWhatsAppCheckout}
                  disabled={loading}
                  className="w-full text-center text-[10px] tracking-[0.25em] font-bold bg-[#25D366] hover:bg-[#20ba5a] text-black py-4 transition-colors rounded shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={13} className="stroke-[2.5]" />
                  {loading ? 'PROCESSING...' : 'CONFIRM VIA WHATSAPP'}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                  <ShieldCheck size={12} className="text-gold" />
                  <span>Fully secured transaction matching high-level compliance.</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
