"use client";

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  const { orders } = useAppState();
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    if (!selectedOrder || !reason) return;
    setSuccess(true);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">RETURNS & EXCHANGES</h2>
        <p className="text-[11px] text-gray-400 mt-1">Initiate premium tailor size modifications or catalog exchanges.</p>
      </div>

      {success ? (
        <div className="p-6 bg-green-50 border border-green-200 rounded text-center flex flex-col items-center gap-4">
          <CheckCircle2 size={36} className="text-green-600" />
          <div>
            <h4 className="text-[12px] font-bold text-green-800 uppercase">RETURN REQUEST SUBMITTED</h4>
            <p className="text-[11px] text-green-600 mt-1 max-w-[320px] mx-auto leading-relaxed">
              Approved. Our logistics provider will dispatch a custom sizing courier to pick up the garment and verify the new requirements.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitReturn} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Select Purchase Order</label>
              <select 
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              >
                <option value="">Choose order reference...</option>
                {orders.map((o) => (
                  <option key={o.orderId} value={o.orderId}>Order {o.orderId} — ₹{o.total}.00</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Reason for Exchange or Refund</label>
              <textarea 
                rows="4"
                placeholder="Describe fit modifications or sizing issues (e.g. Chest is too loose, need size S)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 max-w-[240px]"
          >
            <RefreshCw size={12} /> Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
