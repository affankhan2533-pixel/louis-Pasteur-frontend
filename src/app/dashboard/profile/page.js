"use client";

import React from 'react';
import { useAppState } from '@/components/StateContext';
import { Award, Wallet, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAppState();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">PROFILE OVERVIEW</h2>
        <p className="text-[11px] text-gray-400 mt-1">Manage your Louis Pasteur credentials, loyalty tiers, and credits.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loyalty Tier Card */}
        <div className="bg-primary text-white p-6 rounded flex flex-col justify-between h-40 relative overflow-hidden border border-white/5 shadow">
          {/* Subtle logo graphic */}
          <div className="absolute right-4 bottom-4 text-white/5 font-editorial font-bold text-6xl select-none pointer-events-none">LP</div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gold font-bold tracking-[0.2em] uppercase">LOYALTY MEMBERSHIP</span>
              <h3 className="text-xl font-editorial font-bold mt-1 uppercase tracking-wider">{user.loyaltyRank} TIER</h3>
            </div>
            <Award className="text-gold stroke-1" size={28} />
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="text-[10px] text-gray-400">BENEFITS ENJOYED:</p>
            <p className="text-[11px] text-gold font-semibold uppercase mt-0.5">Complimentary express shipping & tailor returns</p>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-luxury-gray p-6 rounded border border-luxury-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-gray-400 tracking-[0.2em] font-bold uppercase">ATELIER WALLET</span>
              <h3 className="text-xl font-bold text-primary mt-1">₹{user.walletBalance.toFixed(2)}</h3>
            </div>
            <Wallet className="text-primary stroke-1" size={28} />
          </div>

          <div className="border-t border-luxury-border/60 pt-3">
            <p className="text-[10px] text-gray-400">CREDIT EXPIRATION:</p>
            <p className="text-[11px] text-primary font-semibold mt-0.5">Credits remain active indefinitely.</p>
          </div>
        </div>
      </div>



      {/* Preferences Section */}
      <div className="flex flex-col gap-4 border border-luxury-border p-6 rounded bg-white">
        <h4 className="text-[11px] font-bold tracking-[0.1em] text-primary uppercase border-b pb-2 border-luxury-border">Styling Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div className="flex justify-between border-b pb-2 border-luxury-border/40 last:border-0 last:pb-0">
            <span className="text-gray-400">Aesthetic Preset:</span>
            <span className="font-semibold text-primary uppercase">Minimalist Editorial</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-luxury-border/40 last:border-0 last:pb-0">
            <span className="text-gray-400">Preferred Top Size:</span>
            <span className="font-semibold text-primary uppercase">M</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-luxury-border/40 last:border-0 last:pb-0">
            <span className="text-gray-400">Preferred Bottom Size:</span>
            <span className="font-semibold text-primary uppercase">M</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-luxury-border/40 last:border-0 last:pb-0">
            <span className="text-gray-400">Synced Device Count:</span>
            <span className="font-semibold text-gold uppercase">1 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
