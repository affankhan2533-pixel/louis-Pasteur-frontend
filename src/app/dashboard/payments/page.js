"use client";

import React from 'react';
import { useAppState } from '@/components/StateContext';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export default function PaymentsPage() {
  const { orders } = useAppState();

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">PAYMENT HISTORY LOGS</h2>
        <p className="text-[11px] text-gray-400 mt-1">Verify credit card invoices, UPI receipts, and EMI allocations.</p>
      </div>

      <div className="table-responsive">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-luxury-border text-left">
              <th className="py-2 text-[10px] text-gray-400 uppercase font-bold">Transaction Date</th>
              <th className="py-2 text-[10px] text-gray-400 uppercase font-bold">Order ID</th>
              <th className="py-2 text-[10px] text-gray-400 uppercase font-bold">Payment Method</th>
              <th className="py-2 text-[10px] text-gray-400 uppercase font-bold">Amount Paid</th>
              <th className="py-2 text-[10px] text-gray-400 uppercase font-bold">Gateway Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="border-b border-luxury-border/40 last:border-0 text-[12px] text-primary">
                <td className="py-3 font-semibold">{o.date}</td>
                <td className="py-3 font-mono">{o.orderId}</td>
                <td className="py-3 uppercase">{o.paymentMethod}</td>
                <td className="py-3 font-bold">₹{o.total}.00</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    <CheckCircle2 size={10} /> Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
