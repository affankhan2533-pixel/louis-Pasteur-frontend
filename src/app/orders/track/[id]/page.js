"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppState } from "@/components/StateContext";
import { CheckCircle2, Truck, Box, ArrowLeft, Star, Heart, ShoppingBag, Package, Gift, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { catalog } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default function TrackOrder() {
  const { id } = useParams();
  const { productsCatalog, orders, addToCart, toggleWishlist, wishlist, user } = useAppState();
  const [order, setOrder] = useState(null);
  const [addedIds, setAddedIds] = useState({});
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const matched = orders.find(o => o.orderId === id);
    setOrder(matched || orders[0]);
  }, [id, orders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsNewOrder(params.get("new") === "true");
    }
  }, []);

  const getWhatsAppUrl = () => {
    if (!order) return "";
    const itemsList = order.items
      .map((item) => `• ${item.name} (${item.size}) x${item.quantity} - ₹${(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const message = `*LOUIS PASTEUR - NEW ORDER*\n` +
      `-----------------------------\n` +
      `*Customer Details:*\n` +
      `👤 Name: ${user?.name || 'Guest Customer'}\n` +
      `📧 Email: ${user?.email || 'Guest Email'}\n` +
      `📍 Address: ${order.shippingAddress || 'N/A'}\n\n` +
      `*Items Ordered:*\n` +
      `${itemsList}\n\n` +
      `*Order Summary:*\n` +
      `✨ *Total Amount:* ₹${order.total.toLocaleString('en-IN')}\n\n` +
      `-----------------------------\n` +
      `Hello! I would like to purchase these shirts (Order ID: *${order.orderId}*). Please contact me to verify details and share payment information.`;

    return `https://wa.me/918655773993?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppRedirect = () => {
    const url = getWhatsAppUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (!isNewOrder || !order) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const url = getWhatsAppUrl();
          if (url) {
            window.location.href = url;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isNewOrder, order, user]);

  if (!order) {
    return <div className="p-20 text-center text-gray-500">Locating tracking coordinates...</div>;
  }

  const steps = [
    { label: "placed", title: "Order Placed", desc: "Secure allocation registered.", icon: <Package size={18} /> },
    { label: "processing", title: "Atelier Processing", desc: "Garment selection initialized.", icon: <Box size={18} /> },
    { label: "quality_check", title: "Quality Assurance", desc: "Sizing tolerances verified.", icon: <Sparkles size={18} /> },
    { label: "out_for_delivery", title: "Transit Dispatch", desc: "Complimentary shipping in transit.", icon: <Truck size={18} /> },
    { label: "delivered", title: "Delivered", desc: "Order received at destination.", icon: <CheckCircle2 size={18} /> },
  ];

  const currentStepIdx = steps.findIndex(s => s.label === order.trackingStatus);

  // Recommended products — shuffle the catalog and pick 8
  const recommended = (productsCatalog || catalog).filter((_, i) => i % 7 !== 0).slice(0, 8);

  const handleQuickAdd = (product) => {
    addToCart(product, "M");
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-[1100px] w-full mx-auto px-6 py-12 flex flex-col gap-12">

        {/* -- Page Header -- */}
        <div className="border-b border-luxury-border pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link href="/dashboard/orders" className="text-[10px] tracking-wider text-gray-400 hover:text-primary flex items-center gap-1 uppercase mb-2">
              <ArrowLeft size={10} /> Back to Purchases
            </Link>
            <span className="text-[9px] text-gold font-bold tracking-[0.2em] uppercase">Live Tracking</span>
            <h1 className="text-xl md:text-2xl font-editorial font-bold text-primary mt-1 uppercase">Track Shipment  ·  {order.orderId}</h1>
          </div>
          <div className="bg-luxury-gray border border-luxury-border p-4 rounded-xl text-[11px] shrink-0 text-center">
            <p className="text-gray-400 uppercase text-[9px] tracking-wider">Estimated Arrival</p>
            <p className="font-bold text-primary text-base mt-0.5">3–5 Business Days</p>
          </div>
        </div>

        {/* -- Order Confirmed Banner -- */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-white shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <p className="text-[10px] tracking-[0.25em] text-green-400 font-bold uppercase">Order Confirmed</p>
            <h2 className="text-lg md:text-2xl font-editorial font-bold mt-1">Your order is on its way!</h2>
            <p className="text-gray-400 text-[11px] mt-1">Payment: <span className="text-white font-semibold">{order.paymentMethod}</span>  ·  Total: <span className="text-gold font-bold">₹{order.total.toLocaleString("en-IN")}</span></p>
            {isNewOrder && countdown > 0 && (
              <p className="text-gold text-[10px] font-bold tracking-wider mt-2 animate-pulse uppercase">
                ⚡ Redirecting to WhatsApp to complete details in {countdown} seconds...
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleWhatsAppRedirect}
              className="text-[10px] tracking-widest font-bold bg-[#25D366] hover:bg-[#20ba5a] text-black px-5 py-3 rounded-lg transition-all uppercase flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageSquare size={13} className="stroke-[2.5]" />
              Confirm on WhatsApp
            </button>
            <Link href="/products" className="text-[10px] tracking-widest font-bold border border-white/20 text-white px-5 py-3 rounded-lg hover:bg-white hover:text-primary transition-all uppercase flex items-center justify-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* -- Stepper Tracker -- */}
        <div className="bg-white border border-luxury-border rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-8">Shipment Progress</h3>
          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 justify-between">
            {/* Connector line desktop */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-luxury-border z-0 hidden lg:block" />
            <div
              className="absolute top-6 left-0 h-0.5 z-0 hidden lg:block bg-gradient-to-r from-primary to-gold transition-all duration-700"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((st, idx) => {
              const done = idx <= currentStepIdx;
              const active = idx === currentStepIdx;
              return (
                <motion.div
                  key={st.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex lg:flex-col items-center gap-4 lg:gap-3 z-10 flex-1"
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${
                    done ? "bg-primary border-primary text-white shadow-lg" : "bg-white border-luxury-border text-gray-300"
                  } ${active ? "ring-4 ring-gold/30 scale-110" : ""}`}>
                    {st.icon}
                  </div>
                  <div className="text-left lg:text-center max-w-[130px]">
                    <p className={`text-[11px] font-bold ${done ? "text-primary" : "text-gray-300"}`}>{st.title}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">{st.desc}</p>
                    {active && <span className="inline-block mt-1 text-[8px] tracking-wider bg-gold text-white px-2 py-0.5 rounded-full uppercase font-bold">Current</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* -- Order Details Grid -- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-luxury-border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-luxury-border pb-3">
              <Truck size={14} className="text-gold" />
              <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase">Shipping Details</h3>
            </div>
            <div className="flex flex-col gap-3 text-[12px]">
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Recipient Address</span>
                <span className="font-semibold text-primary">{order.shippingAddress}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Carrier</span>
                <span className="font-semibold text-primary">Louis Pasteur Premium Insured Air Cargo</span>
              </div>
            </div>
          </div>

          <div className="border border-luxury-border p-6 rounded-xl bg-white shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-luxury-border pb-3">
              <ShoppingBag size={14} className="text-gold" />
              <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase">Items Ordered</h3>
            </div>
            <div className="flex flex-col gap-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[12px]">
                  <div>
                    <span className="font-bold text-primary block truncate max-w-[200px]">{it.name}</span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">Size: {it.size}  ·  Qty: {it.quantity}</span>
                  </div>
                  <span className="font-bold text-primary">₹{(it.priceAtPurchase * it.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="border-t border-luxury-border pt-3 flex justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Total</span>
                <span className="text-lg font-editorial font-bold text-primary">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* -- Gift Wrap Upsell Banner -- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1209] to-[#2d1f0a] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-gold/20"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #c9a84c 0%, transparent 60%)" }} />
          <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 z-10">
            <Gift size={26} className="text-gold" />
          </div>
          <div className="flex-grow z-10 text-center md:text-left">
            <p className="text-[9px] tracking-[0.25em] text-gold font-bold uppercase">Exclusive Offer</p>
            <h3 className="text-white font-editorial font-bold text-lg mt-1">Add Premium Gift Wrapping</h3>
            <p className="text-gray-400 text-[11px] mt-1">Elevate your order with our signature matte black luxury gift box, satin ribbon and personalized note card.</p>
          </div>
          <Link href="/products" className="bg-gold text-white text-[10px] tracking-[0.2em] font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition-all uppercase shrink-0 z-10 shadow-lg">
            Add Gift Box — ₹299
          </Link>
        </motion.div>

        {/* -- YOU MAY ALSO LIKE -- */}
        <section className="flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] text-gold font-bold uppercase">Complete Your Wardrobe</span>
            <h2 className="text-2xl md:text-3xl font-editorial font-bold text-primary">YOU MAY ALSO LIKE</h2>
            <p className="text-[11px] text-gray-400 max-w-md">Curated pieces that pair perfectly with your recent purchase</p>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {recommended.map((product, idx) => {
              const inWishlist = wishlist.some(w => w.id === product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <ProductCard
                    product={product}
                    inWishlist={inWishlist}
                    onWishlistToggle={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-primary text-primary text-[10px] tracking-[0.2em] font-bold px-8 py-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 uppercase"
            >
              <Sparkles size={13} /> View Full Collection
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
