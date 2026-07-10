"use client";

import React, { useEffect } from 'react';
import { useAppState } from '@/components/StateContext';
import { ShoppingBag, Truck, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AdminOrders() {
  const { orders, refreshOrders } = useAppState();

  useEffect(() => {
    refreshOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingStatus: newStatus })
      });
      if (res.ok) {
        refreshOrders();
        alert(`Order ${orderId} stage updated to: ${newStatus.replace('_', ' ')}`);
      } else {
        alert('Failed to update order stage.');
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleApproveRefund = async (orderId) => {
    if (!confirm(`Are you sure you want to cancel and refund Order: ${orderId}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Refunded', trackingStatus: 'delivered' })
      });
      if (res.ok) {
        refreshOrders();
        alert(`Refund successfully dispatched for Order: ${orderId}`);
      } else {
        alert('Failed to process refund.');
      }
    } catch (err) {
      console.error(err);
      alert('Error processing refund: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">ORDER LOGISTICS & FULFILLMENT</h2>
        <p className="text-[11px] text-gray-400 mt-1">Manage delivery timeline updates, inspect packaging lines, and process refunds.</p>
      </div>

      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <p className="text-[12px] text-gray-400 text-center py-12">No orders currently registered in the database.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="border border-luxury-border p-6 rounded bg-white flex flex-col gap-4 shadow-sm">
              <div className="flex flex-wrap justify-between items-baseline border-b pb-3 text-[11px] gap-2">
                <div>
                  <span className="text-gray-400 font-medium">ORDER ID:</span>
                  <span className="font-bold text-primary ml-1">{order.orderId}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Customer:</span>
                  <span className="font-bold text-primary ml-1">{order.userEmail || 'customer@louispasteur.com'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Total:</span>
                  <span className="font-bold text-primary ml-1">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Payment Status:</span>
                  <span className={`font-bold ml-1 uppercase ${
                    order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'
                  }`}>{order.paymentStatus}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-1.5 py-1 text-[11px] text-gray-600">
                <span className="font-bold text-[9px] text-primary uppercase tracking-wider block">Items:</span>
                {order.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-luxury-gray/50 px-3 py-1.5 rounded">
                    <span>{it.name} <strong className="text-primary ml-1">({it.size})</strong></span>
                    <span>Qty: {it.quantity} · ₹{(it.priceAtPurchase * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Status updates buttons */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold mr-2">Update Stage:</span>
                {['placed', 'processing', 'quality_check', 'out_for_delivery', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(order.orderId, st)}
                    className={`text-[9px] tracking-wider font-bold py-1.5 px-3 border rounded uppercase transition-all ${
                      order.trackingStatus === st
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-luxury-border text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Refund trigger */}
              {order.paymentStatus === 'Paid' && (
                <div className="border-t border-luxury-border/60 pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">Shipping: <strong>{order.shippingAddress || 'Delhi, India'}</strong></span>
                  <button
                    onClick={() => handleApproveRefund(order.orderId)}
                    className="text-[9px] tracking-wider font-bold border border-red-500 text-red-500 hover:bg-red-50 py-1.5 px-3 rounded uppercase flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={10} /> Process Refund / Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
