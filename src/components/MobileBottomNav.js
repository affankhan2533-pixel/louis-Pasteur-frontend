"use client";
 
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingBag, User } from 'lucide-react';
import { useAppState } from './StateContext';
 
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, setCartOpen } = useAppState();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
 
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
 
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-2 h-[64px] relative">
 
        {/* HOME */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center rounded-[14px] w-[64px] h-[52px] transition-all duration-300 ${
            isActive('/') ? 'bg-[#F2F2F2] text-black font-semibold' : 'text-gray-400'
          }`}
          aria-label="Home"
        >
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-[9px] text-black tracking-wide mt-1">Home</span>
        </Link>
 
        {/* EXPLORE */}
        <Link
          href="/products"
          className="flex flex-col items-center justify-center text-gray-800"
          aria-label="Explore"
        >
          <div className="flex items-center gap-1 text-black">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="flex flex-col gap-[3px]">
              <span className="w-[11px] h-[2px] bg-black"></span>
              <span className="w-[8px] h-[2px] bg-black"></span>
            </div>
          </div>
          <span className="text-[9px] text-black tracking-wide mt-1">Explore</span>
        </Link>
 
        {/* NEW */}
        <Link
          href="/products?filter=limited"
          className="flex flex-col items-center justify-center"
          aria-label="New Arrivals"
        >
          <span className="text-black text-[15px] font-black tracking-wide leading-none py-2 px-1">
            NEW
          </span>
        </Link>
 
        {/* CART */}
        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center justify-center text-gray-800 relative"
          aria-label="Cart"
        >
          <div className="relative text-black">
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              {/* Heart outline in center of the bag */}
              <path strokeLinecap="round" strokeLinejoin="round" fill="#E04F4F" stroke="#E04F4F" strokeWidth="1" d="M12 15.3s-1.8-1.5-1.8-2.5c0-.6.4-1 1-1 .4 0 .7.2.8.4.1-.2.4-.4.8-.4.6 0 1 .4 1 1 0 1-1.8 2.5-1.8 2.5z" />
            </svg>
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E04F4F] text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-[1px] border-white">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[9px] text-black tracking-wide mt-1">Cart</span>
        </button>
 
        {/* PROFILE */}
        <Link
          href="/dashboard/profile"
          className="flex flex-col items-center justify-center text-gray-800"
          aria-label="Profile"
        >
          <svg className="w-[20px] h-[20px] text-black" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span className="text-[9px] text-black tracking-wide mt-1">Profile</span>
        </Link>
 
      </div>
 
      {/* iOS safe area spacer */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
