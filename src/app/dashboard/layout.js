"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { User, ShoppingBag, Sparkles, CreditCard, MapPin, RefreshCw, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAppState();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { label: 'Profile Overview', href: '/dashboard/profile', icon: User },
    { label: 'Purchase History', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Saved Addresses', href: '/dashboard/addresses', icon: MapPin },
    { label: 'Returns & Exchanges', href: '/dashboard/returns', icon: RefreshCw },
    { label: 'Payment Logs', href: '/dashboard/payments', icon: CreditCard },
  ];

  if (!user) {
    // If not logged in, redirect or display a custom login panel directly in dashboard root
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-12">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-luxury-gray border border-luxury-border p-6 rounded flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-editorial text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-primary">{user.name}</h3>
            <span className="text-[9px] text-gold font-bold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded mt-1 inline-block">
              {user.loyaltyRank} Member
            </span>
          </div>
          <div className="border-t border-luxury-border/60 w-full pt-3 mt-1 flex justify-between text-[10px] text-gray-400">
            <span>Atelier Wallet:</span>
            <span className="font-bold text-primary">₹{user.walletBalance.toFixed(2)}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 text-[12px] p-3 rounded transition-colors ${
                  isActive 
                    ? 'bg-primary text-white font-semibold' 
                    : 'text-gray-600 hover:bg-luxury-gray hover:text-primary'
                }`}
              >
                <link.icon size={14} className={isActive ? "text-gold" : "text-gray-400"} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-[12px] p-3 text-red-500 hover:bg-red-50 rounded transition-colors text-left w-full mt-4"
          >
            <LogOut size={14} />
            <span>Sign Out Profile</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow bg-white border border-luxury-border p-6 md:p-8 rounded min-h-[400px]">
        {children}
      </div>

    </div>
  );
}
