"use client";

import React from 'react';
import { useAppState } from '@/components/StateContext';
import Link from 'next/link';
import { ShoppingBag, ArrowUpRight, CheckCircle2, Truck, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
  const { orders } = useAppState();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 size={12} className="text-green-600" />;
      case 'placed':
      case 'processing':
      case 'quality_check':
        return <Truck size={12} className="text-gold" />;
      default:
        return <ShoppingBag size={12} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">PURCHASE HISTORY</h2>
        <p className="text-[11px] text-gray-400 mt-1">Review allocations, receipts, and request tracking logistics.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-4">
          <ShoppingBag size={36} className="text-gray-200 stroke-1" />
          <p className="text-[12px] text-gray-400">No purchase records registered under your profile ID.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.orderId} className="border border-luxury-border p-6 rounded bg-white flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-luxury-border/60 pb-3 text-[11px]">
                <div className="flex flex-wrap gap-4 text-gray-500">
                  <div>
                    <span>ORDER ID:</span>
                    <span className="font-bold text-primary ml-1">{order.orderId}</span>
                  </div>
                  <div>
                    <span>DATE:</span>
                    <span className="font-bold text-primary ml-1">{order.date}</span>
                  </div>
                  <div>
                    <span>PAYMENT METHOD:</span>
                    <span className="font-bold text-primary ml-1 uppercase">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-luxury-gray border border-luxury-border px-3 py-1 rounded">
                  {getStatusIcon(order.trackingStatus)}
                  <span className="font-bold text-primary uppercase tracking-wider text-[9px]">{order.trackingStatus.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex flex-col gap-3">
                {order.items.map((item, iidx) => (
                  <div key={iidx} className="flex justify-between items-center text-[12px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{item.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Size/Spec: {item.size} | Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-primary">₹{item.priceAtPurchase * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-luxury-border/60 pt-4 mt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[12px]">
                  <span className="text-gray-400">Total Charged:</span>
                  <span className="font-bold text-primary ml-1.5">₹{order.total}.00</span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Link 
                    href={`/orders/track/${order.orderId}`}
                    className="flex-grow sm:flex-grow-0 text-center text-[10px] tracking-wider font-bold bg-primary text-white hover:bg-gold px-4 py-2.5 transition-colors rounded uppercase"
                  >
                    Track Shipment
                  </Link>
                  <Link 
                    href="/dashboard/returns"
                    className="flex-grow sm:flex-grow-0 text-center text-[10px] tracking-wider font-semibold border border-luxury-border hover:bg-luxury-gray px-4 py-2.5 transition-colors rounded uppercase flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={11} /> Request Return
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
